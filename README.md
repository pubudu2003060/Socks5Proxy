# SOCKS5 Proxy Server (Node.js)

A simple SOCKS5 proxy server implemented in **Node.js**, supporting:

- Basic TCP tunneling
- Username/Password authentication
- Configurable listening port
- Connection logging to file

---

## ⚙️ Setup & Run

### 1. Clone and Install

**Clone this repo** and install dependencies:

```bash
git clone https://github.com/pubudu2003060/Socks5Proxy.git
cd Socks5Proxy
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root with:

```env
PROXY_PORT=1080
USER_NAME=user
PASSWORD=pass
```

### 3. Start the Server

Run the proxy server:

```bash
npm start
```

The server will start and listen on:

```yaml
SOCKS5 proxy server running on port: 1080
```

---

## 🧪 Example Test

Use `curl` to send a request through the proxy:

```bash
curl --socks5 user:pass@127.0.0.1:1080 https://ipinfo.io
```

You should see a JSON response with your proxy's external IP info.

---

## 📂 Logs

Each successful connection is logged to `log_data.txt` in the format:

```ruby
Date: <timestamp> | Client -> <client-ip> | Destination -> <dest-host>:<dest-port>
```

---

## 📋 Requirements

- **Node.js** (v12 or higher)
- **npm** package manager
