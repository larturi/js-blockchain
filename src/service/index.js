/* eslint-disable no-console */

import express from 'express';
import Blockchain from '../blockchain';
import Wallet from '../wallet/wallet';
import P2PService, { MESSAGE } from './p2p';

const { HTTP_PORT = 3000 } = process.env;

const app = express();

const blockchain = new Blockchain();
const wallet = new Wallet(blockchain);
const p2pService = new P2PService(blockchain);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/blocks', (req, res) => {
  res.json(blockchain.blocks);
});

app.post('/mine', (req, res) => {
  const { body: { data } } = req;
  const block = blockchain.addBlock(data);

  p2pService.sync();

  res.json({
    blocks: blockchain.blocks.length,
    block,
  });
});

app.get('/transactions', (req, res) => {
  const { memoryPool: { transactions } } = blockchain;
  res.json(transactions);
});

app.post('/transaction', (req, res) => {
  const { body: { recipient, amount } } = req;

  try {
    const tx = wallet.createTransaction(recipient, amount);
    p2pService.broadcast(MESSAGE.TX, tx);
    res.json(tx);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(HTTP_PORT, () => {
  console.info(`Service HTTP:${HTTP_PORT} listening...`);
  p2pService.listen();
});
