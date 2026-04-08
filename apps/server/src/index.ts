import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { registerConnectionHandlers } from './handlers/connectionHandler.js';

const PORT = process.env.PORT ?? 3001;
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.get('/ping', (_req, res) => res.json({ ok: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] },
});

io.on('connection', socket => {
  console.log(`[+] ${socket.id} connected`);
  registerConnectionHandlers(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`🃏 Président server listening on port ${PORT}`);
});
