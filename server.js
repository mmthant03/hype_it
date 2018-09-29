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
// Read respective function for require JSON Object
let server = http.createServer(function (req, res) {
    let uri = url.parse(req.url);
    console.log(req.method + " " + uri.pathname);
    switch (uri.pathname) {
        case "/":
            send_file(res, "index.html");
            break;
        case "/index.html":
            send_file(res, "index.html");
            break;
        case "/read": // Read all the item from the Database 
            readItem(req, res);
            break;
        case "/create": // Create an item and store inside the Database
            createItem(req, res);
            break;
        case "/action": // Like or Dislike an item
            action(req, res);
        default:
            res.end("404 not found");
    }
});

server.listen(port);
console.log("Server is listening to port 8080");

// subroutines
function send_file(res, filename) {
    fs.readFile(filename, function (error, content) {
        res.writeHead(200, { "Content-type": "text/html" });
        res.end(content, "utf-8");
    });
}

function generateID() {
    return Date.now().toString(36);
}

/*  Read and return all items from the database
    method : GET
    responseType : JSON Array
    example : 
    [{
        "id" : "...",
        "name" : "...",
        "category" : "...",
        "manufacturer" : "...",
        "like_count" : "...",
        "dislike_count" : "...",
        "image" : "...",
        "market_url" : "..."
    },
    {
        ...
    }] 
*/
async function readItem(req, res) {
    let statusCode = 0;
    let queryText = "SELECT * FROM public.item;";
    try {
        let data = await pool.query(queryText);
        statusCode = 200;
        res.end(JSON.stringify(data.rows));
    } catch (err) {
        console.log(err);
        statusCode = 404;
    }
}

/*  Create an item and store into database
    note: id is not required. It will be auto-generated. Image data will be updated when we figure out 
    how to send image from client to server.
    method : POST
    responseType : text
    requireDataType : JSON
    example : 
    {
        "name" : "...",
        "category" : "...",
        "manufacturer" : "...",
        "market_url" : "...",
    }

*/

function createItem(req, res) {
    let body = [];
    req.on('data', (chunk) => {
        body.push.chunk;
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("Post Data = " + body);
        body = JSON.parse(body);
        save(body);

    })
}

async function save(data) {
    let statusCode = 0;
    let id = generateID();
    let name = data.name;
    let category = data.category;
    let manufacturer = data.manufacturer;
    let marketUrl = data.market_url;

    let queryText = "INSERT INTO public.item(id, name, category, manufacturer, market_url) \
    VALUES('" + id + "','" + name + "','" + category + "','" + manufacturer + "','" + marketUrl + "');";

    try {
        let response = await pool.query(queryText);
        statusCode = 200;
    } catch (err) {
        console.log(err);
        statusCode = 403;
    }

    return statusCode;

}

/*  Like or Dislike on one specific item
    responseType : text
    requiredDataType : JSON
    example : 
    {
        id : "...",
        action : "..."
    }
    note : action should be only one of two values "like" or "dislike"
*/

function action(req, res) {
    let body = [];
    req.on('data', (chunk) => {
        body.push.chunk;
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("Post Data = " + body);
        body = JSON.parse(body);
        addAction(body);
    })
}

async function addAction(data) {
    let statusCode = 0;
    let id = data.id;
    let queryText = "";
    if (data.action == like) {
        queryText = "UPDATE public.item SET like_count = like_count+1 WHERE id='" + id + "';";
    } else if (data.action == dislike) {
        queryText = "UPDATE public.item SET dislike_count = dislike_count+1 WHERE id='" + id + "';";
    }

    try {
        if (queryText != "") {
            let response = await pool.query(queryText);
        }
        statusCode = 200;
    } catch (err) {
        console.log(err);
        statusCode = 403;
    }

    return statusCode;
};

// implementing this in case if we need to remove like or dislike with user login

// function modifyAction(req, res) {
//     let body = [];
//     req.on('data', (chunk) => {
//         body.push.chunk;
//     }).on('end', () => {
//         body = Buffer.concat(body).toString();
//         console.log("Post Data = " + body);
//         body = JSON.parse(body);         
//         addAction(body);
//     })
// }
