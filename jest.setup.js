// Jest setup file for global test configuration

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://localhost:27017/t3d_api_test";
process.env.RABBITMQ_URL = "amqp://localhost:5672";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JAEGER_ENDPOINT = "http://localhost:14268/api/traces";

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  // Helper to create mock request objects
  createMockRequest: (data = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    ...data,
  }),

  // Helper to create mock response objects
  createMockResponse: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    };
    return res;
  },

  // Helper to create mock next function
  createMockNext: () => jest.fn(),
};
