export async function isCallPossible(roomId: string) {
  try {
    const response = await fetch("http://localhost:3000/api/isCallPossible", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });

    const { possible } = await response.json();

    return possible;
  } catch (err) {
    console.error(err);
    return false;
  }
}
