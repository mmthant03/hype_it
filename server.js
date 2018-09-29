let http = require("http"),
  fs = require("fs"),
  url = require("url"),
  port = process.env.PORT || 8080;

// connecting Database
const { Pool } = require("pg");
const connectionUrl =
  "postgres://mqjevsmzvtzfbm:4a94df64ee8fe5bc17e09d879441f16b8010ada026f6997b6fb29cf3b5e41471@ec2-50-16-196-57.compute-1.amazonaws.com:5432/d8218gqfsn80ii";
const pool = new Pool({
  connectionString: connectionUrl,
  ssl: true
});
pool.connect();

// starting Server
let server = http.createServer(function(req, res) {
  let uri = url.parse(req.url);
  console.log(req.method + " " + uri.pathname);
  switch (uri.pathname) {
    case "/":
      send_file(res, "index.html");
      break;
    case "/index.html":
      send_file(res, "index.html");
      break;
    case "readData":
      readData(req, res);
    case "createCat":
      createCategory(req, res);
      break;
    case "createItem":
      createItem(req, res);
      break;
    case "likeItem":
      likeItem(req, res);
      break;
    case "dislikeItem":
      dislikeItem(req, res);
      break;
    default:
      res.end("404 not found");
  }
});

server.listen(port);
console.log("Server is listening to port 8080");

// subroutines
function send_file(res, filename) {
  fs.readFile(filename, function(error, content) {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(content, "utf-8");
  });
}

function createCategory(req, res) {}

function createItem(req, res) {}

function likeItem(req, res) {}

function dislikeItem(req, res) {}

function readData(req, res) {}
