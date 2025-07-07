const {
  createUserSchema,
  getUserByIdSchema,
} = require("../../../../packages/core-utils/dist/validation");
const {
  authenticateToken,
} = require("../../../../packages/core-utils/dist/auth");

describe("User Route Validation", () => {
  it("should validate createUserSchema correctly", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    const result = createUserSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email in createUserSchema", () => {
    const invalidData = {
      name: "John Doe",
      email: "invalid-email",
      password: "password123",
    };

    const result = createUserSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should validate getUserByIdSchema correctly", () => {
    const validData = { id: "123" };
    const result = getUserByIdSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty id in getUserByIdSchema", () => {
    const invalidData = { id: "" };
    const result = getUserByIdSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Auth Middleware", () => {
  it("should have authenticateToken function", () => {
    expect(typeof authenticateToken).toBe("function");
  });
});
