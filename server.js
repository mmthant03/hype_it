var http = require("http"),
  fs = require("fs"),
  url = require("url"),
  port = 8080,
  debug = true;

// server setup
var server = http.createServer(function(req, res) {
  var uri = url.parse(req.url);

  switch (uri.pathname) {
    case "/":
      send_file(res, "index.html");
      break;
    case "/index.html":
      send_file(res, "index.html");
      break;
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

server.listen(process.env.PORT || port);
console.log("listening on 8080");

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
