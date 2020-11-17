const express = require('express')
const http = require('http')

const hostname = 'localhost';
const port = 3000;

const app = express();

app.use((req, res, next) => {
    console.log(req.headers);
    res.statusCode= 200;
    res.setHeader("Content-Type", 'text/html');
    res.end('<html><body><p>Express server is running.</p></body></html>')
})

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`)
})