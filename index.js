import { createServer, createConnection } from "net";
import dotenv from "dotenv";

dotenv.config();

const LISTEN_PORT = process.env.PROXY_PORT;
const USERNAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;

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

      //Handle request
      clientSocket.once("data", (req) => {
        const cmd = req[1];
        const addrType = req[3];
        let destAddr, destPort;

        if (addrType === 0x01) {
          destAddr = req.slice(4, 8).join(".");
          destPort = req.readUInt16BE(8);
        } else if (addrType === 0x03) {
          const len = req[4];
          destAddr = req.slice(5, 5 + len).toString();
          destPort = req.readUInt16BE(5 + len);
        } else {
          console.log("Destination address is not valid");
          clientSocket.end();
          return;
        }

        // Connect to destination
        const remoteSocket = createConnection(
          { host: destAddr, port: destPort },
          () => {
            const reply = Buffer.from([
              SOCKS_VERSION,
              0x00,
              0x00,
              0x01,
              0,
              0,
              0,
              0,
              0,
              0,
            ]);
            clientSocket.write(reply);

            clientSocket.pipe(remoteSocket);
            remoteSocket.pipe(clientSocket);
            console.log(
              "Connection Successfull" +
                clientSocket.remoteAddress +
                "->" +
                destAddr +
                " " +
                destPort
            );
          }
        );

        remoteSocket.on("error", (err) => {
          console.error("Remote connection error:" + err.message);
          clientSocket.end();
        });
      });
    });
  });

  clientSocket.on("error", (err) => {
    console.error("Client error:" + err.message);
  });
});

server.listen(LISTEN_PORT, () => {
  console.log("SOCKS5 proxy server running on port: " + LISTEN_PORT);
});
