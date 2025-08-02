export const loginUser = async (email: string, password: string) => {
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error((await res.json()).message);
  return res.json(); // { message, token }
};
