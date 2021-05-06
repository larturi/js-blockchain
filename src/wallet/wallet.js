import { elliptic, hash } from '../modules';

require('dotenv').config();

const initialBalance = Number(process.env.INITIAL_BALANCE);
class Wallet {
  constructor() {
    this.balance = initialBalance;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data) {
    return this.keyPair.sign(hash(data));
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
