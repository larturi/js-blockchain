/* eslint-disable no-console */

import { SHA256 } from 'crypto-js';
import adjustDifficult from './modules/adjustDifficult';

require('dotenv').config();

const DIFFICULTY = 3;
class Block {
  constructor(timestamp, previousHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static get genesis() {
    const timestamp = (new Date(2000, 0, 1)).getTime();
    return new this(
      timestamp, undefined, 'ccbc43ae39a917747b280d55ee918fa27069d03fc82e53f04b9fdc7dbfb2d482', 'Data', DIFFICULTY,
    );
  }

  static mine(previousBlock, data) {
    const { hash: previousHash } = previousBlock;
    let timestamp;
    let hash;
    let nonce = 0;
    let { difficulty } = previousBlock;

    do {
      timestamp = Date.now();
      nonce += 1;
      difficulty = adjustDifficult(previousBlock, timestamp);
      hash = Block.hash(timestamp, previousHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, previousHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, previousHash, data, nonce, difficulty) {
    return SHA256(`${timestamp}${previousHash}${data}${nonce}${difficulty}`).toString();
  }

  toString() {
    const {
      timestamp, previousHash, hash, data, nonce, difficulty,
    } = this;

    const salida = `
      Block [${hash}]
      -------------------------------------------------------------------------------
      timestamp:    ${timestamp}
      previousHash: ${previousHash}
      hash:         ${hash}
      data:         ${data}
      nonce:        ${nonce}
      difficulty:   ${difficulty}
    `;

    console.info(salida);

    return salida;
  }
}

export { DIFFICULTY };

export default Block;
