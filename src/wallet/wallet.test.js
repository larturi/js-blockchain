import Wallet from './wallet';

require('dotenv').config();

const initialBalance = Number(process.env.INITIAL_BALANCE);

describe('Wallet', () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it('it is a healty wallet', () => {
    expect(wallet.balance).toEqual(initialBalance);
    expect(typeof wallet.keyPair).toEqual('object');
    expect(typeof wallet.publicKey).toEqual('string');
    expect(wallet.publicKey.length).toEqual(130);
  });
});
