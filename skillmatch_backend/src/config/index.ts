export const config = {
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key',
    port: process.env.PORT || 3000,
    emailService: {
        host: process.env.EMAIL_HOST || 'smtp.example.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASS || 'password'
    }
}; 