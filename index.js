global.fetch = require("node-fetch");
const { utils } = require('./utils')
const graph = require('./graph')

const blockHeight = process.env.BLOCK_HEIGHT||"680000"
let blockHash

//AdjacencyMap
let allTransactions

setup = async() => {
    blockHash = await utils.getBlockHash(blockHeight)
    console.log("Block Height:", blockHeight)
    console.log("Block Hash:", blockHash)
    if(blockHash){
        allTransactions = await utils.getAllTransactions(blockHash)
    }
}

(async function (){
    await setup()
    let initialNodes = graph.getInitialNodes(allTransactions)
    graph.topoBasedParentCount(initialNodes, allTransactions)
    graph.findMaxAncestorNodes(allTransactions, 10)
})()