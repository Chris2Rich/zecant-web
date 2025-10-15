import { WebSocketServer } from 'ws';

export const GET = (req) => {
    // This is a workaround to get the underlying HTTP server
    const server = req.socket.server;

    if (!server.wsServer) {
        server.wsServer = new WebSocketServer({ noServer: true });

        server.on('upgrade', (req, socket, head) => {
            server.wsServer.handleUpgrade(req, socket, head, (ws) => {
                server.wsServer.emit('connection', ws, req);
            });
        });

        server.wsServer.on('connection', (ws, req) => {
            console.log('A user connected');

            ws.on('message', (message) => {
                // Broadcast the message to all connected clients
                server.wsServer.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
            });

            ws.on('close', () => {
                console.log('User disconnected');
            });
        });
    }

    // Indicate that the WebSocket server is running
    return new Response('WebSocket server is running', { status: 200 });
};