import getPeerIdsFromGroup from "@/functions/getPeerIdsFromGroup";
import { describe, it, expect, afterAll, beforeEach, vi } from "vitest";

vi.stubGlobal("fetch", vi.fn());

describe("getPeerIdsFromGroup function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("Should return array of peer ids", async () => {
    const mockPeerIds = {
      ids: [
        "d20d2130-3b82-4f6f-85b6-58e9697b8dc1",
        "a7f73a46-fb86-4334-8cfa-0c3975c8a8ae",
      ],
    };
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPeerIds,
    } as unknown as Response);

    const result = await getPeerIdsFromGroup(
      "3e0cfea7-f610-4a5a-a921-2ee227b8181f"
    );

    expect(result).toEqual(mockPeerIds);
  });

  it("Should return null if there is no such room", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    } as unknown as Response);

    const result = await getPeerIdsFromGroup(
      "3e0cfea7-f610-4a5a-a921-2ee227b8181f"
    );

    expect(result).toEqual(null);
  });
});
