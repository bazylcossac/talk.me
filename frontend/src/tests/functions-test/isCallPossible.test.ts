import { vi, afterAll, beforeEach, describe, it, expect } from "vitest";
import { isCallPossible } from "@/functions/isCallPossible";

vi.stubGlobal("fetch", vi.fn());

describe("isCallPossible function", () => {
  beforeEach(() => {
    (globalThis.fetch as vi.Mock).mockClear();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("Should return true if call is possible", async () => {
    const mockRoomId = "3e0cfea7-f610-4a5a-a921-2ee227b8181f";

    (globalThis.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ possible: true }),
    });

    const response = await isCallPossible(mockRoomId);

    expect(response).toEqual(true);
  });

  it("Should return false if call is not possible", async () => {
    const mockRoomId = "3e0cfea7-f610-4a5a-a921-2ee227b8181f";

    (globalThis.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ possible: false }),
    });
    const response = await isCallPossible(mockRoomId);

    expect(response).toEqual(false);
  });
});
