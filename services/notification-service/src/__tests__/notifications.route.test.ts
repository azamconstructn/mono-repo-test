const {
  createNotificationSchema,
  getNotificationByIdSchema,
} = require("../../../../packages/core-utils/dist/validation");
const {
  authenticateToken,
} = require("../../../../packages/core-utils/dist/auth");

describe("Notification Route Validation", () => {
  it("should validate createNotificationSchema correctly", () => {
    const validData = {
      userId: "user123",
      type: "email",
      title: "Test Notification",
      message: "This is a test",
    };
    const result = createNotificationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid type in createNotificationSchema", () => {
    const invalidData = {
      userId: "user123",
      type: "invalid",
      title: "Test Notification",
      message: "This is a test",
    };
    const result = createNotificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should validate getNotificationByIdSchema correctly", () => {
    const validData = { id: "notif123" };
    const result = getNotificationByIdSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty id in getNotificationByIdSchema", () => {
    const invalidData = { id: "" };
    const result = getNotificationByIdSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Auth Middleware", () => {
  it("should have authenticateToken function", () => {
    expect(typeof authenticateToken).toBe("function");
  });
});
