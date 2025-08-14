# .env.example - Copy this to .env and fill in your values

# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: If using Claude/Anthropic instead
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Optional: Database Configuration (if storing results)
DATABASE_URL=postgresql://user:password@localhost:5432/bca_interviews

# Optional: AWS S3 for video storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=bca-interview-videos

# Application Settings
MAX_FILE_SIZE=500MB
ALLOWED_VIDEO_FORMATS=mp4,avi,mov,webm
ANALYSIS_TIMEOUT=300000

# Security
JWT_SECRET=your-jwt-secret-for-authentication
CORS_ORIGIN=https://your-domain.com

# Feature Flags
ENABLE_CACHE=true
ENABLE_LOGGING=true
DEBUG_MODE=false