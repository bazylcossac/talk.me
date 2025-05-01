import { vi, afterAll, beforeEach, describe, it, expect } from "vitest";
import { isCallPossible } from "@/functions/isCallPossible";

describe("isCallPossible function", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("Should return true if call is possible", async () => {
    const mockRoomId = "3e0cfea7-f610-4a5a-a921-2ee227b8181f";

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ possible: true }),
    });

    const response = await isCallPossible(mockRoomId);

    expect(response).toEqual(true);
  });

  it("Should return false if call is not possible", async () => {
    const mockRoomId = "3e0cfea7-f610-4a5a-a921-2ee227b8181f";

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ possible: false }),
    });
    const response = await isCallPossible(mockRoomId);

    expect(response).toEqual(false);
  });
});
