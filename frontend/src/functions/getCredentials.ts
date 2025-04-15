export const getCredentials = async () => {
  const response = await fetch("http://localhost:3000/api/getTURNCredentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const configuration = await response.json();

  return configuration;
};
