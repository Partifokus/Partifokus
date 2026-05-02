export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).end();
  const { email } = req.body;
  try {
    const r = await fetch("https://api.sender.net/v2/subscribers", {
      method: "POST",
      headers: {
        "Authorization": "Bearer DIN_API_NYCKEL",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email, groups: ["dGAgE3"] })
    });
    res.status(200).json({ ok: true });
  } catch(e) {
    res.status(500).json({ ok: false });
  }
}