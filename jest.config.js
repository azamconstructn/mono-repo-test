module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/services", "<rootDir>/packages"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }],
  },
  transformIgnorePatterns: ["/node_modules/"],
  collectCoverageFrom: [
    "services/**/*.ts",
    "packages/**/*.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testTimeout: 10000,
  moduleNameMapper: {
    "^@t3d/(.*)$": "<rootDir>/packages/$1",
  },
  projects: [
    {
      displayName: "user-service",
      testMatch: ["<rootDir>/services/user-service/**/*.test.ts", "<rootDir>/services/user-service/**/*.test.tsx"],
      testEnvironment: "node",
    },
    {
      displayName: "auth-service",
      testMatch: ["<rootDir>/services/auth-service/**/*.test.ts", "<rootDir>/services/auth-service/**/*.test.tsx"],
      testEnvironment: "node",
    },
    {
      displayName: "notification-service",
      testMatch: ["<rootDir>/services/notification-service/**/*.test.ts", "<rootDir>/services/notification-service/**/*.test.tsx"],
      testEnvironment: "node",
    },
    {
      displayName: "core-utils",
      testMatch: ["<rootDir>/packages/core-utils/**/*.test.ts", "<rootDir>/packages/core-utils/**/*.test.tsx"],
      testEnvironment: "node",
    },
    {
      displayName: "db-models",
      testMatch: ["<rootDir>/packages/db-models/**/*.test.ts", "<rootDir>/packages/db-models/**/*.test.tsx"],
      testEnvironment: "node",
    },
  ],
};
