let http = require('http'),
    fs = require('fs'),
    url = require('url'),
    multiparty = require('multiparty'),
    port = process.env.PORT || 8080;

// connecting to cloudinary
let cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: 'hstxwzowh',
    api_key: '692532777311551',
    api_secret: 'Moy4_-Xi5LWmYQNbLc-6WtQWkHI'
})

// connecting Database
const { Pool } = require('pg');
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
        case '/create': // Create an item and store inside the Database
            createItem(req, res);
            break;
        case "/action": // Like or Dislike an item
            action(req, res);
            break;
        case "/test.html":
            send_file(res, "test.html");
            break;
        case "/uploadImage":
            receiveImage(req, res);
            break;
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
    let queryText = "SELECT * FROM public.item;";
    try {
        let data = await pool.query(queryText);
        //statusCode = 200;
        res.end(JSON.stringify(data.rows));
    } catch (err) {
        console.log(err);
        //statusCode = 404;
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
    req.on('data', function (chunk) {
        body.push(chunk);
    }).on('end', function () {
        var data = Buffer.concat(body).toString();
        data = JSON.parse(data);
        save(data);
        res.end();
    })
}

async function save(data) {
    let statusCode = 0;
    let id = data.id;
    let name = data.name;
    let category = data.category;
    let manufacturer = data.manufacturer;
    let marketUrl = data.url;

    let queryText = "INSERT INTO public.item(id, name, category, manufacturer, like_count, dislike_count, market_url) \
    VALUES('" + id + "','" + name + "','" + category + "','" + manufacturer + "'," + 0 + "," + 0 + ",'" + marketUrl + "');";

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
        body.push(chunk);
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

function receiveImage(req, res) {
    let form = new multiparty.Form();
    let id = 0;
    form.on('error', (err) => {
        console.log(err);
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('Error');
    });
    form.on('field', (name, value) => {
        if(name === 'id') {
            id = value;
            console.log("ID is " + id);
        }
    })
    form.on('part', (part) => { 
        if(!part.filename) return;
        part.pipe(
            fs.createWriteStream(`./image/${part.filename}`)
        ).on('close', () => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('Success');
            console.log("Filename is " + part.filename);
            storeImage(part.filename, id);
        })
    })
    form.parse(req);
}

async function storeImage(filename, id) {
    var filepath = "./image/" + filename
    var result = await cloudinary.uploader.upload(filepath);
    console.log(result);
    var queryText = "UPDATE public.item SET image='" + result.secure_url + "' WHERE id='" + id + "';";

    try {
        await pool.query(queryText);
    } catch (err) {
        console.log(err);
    }

    fs.unlink(filepath, (err) => {
        if (err) console.log(err);
    })
}

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

