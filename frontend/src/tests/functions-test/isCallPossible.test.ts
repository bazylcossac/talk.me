import { vi, afterAll, beforeEach, describe, it, expect } from "vitest";
import { isCallPossible } from "@/functions/isCallPossible";

vi.stubGlobal("fetch", vi.fn());

describe("isCallPossible function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("Should return true if call is possible", async () => {
    const mockRoomId = "3e0cfea7-f610-4a5a-a921-2ee227b8181f";

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ possible: true }),
    } as unknown as Response);

    const response = await isCallPossible(mockRoomId);

    expect(response).toEqual(true);
  });

  it("Should return false if call is not possible", async () => {
    const mockRoomId = "3e0cfea7-f610-4a5a-a921-2ee227b8181f";

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ possible: false }),
    } as unknown as Response);
    const response = await isCallPossible(mockRoomId);

    expect(response).toEqual(false);
  });
});
