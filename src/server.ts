import app from './app';
import logger from './config/logger';

// Get port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  logger.info('\n🌸 ================================');
  logger.info('🚀 Framel Backend Server Running');
  logger.info(`📡 Port: ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`⏰ Started at: ${new Date().toISOString()}`);
  logger.info('🌸 ================================\n');
  logger.info('📝 Available endpoints:');
  logger.info(`   Health Check: http://localhost:${PORT}/health`);
  logger.info(`   API Info:     http://localhost:${PORT}/api`);
  logger.info(`   API Docs:     http://localhost:${PORT}/api-docs`);
  logger.info('');
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  logger.warn('\n🛑 Received shutdown signal. Closing server gracefully...');

  server.close(() => {
    logger.info('✅ Server closed successfully');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('⚠️  Forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

export default server;
