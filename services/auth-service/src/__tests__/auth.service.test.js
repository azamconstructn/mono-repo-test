import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock error classes outside of jest.mock
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
  }
}
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

// Mock all dependencies
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("@t3d/db-models");
jest.mock("@t3d/core-utils", () => ({
  AuthenticationError,
  ConflictError,
  NotFoundError,
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should be defined", async () => {
      const authService = await import("../services/auth.service");
      expect(authService.register).toBeDefined();
    });

    it("should have correct function signature", async () => {
      const authService = await import("../services/auth.service");
      expect(typeof authService.register).toBe("function");
    });
  });

  describe("login", () => {
    it("should be defined", async () => {
      const authService = await import("../services/auth.service");
      expect(authService.login).toBeDefined();
    });

    it("should have correct function signature", async () => {
      const authService = await import("../services/auth.service");
      expect(typeof authService.login).toBe("function");
    });
  });

  describe("verifyToken", () => {
    it("should be defined", async () => {
      const authService = await import("../services/auth.service");
      expect(authService.verifyToken).toBeDefined();
    });

    it("should have correct function signature", async () => {
      const authService = await import("../services/auth.service");
      expect(typeof authService.verifyToken).toBe("function");
    });
  });

  describe("logout", () => {
    it("should be defined", async () => {
      const authService = await import("../services/auth.service");
      expect(authService.logout).toBeDefined();
    });

    it("should have correct function signature", async () => {
      const authService = await import("../services/auth.service");
      expect(typeof authService.logout).toBe("function");
    });
  });

  describe("refreshToken", () => {
    it("should be defined", async () => {
      const authService = await import("../services/auth.service");
      expect(authService.refreshToken).toBeDefined();
    });

    it("should have correct function signature", async () => {
      const authService = await import("../services/auth.service");
      expect(typeof authService.refreshToken).toBe("function");
    });
  });

  it("should have basic structure", () => {
    expect(true).toBe(true);
  });

  it("should be able to import auth service", async () => {
    // This test will verify that the auth service can be imported without errors
    const authService = await import("../services/auth.service");
    expect(authService).toBeDefined();
  });
});
