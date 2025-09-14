import { createServer, createConnection } from "net";
import dotenv from "dotenv";

dotenv.config();

const LISTEN_PORT = process.env.PROXY_PORT;

const server = createServer((clientSocket) => {});

server.listen(LISTEN_PORT, () => {
  console.log("SOCKS5 proxy server running on port: " + LISTEN_PORT);
});
