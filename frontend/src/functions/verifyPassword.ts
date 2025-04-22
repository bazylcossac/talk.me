export async function verifyPassword(password: string, roomId: string) {
  const response = await fetch("http://localhost:3000/api/verifyPassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, roomId }),
  });

  const data = await response.json();
  return data;
}
