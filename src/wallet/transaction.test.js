import Transaction from './transaction';
import Wallet from './wallet';

describe('Transaction', () => {
  let wallet;
  let transaction;
  let amount;
  let recipientAddress;

  beforeEach(() => {
    wallet = new Wallet();
    recipientAddress = 'r3c1p13nt';
    amount = 5;
    transaction = Transaction.create(wallet, recipientAddress, amount);
  });

  it('outputs the `amount` subtracted from the wallet balance', () => {
    const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
    expect(output.amount).toEqual(wallet.balance - amount);
  });

  it('outputs the `amount` added to the recipient', () => {
    const output = transaction.outputs.find(({ address }) => address === recipientAddress);
    expect(output.amount).toEqual(amount);
  });

  describe('Transaction with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 500;
      transaction = undefined;
    });

    it('does not create the transaction', () => {
      expect(() => {
        transaction = Transaction.create(wallet, recipientAddress, amount);
      }).toThrowError(`Amount: ${amount} exceeds balance.`);
    });
  });

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('inputs the sender address of the wallet', () => {
    expect(transaction.input.address).toEqual(wallet.publicKey);
  });

  it('validates a valid transaction', () => {
    expect(Transaction.verify(transaction)).toBe(true);
  });

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 10000;
    expect(Transaction.verify(transaction)).toBe(false);
  });

  describe('and updating a transaction', () => {
    let nextAmount;
    let nextRecipient;

    beforeEach(() => {
      nextAmount = 3;
      nextRecipient = 'next-address-example';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it('substracts the next amount from the sender wallet', () => {
      const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
      expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
    });

    it('outputs an amount for the next recipient', () => {
      const output = transaction.outputs.find(({ address }) => address === nextRecipient);
      expect(output.amount).toEqual(nextAmount);
    });
  });
});
