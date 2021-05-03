import Blockchain from '../blockchain';
import validate from './validate';

describe('validate()', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it('validates a valid chain', () => {
    blockchain.addBlock('bloque1');
    blockchain.addBlock('bloque2');

    expect(validate(blockchain.blocks)).toBe(true);
  });

  it('invalidates a chain with a corrupt genesis block', () => {
    blockchain.blocks[0].data = 'bad-genesisblock';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid Genesis Block');
  });

  it('invalidates a chain with a corrupt previousHash', () => {
    blockchain.addBlock('bloque1');
    blockchain.blocks[1].previousHash = 'hack-hash';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid Previous Hash');
  });

  it('invalidates a chain with a corrupt hash within a block', () => {
    blockchain.addBlock('bloque1');
    blockchain.blocks[1].hash = 'hack-hash';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid Hash');
  });
});
