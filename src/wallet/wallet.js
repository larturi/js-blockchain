/* eslint-disable array-callback-return */
/* eslint-disable no-undef */

import { elliptic, hash } from '../modules';
import Transaction from './transaction';

require('dotenv').config();

class Wallet {
  constructor(blockchain, initialBalance = Number(process.env.INITIAL_BALANCE)) {
    this.balance = initialBalance;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.blockchain = blockchain;
  }

  sign(data) {
    return this.keyPair.sign(hash(data));
  }

  createTransaction(recipientAddress, amount) {
    const { currentBalance, blockchain: { memoryPool } } = this;

    if (amount > currentBalance) throw Error(`Amount: ${amount} exceds current banalce: ${currentBalance}`);

    let tx = memoryPool.find(this.publicKey);

    if (tx) {
      tx.update(this, recipientAddress, amount);
    } else {
      tx = Transaction.create(this, recipientAddress, amount);
      memoryPool.addOrUpdate(tx);
    }

    return tx;
  }

  get currentBalance() {
    const { blockchain: { blocks = [] }, publicKey } = this;
    let { balance } = this;
    const txs = [];

    blocks.forEach(({ data = [] }) => {
      if (Array.isArray(data)) data.forEach((tx) => txs.push(tx));
    });

    const walletInputTxs = txs.filter((tx) => tx.input.address === publicKey);
    let timestamp = 0;

    if (walletInputTxs.length > 0) {
      const recentInputTx = walletInputTxs
        .sort((a, b) => a.input.timestamp - b.input.timestamp)
        .pop();

      balance = recentInputTx.outputs.find(({ address }) => address === publicKey).amount;
      timestamp = recentInputTx.input.timestamp;
    }

    txs
      .filter(({ input }) => input.timestamp > timestamp)
      .forEach(({ outputs }) => {
        outputs.find(({ address, amount }) => {
          if (address === publicKey) balance += amount;
        });
      });

    return balance;
  }

  toString() {
    const { balance, publicKey } = this;

    const salida = `
      Wallet 
      -------------------------------------------------------------------------------
      publicKey:  ${publicKey}
      balance:    ${balance}
    `;

    console.info(salida);

    return salida;
  }
}

export default Wallet;
