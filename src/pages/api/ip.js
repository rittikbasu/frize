export default function handler(req, res) {
    let ip;
    const static_ip = process.env.STATIC_IP;

    if (req.headers["x-forwarded-for"]) {
        ip = req.headers["x-forwarded-for"].split(',')[0]
    } else if (req.headers["x-real-ip"]) {
        ip = req.connection.remoteAddress
    } else {
        ip = req.connection.remoteAddress
    }

    if (ip.includes("127.0.0.1") || ip.includes("::1") || ip === "localhost") {
        res.status(200).json({ isRittik: true });
    } else if (ip === static_ip) {
        res.status(200).json({ isRittik: true });
    } else {
        res.status(200).json({ isRittik: false });
    }
}