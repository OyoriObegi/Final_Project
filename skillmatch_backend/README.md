# SkillMatch Backend

A robust backend service for the SkillMatch platform, providing job matching and skill assessment functionality.

## Features

- **User Management**
  - Authentication and authorization
  - Profile management
  - Role-based access control (User, Employer, Admin)

- **Job Management**
  - Job posting and search
  - Application handling
  - Status tracking
  - Skill requirements matching

- **Skill Management**
  - Skill creation and verification
  - Skill categorization
  - Assessment criteria
  - Usage tracking
  - Related skills suggestion

- **Application Management**
  - Application submission
  - Status tracking
  - Document handling
  - Communication

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- TypeORM
- JWT Authentication
- Redis (optional)
- AWS S3 (optional)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Redis (optional)
- AWS Account (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/skillmatch-backend.git
   cd skillmatch-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   # Server
   NODE_ENV=development
   PORT=3000
   API_PREFIX=/api

   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=skillmatch

   # Authentication
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d

   # Email (optional)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASS=your_password
   EMAIL_FROM=noreply@skillmatch.com

   # AWS S3 (optional)
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   AWS_BUCKET_NAME=your_bucket

   # Redis (optional)
   REDIS_URL=redis://localhost:6379
   USE_REDIS_CACHE=false
   ```

4. Set up the database:
   ```bash
   npm run typeorm migration:run
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Jobs

- `GET /api/jobs/search` - Search jobs
- `GET /api/jobs/recommended` - Get recommended jobs
- `POST /api/jobs` - Create a job (Employer only)
- `PUT /api/jobs/:id/status` - Update job status (Employer only)

### Skills

- `GET /api/skills/search` - Search skills
- `GET /api/skills/popular` - Get popular skills
- `POST /api/skills` - Create skill (Admin only)
- `PUT /api/skills/:id/verify` - Verify skill (Admin only)

### Applications

- `POST /api/jobs/:id/apply` - Apply for a job
- `GET /api/jobs/:id/applications` - Get job applications (Employer only)
- `PUT /api/jobs/applications/:id/status` - Update application status (Employer only)

## Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the server:
   ```bash
   npm start
   ```

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t skillmatch-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 skillmatch-backend
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 