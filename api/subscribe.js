export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).end();
  const { email } = req.body;
  try {
    const r = await fetch("https://api.sender.net/v2/subscribers", {
      method: "POST",
      headers: {
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTNkM2E5M2E4OWE2NTY4NmVmZWY3MDk5ZmEwM2IwNDE3YjYwOTM5ODkzYjBkY2JjYTUzM2MxMWQ2NjNiNzkwNmZjZWY1OGI5YTE5NGRiYmUiLCJpYXQiOjE3Nzc3NTA3NzUuODg4NzczLCJuYmYiOjE3Nzc3NTA3NzUuODg4Nzc1LCJleHAiOjQ5MzEzNTA3NzUuODg2NTk5LCJzdWIiOiIxMDcwNDg1Iiwic2NvcGVzIjpbXX0.jBOs8kyjHKIIyfTcTEGA-QSuiL6Gh-dWlZ_PJl5K1OqVGEF-saELSG8I38gAmjiyFy0Rom-86aGoO8EbAewD5LMOJmuDEMWa4WR8CzSPSSpJJ7S04SF_tZi-zuNEJXtq8Zt5b1KJuKNoZosl3ln0R_6s-gfjh0bbjyFlTy3yl-Fs0KBjFrIAB4biupaxNUqPrCpkwzAEIYwUjQblleTTs-uwdZuLgHALogPEp_FjMMnOfF28C5okdhcWcT2H2lwH1kl_w-h9ff3GediD-z3dE3n6at9W8iyP-b3FhvIBJVmvJ_1ojkLV32CPoSfbUiUFXn_oEX-0QEfBIlGvcSNbx5eKE7uCjd8RyBsyOdRTtTZNvNqv9TEBOK0gBy2Bd803B-s5zrJc0fvpuQDl9UqfoQG1zAmKLC2CVAvS1dywb7gUMAg3ozPxEPoaZh_hFupL48-u_QZofHnFy3h8NCGq0jA6jsBbAWbRafqZaYcdHhx_2vkF1EIWSLgEzXdakMwLJzh6S51f3-gxQMvAwK4deX13mDAlciVNGg3d9nvG4wT-OizuCIUKQvp7j0cVXUFx5aKI94zA9KB7l_S0KOCMqIi_AeyXDRaWMxTbwbikd-Hyp6xUlqAh9Mo0NteGLscgKr2bSj0_yqkrnUY73ElLZhUglVU6AaZChkBFJVa3xAg",
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