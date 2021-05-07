import Wallet from './wallet';
import Blockchain from '../blockchain';

require('dotenv').config();

const initialBalance = Number(process.env.INITIAL_BALANCE);

describe('Wallet', () => {
  let wallet;
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
    wallet = new Wallet(blockchain);
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

  describe('creating a new transaction ', () => {
    let tx;
    let recipientAddress;
    let amount;

    beforeEach(() => {
      recipientAddress = 'un-recipient-address';
      amount = 5;
      tx = wallet.createTransaction(recipientAddress, amount);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        tx = wallet.createTransaction(recipientAddress, amount);
      });

      it('double the amount substracted from the wallet balance', () => {
        const output = tx.outputs.find(({ address }) => address === wallet.publicKey);
        expect(output.amount).toEqual(wallet.balance - (amount * 2));
      });

      it('clones the `amount` output for the recipient', () => {
        const amounts = tx.outputs
          .filter(({ address }) => address === recipientAddress)
          .map((output) => output.amount);

        expect(amounts).toEqual([amount, amount]);
      });
    });
  });
});
