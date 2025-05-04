export default async function getPeerIdsFromGroup(roomId: string) {
  try {
    const response = await fetch(
      `https://talkme-backend-production.up.railway.app/api/getGroupPeerIds?roomId=${roomId}`
    );
    if (!response.ok) {
      throw new Error("Failed to get peer ids");
    }
    const data = await response.json();
    if (!data) {
      return null;
    }

    return data;
  } catch (err) {
    const error = err as Error;
    console.error(error);
  }
}
