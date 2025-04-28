export default async function getPeerIdsFromGroup(roomId: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/getGroupPeerIds?roomId=${roomId}`
    );
    if (!response.ok) {
      throw new Error("Failed to get peer ids");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    const error = err as Error;
    console.error(error);
  }
}
