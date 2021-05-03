import Blockchain from './blockchain';
import Block from './block';

describe('Blockchain', () => {
  let blockchain;
  let blockchainNew;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchainNew = new Blockchain();
  });

  it('every blockchain has a genesis block', () => {
    const [genesisBlock] = blockchain.blocks;

    expect(genesisBlock).toEqual(Block.genesis);
    expect(blockchain.blocks.length).toEqual(1);
  });

  it('use addBlock()', () => {
    const data = 'fake-data';
    blockchain.addBlock(data);

    const [, lastBlock] = blockchain.blocks;

    expect(lastBlock.data).toEqual('fake-data');
    expect(blockchain.blocks.length).toEqual(2);
  });

  it('replaces the chain with a alid chain', () => {
    blockchainNew.addBlock('block-1');
    blockchain.replace(blockchainNew.blocks);

    expect(blockchain.blocks).toEqual(blockchainNew.blocks);
  });

  it('does notreplaces the chain with one with less blocks', () => {
    blockchain.addBlock('block-1');
    expect(() => {
      blockchain.replace(blockchainNew.blocks);
    }).toThrowError('Received chain is not longer than current chain');
  });

  it('not replace the chain with one is not valid', () => {
    blockchainNew.addBlock('block-1');
    blockchainNew.blocks[1].data = 'hack-block';
    expect(() => {
      blockchain.replace(blockchainNew.blocks);
    }).toThrowError('Received chain is invalid');
  });
});
