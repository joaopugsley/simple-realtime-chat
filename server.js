const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, './public')));
app.set('views', path.join(__dirname, './public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

const chat_history = false;

let messages = [];

io.on('connection', socket => {
    console.log(`[SERVER] -> New socket connected, id: ${socket.id}`);

    if(chat_history === true) socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => { // RECEIVED MESSAGE FROM CLIENT
        if(chat_history === true) messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
        console.log(`[CHAT] -> ${data.author} sent: ${data.message}`);
    });

});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Listening on PORT: ${port}...`)