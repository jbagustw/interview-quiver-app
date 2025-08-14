// api/analyze.js - Vercel API Route
import formidable from 'formidable';
import { createReadStream } from 'fs';
import { OpenAI } from 'openai';
import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '500mb',
  },
};

// Main handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the uploaded file
    const { file, fields } = await parseForm(req);
    
    if (!file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Process the video
    const result = await analyzeInterview(file.filepath);
    
    // Clean up temp file
    await fs.unlink(file.filepath);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze interview',
      details: error.message 
    });
  }
}

// Parse multipart form data
async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 500 * 1024 * 1024, // 500MB
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ 
        file: files.video?.[0] || files.video,
        fields 
      });
    });
  });
}

// Main analysis function
async function analyzeInterview(videoPath) {
  try {
    // Step 1: Extract audio from video
    console.log('Extracting audio...');
    const audioPath = await extractAudio(videoPath);
    
    // Step 2: Transcribe audio using OpenAI Whisper
    console.log('Transcribing audio...');
    const transcript = await transcribeAudio(audioPath);
    
    // Step 3: Analyze transcript with GPT-4
    console.log('Analyzing transcript...');
    const analysis = await analyzeTranscript(transcript);
    
    // Step 4: Generate skill scores
    console.log('Generating scores...');
    const scores = await generateScores(analysis);
    
    // Step 5: Extract key topics
    console.log('Extracting topics...');
    const topics = await extractTopics(transcript);
    
    // Clean up temp audio file
    await fs.unlink(audioPath);
    
    return {
      success: true,
      data: {
        transcript,
        analysis,
        scores,
        topics,
        timestamp: new Date().toISOString(),
      }
    };
  } catch (error) {
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

// Extract audio from video using ffmpeg
async function extractAudio(videoPath) {
  const tempDir = os.tmpdir();
  const audioPath = path.join(tempDir, `audio_${Date.now()}.mp3`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec('mp3')
      .on('end', () => resolve(audioPath))
      .on('error', reject)
      .run();
  });
}

// Transcribe audio using OpenAI Whisper API
async function transcribeAudio(audioPath) {
  try {
    const audioFile = createReadStream(audioPath);
    
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'id', // Indonesian
      response_format: 'verbose_json',
    });
    
    return response.text;
  } catch (error) {
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

// Analyze transcript using GPT-4
async function analyzeTranscript(transcript) {
  const prompt = `
    Anda adalah ahli HR Bank BCA yang mengevaluasi kandidat Service Ambassador.
    Analisis transkrip wawancara berikut dan berikan penilaian detail untuk:
    
    1. Public Speaking
    2. Analytical Thinking
    3. Critical Thinking
    4. Problem Solving
    5. Presentation Skills
    6. Manajemen Konflik
    
    Transkrip:
    ${transcript}
    
    Berikan analisis dalam format JSON dengan struktur:
    {
      "publicSpeaking": {
        "score": [0-100],
        "analysis": "detail analisis",
        "strengths": ["kekuatan1", "kekuatan2"],
        "improvements": ["area perbaikan1", "area perbaikan2"]
      },
      // ... sama untuk skill lainnya
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Anda adalah expert HR assessor untuk Bank BCA. Berikan analisis objektif dan profesional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error(`GPT analysis failed: ${error.message}`);
  