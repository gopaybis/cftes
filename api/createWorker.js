import { Cf } from "./worker";

const workerUrl = "https://raw.githubusercontent.com/gopaybis/cf/refs/heads/main/worker.js";

/**
 * Membuat multipart form data untuk upload Cloudflare Worker
 */
function generateFormData(workerCode) {
  const metadata = JSON.stringify({
    compatibility_date: "2024-04-17",
    bindings: [],
    main_module: "worker.js",
  });

  return [
    "------WebKitFormBoundarytvoThhvajRSJKhAT",
    'Content-Disposition: form-data; name="worker.js"; filename="worker.js"',
    "Content-Type: application/javascript+module",
    "",
    workerCode,
    "------WebKitFormBoundarytvoThhvajRSJKhAT",
    'Content-Disposition: form-data; name="metadata"; filename="blob"',
    "Content-Type: application/json",
    "",
    metadata,
    "------WebKitFormBoundarytvoThhvajRSJKhAT--",
  ].join("\n");
}

export default async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { email, globalAPIKey, workerName, nodeName } = req.body;

    if (!email || !globalAPIKey || !workerName || !nodeName) {
      return res.status(400).json({
        error: "Missing required fields: email, globalAPIKey, workerName, nodeName",
      });
    }

    // Ambil kode Worker dari GitHub
    const workerResponse = await fetch(workerUrl);
    if (!workerResponse.ok) {
      throw new Error(`HTTP error! status: ${workerResponse.status}`);
    }
    const workerCode = await workerResponse.text();

    // Buat form data
    const workerFormStr = generateFormData(workerCode);

    // Inisialisasi Cloudflare API
    const cf = new Cf(email, globalAPIKey, workerName, nodeName, workerFormStr);

    // Jalankan proses Worker creation
    await cf.getAccount();
    await cf.getSubdomain();
    const { url, node } = await cf.createWorker();

    // Kirim respons akhir
    return res.status(200).json({ url, node });
  } catch (error) {
    console.error("Error in createWorker:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
