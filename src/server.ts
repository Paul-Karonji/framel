import app from './app';

// Get port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log('\n');
  console.log('🌸 ================================');
  console.log('🚀 Framel Backend Server Running');
  console.log('📡 Port:', PORT);
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('⏰ Started at:', new Date().toISOString());
  console.log('🌸 ================================');
  console.log('\n');
  console.log('📝 Available endpoints:');
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`   API Info:     http://localhost:${PORT}/api`);
  console.log('\n');
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal. Closing server gracefully...');

  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

export default server;
