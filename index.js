import Block from './src/blockchain/block';

const { genesis } = Block;

const block1 = Block.mine(genesis, 'dato-1');
const block2 = Block.mine(block1, 'dato-2');

genesis.toString();
block1.toString();
block2.toString();
