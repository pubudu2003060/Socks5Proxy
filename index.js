import { createServer, createConnection } from "net";
import dotenv from "dotenv";

dotenv.config();

const LISTEN_PORT = process.env.PROXY_PORT;

// Use SOCKSV5
const SOCKS_VERSION = 0x05;

const server = createServer((clientSocket) => {
  clientSocket.once("data", (data) => {
    console.log(data);
  });

  clientSocket.on("error", (err) => {
    console.error("Client error:" + err.message);
  });
});

server.listen(LISTEN_PORT, () => {
  console.log("SOCKS5 proxy server running on port: " + LISTEN_PORT);
});
