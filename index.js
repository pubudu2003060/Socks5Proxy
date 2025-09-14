import { createServer, createConnection } from "net";
import dotenv from "dotenv";

dotenv.config();

const LISTEN_PORT = process.env.PROXY_PORT;

// Use SOCKSV5
const SOCKS_VERSION = 0x05;

const server = createServer((clientSocket) => {
  clientSocket.once("data", (data) => {
    if (data[0] !== SOCKS_VERSION) {
      console.log("Socket version mismatch: " + clientSocket.remoteAddress);
      clientSocket.end();
      return;
    }

    clientSocket.write(Buffer.from([SOCKS_VERSION, 0x02]));

    //Handle authentication
    clientSocket.once("data", (authData) => {
      const ulen = authData[1];
      const username = authData.slice(2, 2 + ulen).toString();
      const plen = authData[2 + ulen];
      const password = authData.slice(3 + ulen, 3 + ulen + plen).toString();

      if (username === USERNAME && password === PASSWORD) {
        clientSocket.write(Buffer.from([0x01, 0x00]));
        console.log("New client connected:", clientSocket.remoteAddress);
      } else {
        clientSocket.write(Buffer.from([0x01, 0x01]));
        clientSocket.end();
        console.log(
          "Authentication error: " +
            clientSocket.remoteAddress +
            " Username: " +
            username +
            " Password: " +
            password
        );
        return;
      }
    });
  });

  clientSocket.on("error", (err) => {
    console.error("Client error:" + err.message);
  });
});

server.listen(LISTEN_PORT, () => {
  console.log("SOCKS5 proxy server running on port: " + LISTEN_PORT);
});
