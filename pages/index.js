import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    email: "",
    globalAPIKey: "",
    workerName: "",
    nodeName: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/createWorker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat Worker");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyNode = () => {
    navigator.clipboard.writeText(result.node);
    alert("Node string berhasil disalin!");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-400">
          🌐 Cloudflare Worker Creator
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          {["email", "globalAPIKey", "workerName", "nodeName"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field}
              className="bg-gray-800 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Membuat Worker..." : "Buat Worker"}
          </button>
        </form>

        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

        {result && (
          <div className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              ✅ Worker Berhasil Dibuat
            </h2>
            <p>
              <strong>URL:</strong>{" "}
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline"
              >
                {result.url}
              </a>
            </p>
            <p className="mt-2 break-all">
              <strong>Node:</strong> {result.node}
            </p>
            <button
              onClick={copyNode}
              className="mt-3 bg-green-600 hover:bg-green-700 rounded-lg px-3 py-1 text-sm"
            >
              Salin Node
            </button>
          </div>
        )}
      </div>
      <footer className="mt-6 text-xs text-gray-500">
        Made with ❤️ by YourName
      </footer>
    </div>
  );
}
