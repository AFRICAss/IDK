import Server from 'bare-server-node';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import nodeStatic from 'node-static';

const PORT = process.env.PORT || 8080;
const bare = new Server('/bare/', '');

const serve = new nodeStatic.Server('static/');
const fakeServe = new nodeStatic.Server('BlacklistServe/');
const server = http.createServer();
const ws = new WebSocket('ws://sciencehelp2.herokuapp.com/');
console.log("working");

server.on('request', (request, response) => {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    // Code from NebulaServices
    var isLS = ip.startsWith('34.216.110') || ip.startsWith('54.244.51') || ip.startsWith('54.172.60') || ip.startsWith('34.203.250') || ip.startsWith('34.203.254');

    if (isLS)
        fakeServe.serve(request, response);
    else {
        
        if (bare.route_request(request, response))
            return true;

        serve.serve(request, response);
    }
});

ws.on('message', function message(data) {
    console.log('received: %s', data);
});

server.listen(process.env.PORT || 8080);
