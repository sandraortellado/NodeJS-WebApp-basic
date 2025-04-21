var http  = require('http');
var fs = require('fs')
const { MongoClient } = require('mongodb');
const querystring = require('querystring');

const uri = "mongodb+srv://sortel01:dBBTl83Z20HL93Eu@cluster0.9a9rbxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "assgnmt10";
const collectionName = "places";

server = http.createServer(function(req, res) {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile('index.html', (err, data) => {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
        });
    
    } else if (req.method === 'POST' && req.url === '/process') {
        let body = '';
        
        req.on('data', chunk => { body += chunk.toString(); });

        req.on('end', async () => {
            const parsed = querystring.parse(body);
            const input = parsed.query.trim();
            try {
                await client.connect();
                const db = client.db(dbName);
                const collection = db.collection(collectionName);
        
                let result;
        
                if (/^\d/.test(input)) {
                  //starts with a number
                  result = await collection.findOne({ zipcodes: input });
                } else {
                  //place name
                  result = await collection.findOne({ placeName: input });
                }
        
                console.log("DB Lookup Result:", result);
        
                res.writeHead(200, {'Content-Type': 'text/html'});
                if (result) {
                  res.end(`<h2>${result.placeName}: ${result.zipcodes.join(', ')}</h2>`);
                } else {
                  res.end(`<h2>No match found for "${input}".</h2>`);
                }
        
            } catch (err) {
                console.error("DB error:", err);
                res.writeHead(500);
                res.end("Server error");
            } finally {
                await client.close();
            }
        });
        
    } else {
        res.writeHead(404);
        res.end("Not found");
    }
}).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
}); 