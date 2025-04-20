export const config = {
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key',

    port: parseInt(process.env.PORT || '3000', 10),
  
    // ✅ Add host for app.listen compatibility
    host: process.env.HOST || '0.0.0.0',
  
    // 🔧 Ensure CORS origin is present for frontend connection
    corsOrigin: process.env.ALLOWED_ORIGINS || '*',
  
    // ✅ Email config for future use
    emailService: {
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      user: process.env.EMAIL_USER || 'user@example.com',
      pass: process.env.EMAIL_PASS || 'password'
    }
  };
  