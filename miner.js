/* eslint-disable no-console */

import Blockchain from './src/blockchain';

const blockchain = new Blockchain();

for (let i = 0; i < 10; i += 1) {
  const block = blockchain.addBlock(`block-${i + 1}`);
  block.toString();
}
