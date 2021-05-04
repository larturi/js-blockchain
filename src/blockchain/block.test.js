import Block from './block';

describe('Block', () => {
  let timestamp;
  let previousBlock;
  let hash;
  let data;

  beforeEach(() => {
    timestamp = new Date(2010, 0, 1);
    previousBlock = Block.genesis;
    data = 'test-data';
    hash = 'h4sh';
  });

  it('create an instance with parameters', () => {
    const block = new Block(timestamp, previousBlock.hash, hash, data);

    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  it('use static mine()', () => {
    const block = Block.mine(previousBlock, data);

    expect(block.hash.length).toEqual(64);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.data).toEqual(data);
  });

  it('use static hash()', () => {
    hash = Block.hash(timestamp, previousBlock, data);
    const hashOutput = '9dab76fcfa21d11876e98c8ebed124f2f01fbc58eac3caa600c55029dd891b41';
    expect(hash).toEqual(hashOutput);
  });

  it('use toString()', () => {
    const block = Block.mine(previousBlock, data);
    expect(typeof block.toString()).toEqual('string');
  });
});
