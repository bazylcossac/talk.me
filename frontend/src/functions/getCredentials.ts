export const getCredentials = async () => {
  const response = await fetch("https://talkme-backend-production.up.railway.app/api/getTURNCredentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const configuration = await response.json();

  return configuration;
};
