const Promise = require('promise');
const baseUrl = process.env.BASE_URL||"https://blockstream.info/api/"

const recordsPerReq = 25
const fetchAtOnce = 125

async function getBlockHash(blockHeight) {
    let res = await fetch(`${baseUrl}block-height/${blockHeight}`)
    if(res.ok){
        res = await res.text()
        return res
    }
    return
}

async function getBlockData(hash) {
    let res = await fetch(`${baseUrl}/block/${hash}`)
    if(res.ok) {
        res = await res.json()
        return res
    }
    return
}

async function getAllTransactions(hash) {
    let transactionsResult = new Map(), index = 0, fetchMore = true
    blockData = await getBlockData(hash)
    txCount = blockData.tx_count
    while(index<txCount && fetchMore){ 
        let fetchPromises = [], count = index + fetchAtOnce
        for(;index<txCount && index<count;index += recordsPerReq){
            fetchPromises.push(fetch(`${baseUrl}block/${hash}/txs/${index}`))
        }
        let res = await Promise.all(fetchPromises)
        console.log("Fetched", index, "transactions", "out of", txCount)
        for(let resElement of res) {
            if(resElement.ok){
                resElement = await resElement.json()
                for(element of resElement){
                    transactionsResult.set(element.txid, element)
                } 
            } else {
                fetchMore = false
                break
            }
        }
    }
    return transactionsResult
}

async function getAllTransactionIDsinBlock(hash) {
    let res = await fetch(`${baseUrl}/block/${hash}/txids`)
    res = await res.json()
    return res
}

module.exports = {
    getBlockHash, 
    getAllTransactions,
    getAllTransactionIDsinBlock
}