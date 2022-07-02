const http = require("http");

const port = process.env.PORT || 2000;

const app = require("./app");

const server = http.createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log("server is running");
});
