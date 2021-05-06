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

  it('use sign()', () => {
    const signature = wallet.sign('hola');
    expect(typeof signature).toEqual('object');
    expect(signature).toEqual(wallet.sign('hola'));
  });
});
