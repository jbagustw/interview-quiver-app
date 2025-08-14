// api/analyze.js - Simplified Vercel API Route
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For now, we'll simulate the analysis process
    // In production, you would integrate with actual AI services
    
    const { videoData, fileName } = req.body;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock analysis results
    const analysisResult = generateMockAnalysis(fileName);
    
    return res.status(200).json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to analyze interview',
      details: error.message 
    });
  }
}

function generateMockAnalysis(fileName) {
  // Generate realistic-looking scores
  const generateScore = () => Math.floor(Math.random() * 30) + 70; // 70-100 range
  
  const skills = {
    publicSpeaking: {
      score: generateScore(),
      analysis: "Kandidat menunjukkan kemampuan komunikasi yang baik dengan artikulasi jelas dan intonasi yang tepat. Volume suara konsisten dan bahasa tubuh mendukung pesan yang disampaikan.",
      strengths: [
        "Artikulasi jelas dan mudah dipahami",
        "Kepercayaan diri yang baik",
        "Penggunaan bahasa formal yang tepat"
      ],
      improvements: [
        "Perlu meningkatkan variasi intonasi",
        "Mengurangi penggunaan kata pengisi"
      ]
    },
    analyticalThinking: {
      score: generateScore(),
      analysis: "Mampu menganalisis situasi dengan sistematis dan logis. Menunjukkan pemahaman yang baik terhadap konteks permasalahan.",
      strengths: [
        "Pendekatan sistematis dalam analisis",
        "Kemampuan identifikasi pola yang baik",
        "Pemahaman data yang mendalam"
      ],
      improvements: [
        "Perlu lebih detail dalam analisis",
        "Meningkatkan speed of analysis"
      ]
    },
    criticalThinking: {
      score: generateScore(),
      analysis: "Mendemonstrasikan kemampuan evaluasi yang objektif dengan mempertimbangkan berbagai perspektif sebelum mengambil kesimpulan.",
      strengths: [
        "Objektif dalam penilaian",
        "Mempertimbangkan multiple perspectives",
        "Questioning approach yang baik"
      ],
      improvements: [
        "Lebih dalam dalam evaluasi",
        "Meningkatkan devil's advocate thinking"
      ]
    },
    problemSolving: {
      score: generateScore(),
      analysis: "Sangat baik dalam mengidentifikasi akar masalah dan menawarkan solusi yang praktis dan dapat diimplementasikan.",
      strengths: [
        "Identifikasi root cause yang akurat",
        "Solusi praktis dan feasible",
        "Creative problem solving"
      ],
      improvements: [
        "Pertimbangkan lebih banyak alternatif",
        "Risk assessment pada solusi"
      ]
    },
    presentationSkills: {
      score: generateScore(),
      analysis: "Penyampaian informasi terstruktur dengan baik menggunakan framework yang jelas dan mudah diikuti.",
      strengths: [
        "Struktur presentasi yang logis",
        "Visual aids yang efektif",
        "Engagement dengan audience"
      ],
      improvements: [
        "Timing management",
        "Lebih interaktif dengan audience"
      ]
    },
    conflictManagement: {
      score: generateScore(),
      analysis: "Menunjukkan pemahaman yang baik tentang dinamika konflik dan pendekatan win-win solution.",
      strengths: [
        "Empati terhadap berbagai pihak",
        "Mediasi yang efektif",
        "De-escalation techniques"
      ],
      improvements: [
        "Assertiveness dalam situasi sulit",
        "Follow-up setelah resolusi"
      ]
    }
  };

  // Calculate overall score
  const scores = Object.values(skills).map(s => s.score);
  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  // Generate recommendation
  let recommendation;
  if (overallScore >= 85) {
    recommendation = {
      status: 'HIGHLY_RECOMMENDED',
      text: 'Kandidat sangat direkomendasikan untuk posisi Service Ambassador BCA. Menunjukkan kompetensi excellent di hampir semua area.',
      action: 'Proceed to final interview with senior management',
      priority: 'HIGH'
    };
  } else if (overallScore >= 75) {
    recommendation = {
      status: 'RECOMMENDED',
      text: 'Kandidat direkomendasikan dengan beberapa area pengembangan. Potensi yang baik untuk sukses dalam role.',
      action: 'Proceed with additional skills assessment',
      priority: 'MEDIUM'
    };
  } else if (overallScore >= 65) {
    recommendation = {
      status: 'CONDITIONAL',
      text: 'Kandidat dapat dipertimbangkan dengan development program. Menunjukkan potensi namun perlu peningkatan.',
      action: 'Consider for junior position with training',
      priority: 'LOW'
    };
  } else {
    recommendation = {
      status: 'NOT_RECOMMENDED',
      text: 'Kandidat belum memenuhi standar minimal untuk posisi ini.',
      action: 'Suggest reapplication after skill development',
      priority: 'NONE'
    };
  }

  // Generate topics
  const topics = [
    "Customer Service Excellence",
    "Digital Banking Innovation",
    "Problem Resolution",
    "Team Collaboration",
    "Communication Skills",
    "Banking Products Knowledge",
    "Compliance & Ethics",
    "Sales & Cross-selling",
    "Conflict Resolution",
    "Professional Development"
  ];

  // Shuffle and select random topics
  const selectedTopics = topics
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  // Generate mock transcript
  const transcript = `
[00:00:00] Interviewer: Selamat pagi, silakan perkenalkan diri Anda.

[00:00:05] Kandidat: Selamat pagi. Nama saya [Nama Kandidat], lulusan S1 Manajemen dari Universitas Indonesia. Saya memiliki pengalaman 2 tahun di bidang customer service di Bank XYZ.

[00:00:20] Interviewer: Mengapa Anda tertarik dengan posisi Service Ambassador di BCA?

[00:00:25] Kandidat: BCA merupakan bank terkemuka di Indonesia dengan reputasi excellent dalam pelayanan. Saya ingin berkontribusi dalam memberikan pengalaman terbaik kepada nasabah BCA dan mengembangkan karir saya di industri perbankan.

[00:00:45] Interviewer: Bagaimana Anda menangani nasabah yang komplain?

[00:00:50] Kandidat: Pertama, saya akan mendengarkan dengan empati dan tidak menginterupsi. Kedua, saya akan memahami inti permasalahan dan meminta maaf atas ketidaknyamanan yang dialami. Ketiga, saya akan mencari solusi terbaik sesuai dengan kebijakan bank dan kepuasan nasabah.

[00:01:15] Interviewer: Berikan contoh situasi dimana Anda harus menyelesaikan konflik.

[00:01:20] Kandidat: Di tempat kerja sebelumnya, ada nasabah yang marah karena transaksi ATM-nya bermasalah. Saya tenangkan emosi nasabah, investigasi masalahnya, koordinasi dengan tim IT, dan berhasil menyelesaikan dalam 30 menit. Nasabah akhirnya puas dan berterima kasih.

[Transkrip berlanjut...]
  `;

  return {
    fileName: fileName || 'interview_video.mp4',
    analysisDate: new Date().toISOString(),
    duration: '15:23',
    scores: skills,
    overallScore,
    recommendation,
    topics: selectedTopics,
    transcript,
    insights: {
      strengths: [
        "Strong communication skills",
        "Good analytical ability",
        "Customer-focused mindset"
      ],
      developmentAreas: [
        "Enhance technical knowledge",
        "Improve time management",
        "Develop leadership skills"
      ],
      keyCompetencies: [
        "Customer Service: Advanced",
        "Problem Solving: Proficient",
        "Communication: Advanced",
        "Teamwork: Proficient"
      ]
    },
    metadata: {
      processedAt: new Date().toISOString(),
      processingTime: '2.5 minutes',
      confidence: 0.92,
      version: '1.0.0'
    }
  };
}