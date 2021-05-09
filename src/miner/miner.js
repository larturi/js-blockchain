import { blockchainWallet, Transaction } from '../wallet';
import { MESSAGE } from '../service/p2p';

class Miner {
  constructor(blockchain, p2pService, wallet) {
    this.blockchain = blockchain;
    this.p2pService = p2pService;
    this.wallet = wallet;
  }

  mine() {
    const {
      blockchain: { memoryPool },
      wallet,
      p2pService,
    } = this;

    if (memoryPool.transactions.length === 0) throw Error('There no are no unconfirmed transactions');

    // Incluyo la ganancia del minero en la transaccion
    memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet));

    // Creo el bloque
    const block = this.blockchain.addBlock(memoryPool.transactions);

    // Sincronizo el nuevo bloque en la red
    p2pService.sync();

    // Limpio la MemoryPool
    memoryPool.wipe();

    // Doy aviso a los nodos para que limpien la MemoryPool
    p2pService.broadcast(MESSAGE.WIPE);

    return block;
  }
}

export default Miner;
