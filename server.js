let http = require('http'),
    fs = require('fs'),
    url = require('url'),
    port = process.env.PORT || 8080,
    pg = require('pg');

let server = http.createServer(function (req,res) {
    let uri = url.parse(req.url);
    console.log(req.method + " " + uri.pathname);
});

server.listen(port);
console.log("Server is listening to port 8080");