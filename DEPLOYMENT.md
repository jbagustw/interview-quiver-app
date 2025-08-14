# 📚 Panduan Deployment BCA Interview Analyzer ke Vercel

## 🎯 Overview
Sistem analisis wawancara otomatis untuk seleksi Service Ambassador Bank BCA menggunakan AI untuk mengevaluasi kompetensi kandidat.

## ✨ Fitur Utama
- 📹 Upload dan analisis video wawancara (hingga 500MB)
- 🎙️ Ekstraksi dan transkripsi audio otomatis
- 🧠 Analisis AI untuk 6 kompetensi kunci
- 📊 Visualisasi hasil dengan persentase
- ☁️ Topic cloud untuk insight cepat
- 📥 Export hasil ke PDF
- 🔐 Secure API dengan rate limiting

## 🚀 Langkah-Langkah Deployment

### 1. Persiapan Awal

```bash
# Clone repository atau buat folder baru
mkdir bca-interview-analyzer
cd bca-interview-analyzer

# Inisialisasi git
git init

# Copy semua file yang sudah dibuat:
# - index.html (masukkan ke folder public/)
# - api/analyze.js
# - package.json
# - vercel.json
# - .env.example
```

### 2. Setup Environment Variables

```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dan masukkan API keys Anda
nano .env
```

#### Mendapatkan API Keys:
- **OpenAI API Key**: Daftar di https://platform.openai.com
- **Anthropic API Key** (opsional): Daftar di https://console.anthropic.com

### 3. Install Dependencies

```bash
# Install semua dependencies
npm install

# Install Vercel CLI global
npm install -g vercel
```

### 4. Setup FFmpeg untuk Audio Processing

Vercel memerlukan FFmpeg layer untuk processing audio:

```bash
# Buat folder layers
mkdir -p layers/ffmpeg

# Download FFmpeg static build
cd layers/ffmpeg
wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
tar -xf ffmpeg-release-amd64-static.tar.xz
mv ffmpeg-*-amd64-static/ffmpeg .
cd ../..
```

### 5. Struktur Folder Final

```
bca-interview-analyzer/
├── api/
│   └── analyze.js
├── public/
│   └── index.html
├── layers/
│   └── ffmpeg/
│       └── ffmpeg
├── package.json
├── vercel.json
├── .env
├── .env.example
└── README.md
```

### 6. Deploy ke Vercel

```bash
# Login ke Vercel
vercel login

# Deploy (development)
vercel

# Deploy ke production
vercel --prod
```

### 7. Konfigurasi di Vercel Dashboard

1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Settings → Environment Variables
4. Tambahkan semua environment variables dari .env

### 8. Setup Custom Domain (Opsional)

```bash
# Tambahkan custom domain
vercel domains add interview.bca.co.id

# Verify domain ownership
vercel domains verify interview.bca.co.id
```

## 🔧 Konfigurasi Tambahan

### Rate Limiting
Edit `vercel.json` untuk mengatur rate limit:

```json
{
  "functions": {
    "api/analyze.js": {
      "maxDuration": 300,
      "memory": 3008,
      "rateLimit": {
        "window": "1m",
        "max": 10
      }
    }
  }
}
```

### CORS Settings
Untuk mengizinkan akses dari domain tertentu:

```javascript
// Di api/analyze.js
res.setHeader('Access-Control-Allow-Origin', 'https://bca.co.id');
res.setHeader('Access-Control-Allow-Methods', 'POST');
```

## 📊 Monitoring & Analytics

### Setup Vercel Analytics
```bash
vercel analytics enable
```

### Setup Logging
```javascript
// Tambahkan di api/analyze.js
import { Logger } from '@vercel/logger';

const logger = new Logger('bca-interview');
logger.info('Analysis started', { fileSize, fileName });
```

## 🐛 Troubleshooting

### Error: File Too Large
- Pastikan `maxFileSize` di vercel.json sesuai
- Check Vercel plan limits (Hobby: 50MB, Pro: 500MB)

### Error: FFmpeg Not Found
- Pastikan FFmpeg layer sudah di-setup
- Tambahkan di vercel.json:
```json
{
  "functions": {
    "api/analyze.js": {
      "includeFiles": "layers/ffmpeg/**"
    }
  }
}
```

### Error: Timeout
- Increase `maxDuration` di vercel.json (max 300s untuk Pro plan)
- Optimize video processing dengan lower quality audio extraction

## 🔐 Security Best Practices

1. **API Key Management**
   - Jangan commit .env file
   - Gunakan Vercel environment variables
   - Rotate keys regularly

2. **Input Validation**
   ```javascript
   // Validate file type
   const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
   if (!allowedTypes.includes(file.mimetype)) {
     throw new Error('Invalid file type');
   }
   ```

3. **Rate Limiting**
   - Implement per-IP rate limiting
   - Use Vercel Edge Middleware untuk protection

4. **Data Privacy**
   - Hapus file temporary setelah processing
   - Enkripsi data sensitif
   - Comply dengan PDPA/GDPR

## 📈 Performance Optimization

### 1. Video Compression
```javascript
// Compress video sebelum processing
ffmpeg(inputPath)
  .outputOptions(['-vcodec libx264', '-crf 28'])
  .save(compressedPath);
```

### 2. Caching Strategy
```javascript
// Implement Redis caching
import Redis from '@vercel/kv';

const cached = await Redis.get(`analysis:${fileHash}`);
if (cached) return cached;
```

### 3. Parallel Processing
```javascript
// Process multiple segments in parallel
const segments = splitAudio(audioPath, 60); // 60 second segments
const results = await Promise.all(
  segments.map(segment => transcribeAudio(segment))
);
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] FFmpeg layer deployed
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Logging enabled
- [ ] Security headers added
- [ ] SSL certificate active
- [ ] Backup strategy in place
- [ ] Monitoring alerts setup

## 📞 Support & Maintenance

### Monitoring Endpoints
- Health Check: `GET /api/health`
- Status: `GET /api/status`
- Metrics: `GET /api/metrics`

### Logs
```bash
# View real-time logs
vercel logs --follow

# View specific function logs
vercel logs api/analyze.js
```

### Rollback
```bash
# List deployments
vercel ls

# Rollback to previous version
vercel rollback [deployment-url]
```

## 🔄 CI/CD dengan GitHub Actions

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📝 License
MIT License - Copyright (c) 2024 BCA Interview Analyzer

## 🤝 Contributors
- HR Team Bank BCA
- IT Development Team
- AI/ML Engineers

---

**Note**: Untuk bantuan lebih lanjut, hubungi tim IT Support atau buka issue di repository.