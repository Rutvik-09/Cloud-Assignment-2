const http = require("http");
// const axios = require("axios");

const port = process.env.PORT || 8080;

const app = require("./app");

const server = http.createServer(app);

const providedURL = "http://52.23.207.11:8081/ ";

server.listen(port, "0.0.0.0", () => {
  console.log("server is running");

  //   axios
  //     .post(providedURL + "/start", {
  //       banner: "B00897762",
  //       ip: " 18.209.47.229",
  //     })
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
});
