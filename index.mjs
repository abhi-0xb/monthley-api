import app from './src/app.mjs';

const PORT = process.env.PORT;

// Not much differen between server.listen or app.listen,
// unless you want to customize the server instance for eg to add socket.io (https://stackoverflow.com/a/17697134)
// -> var server  = require('http').createServer(app);
// -> var io = require('socket.io').listen(server);
// -> server.listen(PORT);

app.listen(PORT, () => {
    console.log(`Monthley api up on port ${PORT}`);
});
