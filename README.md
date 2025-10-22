# cfworkerback

Backend otomatis untuk membuat dan mendeploy Cloudflare Worker melalui API.

---

## 📍 Endpoint
`POST /createWorker`

### 🧾 Body (JSON)
| Parameter | Tipe | Keterangan |
|------------|------|------------|
| email | string | Email akun Cloudflare |
| globalAPIKey | string | Global API Key Cloudflare |
| workerName | string | Nama Worker yang ingin dibuat |
| nodeName | string | Nama tampilan node |

**Contoh Input**
```json
{
  "email": "user@domain.com",
  "globalAPIKey": "xxxxx",
  "workerName": "myworker",
  "nodeName": "Singapore Node 01"
}
