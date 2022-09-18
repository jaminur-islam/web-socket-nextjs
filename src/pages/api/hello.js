// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const path = require("path");

export default function handler(req, res) {
  console.log("hi path", path);
  res.status(200).json({ name: "John Doe " });
}
