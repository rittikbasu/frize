export default function handler(req, res) {
  let ip;
  const static_ip = process.env.STATIC_IP;

  if (process.env.NODE_ENV === "production") {
    ip =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress;

    if (ip === static_ip) {
      res.status(200).json({ isRittik: true });
    } else {
      res.status(200).json({ isRittik: false });
    }
  } else {
    res.status(200).json({ isRittik: true });
  }
}
