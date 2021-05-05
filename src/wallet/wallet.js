/* eslint-disable new-cap */
/* eslint-disable no-console */

import Elliptic from 'elliptic';

require('dotenv').config();

const ec = new Elliptic.ec('secp256k1');
const initialBalance = Number(process.env.INITIAL_BALANCE);

class Wallet {
  constructor() {
    this.balance = initialBalance;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
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
