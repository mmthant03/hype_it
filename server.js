let http = require('http'),
    fs = require('fs'),
    url = require('url'),
    port = process.env.PORT || 8080;

// connecting Database
const { Pool } = require('pg');
const connectionUrl = "postgres://mqjevsmzvtzfbm:4a94df64ee8fe5bc17e09d879441f16b8010ada026f6997b6fb29cf3b5e41471@ec2-50-16-196-57.compute-1.amazonaws.com:5432/d8218gqfsn80ii";
const pool = new Pool({
    connectionString: connectionUrl,
    ssl: true,
});
pool.connect();

// starting Server
let server = http.createServer(function (req,res) {
    let uri = url.parse(req.url);
    console.log(req.method + " " + uri.pathname);
});

server.listen(port);
console.log("Server is listening to port 8080");