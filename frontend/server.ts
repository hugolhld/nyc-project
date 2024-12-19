import { createServer } from "http";
import express from "express";
import next from "next";
import { Server } from "socket.io";

const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev: true, hostname, port });
const handle = app.getRequestHandler();

let io: Server;

app.prepare().then(() => {
  const expressApp = express();
  
  // Crée un serveur HTTP classique pour Next.js
  const server = createServer(expressApp);

  // Initialise Socket.IO
  io = new Server(server);

  // Gère les connexions Socket.IO
  io.on('connection', (socket) => {
    console.log('Client connecté');
    socket.emit('message', 'Hello from the server!');

    socket.on('message', (message) => {
      console.log(message);
      socket.emit('message', message);
    });

    socket.on('new_arrest', (data) => {
      console.log('Nouvelle arrestation:', data);
      io.emit('new_arrest', data); // Émet l'événement à tous les clients
    });

    socket.on('disconnect', () => {
      console.log('Client déconnecté');
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expressApp.all('*', (req: any, res: any) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});