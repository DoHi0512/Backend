const http = require("http");
const fs = require("fs");
const hostname = "127.0.0.1";
const url = require("url");
const port = 80;
const fileMap = {
  "/": "index.html",
  "/about": "about.html",
  "/contact": "contact.html",
};

let loginData = [{ username: "hi", password: "hello" }];
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url == "/login") {
    req.on("data", (chunk) => {
      const data = chunk.toString();
      const { username, password } = JSON.parse(data);
      if (username == loginData.username && password == loginData.password)
        res.end("success");
      else res.end("fail");
    });
  } else if (req.method === "POST" && req.url == "/create") {
    req.on("data", (chunk) => {
      const data = chunk.toString();
      const { username, password } = JSON.parse(data);
      const newObj = { username: username, password: password };
      loginData.push(newObj);
      console.log(loginData);
      res.end("created");
    });
  } else if (req.method === "GET" && req.url == "/read") {
    res.end(JSON.stringify(loginData));
  } else if (req.method === "PUT" && req.url == "/update") {
    req.on("data", (chunk) => {
      const data = chunk.toString();
      const { username, newUsername, newPassword } = JSON.parse(data);
      loginData = loginData.map((item, idx) =>
        item.username == username
          ? { username: newUsername, password: newPassword }
          : item
      );
      res.end("updated");
    });
  } else if (req.method === "DELETE" && req.url == "/delete") {
    req.on("data", (chunk) => {
      const data = chunk.toString();
      const { username } = JSON.parse(data);
      loginData = loginData.map((item) =>
        item.username == username ? null : item
      );
      res.end("deleted");
    });
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/explain");
    const queryObject = url.parse(req.url, true).query;
    const fileName = fileMap[req.url];
    console.log(queryObject);
    fs.readFile(fileName, (err, data) => {
      res.end(data);
    });
    if (req.url == "/") {
      res.end("hello world\n");
    } else if (req.url == "/admin") {
      res.end("hello admin");
    } else if (req.url == `/hello?name=${queryObject.name}`) {
      res.end(queryObject.name);
    }
  }
});

server.listen(port, hostname, () => {
  console.log(port);
});
