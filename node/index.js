const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 9000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', msg => {
        console.log(`message reveived${msg} from client`);
    })
    ws.send(
        JSON.stringify({
            type: 'connect',
            message: 'Well hello there, I am a WebSocket server',
        })
    );
})


server.listen(port, () => {
    console.log('started listening port');
})




// app.get('/', (req, res) => {
//     res.send('<h1>Ready to build to gather man!!!!!!</h1>');
// })

// app.get('/techbuddies', (req, res) => {
//     res.send('<h1>Awesome buddies!!!!!!</h1>');
// })

// app.listen(port, () => {
//     console.log(`Gather node app listening ${port}`);
// })