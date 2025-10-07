const {
  beforeAll,
  expect,
  describe,
  test,
} = require("@jest/globals");
const { AnythinkClient } = require("../anytinkClient");
const { randomUserInfo, randomItemInfo } = require("../utils");

let anythinkClient;

beforeAll(async () => {
  anythinkClient = new AnythinkClient();
});

describe("Stats Route", () => {
  describe("GET /api/stats", () => {
    test("Returns marketplace statistics", async () => {
      // Fetch stats
      const stats = await anythinkClient.getStats();

      // Verify the stats object has the expected structure
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("users");
      expect(stats).toHaveProperty("items");
      expect(stats).toHaveProperty("comments");

      // Verify all values are numbers
      expect(typeof stats.users).toBe("number");
      expect(typeof stats.items).toBe("number");
      expect(typeof stats.comments).toBe("number");

      // Verify all values are non-negative
      expect(stats.users).toBeGreaterThanOrEqual(0);
      expect(stats.items).toBeGreaterThanOrEqual(0);
      expect(stats.comments).toBeGreaterThanOrEqual(0);
    });

    test("Stats reflect actual data - user count increases after user creation", async () => {
      // Get initial stats
      const initialStats = await anythinkClient.getStats();
      const initialUserCount = initialStats.users;

      // Create a new user
      await anythinkClient.createUser(randomUserInfo());

      // Get updated stats
      const updatedStats = await anythinkClient.getStats();

      // Verify user count increased by at least 1
      expect(updatedStats.users).toBeGreaterThanOrEqual(initialUserCount + 1);
    });

    test("Stats reflect actual data - item count increases after item creation", async () => {
      // Create a user first (needed to create items)
      const user = await anythinkClient.createUser(randomUserInfo());

      // Get initial stats
      const initialStats = await anythinkClient.getStats();
      const initialItemCount = initialStats.items;

      // Create a new item
      await anythinkClient.createItem(randomItemInfo(), user);

      // Get updated stats
      const updatedStats = await anythinkClient.getStats();

      // Verify item count increased by at least 1
      expect(updatedStats.items).toBeGreaterThanOrEqual(initialItemCount + 1);
    });
  });
});
