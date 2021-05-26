const PriorityQueue = require("../priorityQueue")

//calculates indegree of nodes and finds initial/starting nodes i.e., nodes with indegree 0
function getInitialNodes(adjList) {
    let initialNodes = []
    for(let [tid, tx] of adjList) {
        let count = 0
        for(let vin of tx["vin"]){
            pid = vin["txid"].split(":")[0]
            if(adjList.get(pid)){ 
                if(!adjList.get(pid)["child"]) adjList.get(pid)["child"] = [] 
                adjList.get(pid)["child"].push(tid)
                count++
            }
        }
        adjList.get(tid)["indeg"] = count
        adjList.get(tid)["parentCount"] = 0
        if(count == 0)
            initialNodes.push(tid)
    }
    return initialNodes
}

//based on topological sort
function topoBasedParentCount(initialNodes, adjList) {
    queue = [...initialNodes]
    order = []
    while(queue.length>0){
        node = queue[0]
        queue.shift()
        order.push(node)
        if(adjList.get(node)["child"])
            for(let cid of adjList.get(node)["child"]){
                if(adjList.get(cid)){
                    adjList.get(cid)["parentCount"] = adjList.get(node)["parentCount"] + 1
                    if(--adjList.get(cid)["indeg"]==0){
                        queue.push(cid)
                    }
                }
            }
    }
}

function findMaxAncestorNodes(adjList, n) {
    const pq = new PriorityQueue.PriorityQueue()
    for([tid, tx] of adjList){
        pq.enqueue(tid, tx["parentCount"])
    }
    console.log("Top", n, "Transactions")
    for(let i=0;i<n;i++){
       let res = pq.dequeue()
       console.log("TxID:", res.val, "No of Parents:", res.priority) 
    }
}

module.exports = {
    getInitialNodes,
    topoBasedParentCount,
    findMaxAncestorNodes
}