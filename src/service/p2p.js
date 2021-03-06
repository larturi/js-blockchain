/* eslint-disable no-console */

import WebSocket from 'ws';

const { P2P_PORT = 5000, PEERS } = process.env;
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGE = {
  BLOCKS: 'blocks',
  TX: 'transaction',
  WIPE: 'whipe_memorypool',
};

class P2PService {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on('connection', (socket) => this.onConnection(socket));

    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.onConnection(socket));
    });

    console.info(`Service ws:${P2P_PORT} listening...`);
  }

  onConnection(socket) {
    console.info('[ws:socket] connected.');
    this.sockets.push(socket);
    socket.on('message', (message) => {
      const { type, value } = JSON.parse(message);

      try {
        if (type === MESSAGE.BLOCKS) this.blockchain.replace(value);
        else if (type === MESSAGE.TX) this.blockchain.memoryPool.addOrUpdate(value);
        else if (type === MESSAGE.WIPE) this.blockchain.memoryPool.wipe();
      } catch (error) {
        console.error(`[ws:message] error ${error}`);
        throw Error(error);
      }
    });

    const { blockchain: { blocks } } = this;

    socket.send(JSON.stringify({ type: MESSAGE.BLOCKS, value: blocks }));
  }

  broadcast(type, value) {
    console.info(`[ws:broadcast] ${type}`);
    const message = JSON.stringify({ type, value });
    this.sockets.forEach((socket) => { socket.send(message); });
  }

  sync() {
    const { blockchain: { blocks } } = this;
    this.broadcast(MESSAGE.BLOCKS, blocks);
  }
}

export { MESSAGE };

export default P2PService;
