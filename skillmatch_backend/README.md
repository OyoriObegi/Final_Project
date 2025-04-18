# SkillMatch Backend

Backend API for the SkillMatch AI platform, built with Node.js, Express, and PostgreSQL.

## Features

- User authentication and authorization
- Job posting and management
- Job application tracking
- Skill matching and recommendations
- Portfolio management
- AI-powered resume analysis
- Career path suggestions

## Prerequisites

- Node.js (>=14.0.0)
- PostgreSQL (>=12.0)
- Google Cloud Storage account (for file uploads)
- OpenAI API key (for AI features)
- Google AI API key (for AI features)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skillmatch.git
cd skillmatch/skillmatch_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skillmatch_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# AI Services Configuration
OPENAI_API_KEY=your_openai_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Storage Configuration
GCLOUD_PROJECT_ID=your_project_id
GCLOUD_BUCKET_NAME=your_bucket_name
GCLOUD_KEY_FILE=path_to_your_key_file.json

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

4. Set up the database:
```bash
npm run migrate
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create a new job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `GET /api/jobs/recommended` - Get recommended jobs

### Applications

- `POST /api/applications` - Submit job application
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id/status` - Update application status

### Skills

- `GET /api/skills` - Get all skills
- `GET /api/skills/popular` - Get popular skills
- `POST /api/skills` - Create new skill (admin only)
- `PUT /api/skills/user` - Update user's skills

### Portfolio

- `POST /api/portfolios` - Create portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `GET /api/portfolios` - Get user's portfolios
- `GET /api/portfolios/:id` - Get portfolio details
- `DELETE /api/portfolios/:id` - Delete portfolio

### AI Services

- `POST /api/ai/analyze-resume` - Analyze resume text
- `GET /api/ai/career-path` - Get career path suggestions

## Testing

Run tests using:
```bash
npm test
```

## Linting

Check code style using:
```bash
npm run lint
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 