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
    const { balance, blockchain: { memoryPool } } = this;

    if (amount > balance) throw Error(`Amount: ${amount} exceds current banalce: ${balance}`);

    let tx = memoryPool.find(this.publicKey);

    if (tx) {
      tx.update(this, recipientAddress, amount);
    } else {
      tx = Transaction.create(this, recipientAddress, amount);
      memoryPool.addOrUpdate(tx);
    }

    return tx;
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
