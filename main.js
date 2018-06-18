const SHA256=require('crypto-js/sha256')
class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}
class Block{
    constructor(timestamp,transactions,previousHash=''){
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.Hash=this.calculateHash();
        this.nonce=0;
    }
    calculateHash(){
       return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.Hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
            this.nonce++;
            this.Hash=this.calculateHash();
        }
        console.log("BLock mined "+this.Hash);
    }

}
class BlockChain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
        this.difficulty=2;
        this.pendingTransactions=[];
        this.miningReward=100;
    }
    createGenesisBlock(){
        return new Block("18/06/2018","Gensis Block",0);
    }
    getlatestblock(){
        return this.chain[this.chain.length-1];
    }
    minependingTransactions(miningRewardAddress){
        let Bloc=new Block(Date.now(),this.pendingTransactions);
        Bloc.mineBlock(this.difficulty);

        console.log("Block has been mined successfully");
        this.chain.push(Bloc);
        this.pendingTransactions=[
            new Transaction(null,miningRewardAddress,this.miningReward)
        ];
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);

    }
    getBalanceOfAddress(address){
        let balance=0;
    for(const block of this.chain){
        for(const trans of block.transactions){
           if(trans.fromAddress===address){
               balance=balance-trans.amount;
           }
           if(trans.toAddress===address){
               balance=balance+trans.amount;
           }
        }
    }
    return balance;
    }
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            if(currentBlock.Hash!==currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash!==previousBlock.Hash){
                 return false;
            }
        }
        return true;
    }
}

let blocks=new BlockChain();
blocks.createTransaction(new Transaction("address1","address2",100));
blocks.createTransaction(new Transaction("address2","address1",50));

console.log("\n Starting the miner...");
blocks.minependingTransactions("harish-address");
console.log("Balance of Harish is "+blocks.getBalanceOfAddress("harish-address"));

console.log("\n Starting the miner again...");
blocks.minependingTransactions("harish-address");
console.log("Balance of Harish is "+blocks.getBalanceOfAddress("harish-address"));
