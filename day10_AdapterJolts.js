const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input10.txt', {encoding: 'utf-8'});
    return data.split(/\r\n|\r|\n/) //split on new lines
};

let testData = [
    28,
    33,
    18,
    42,
    31,
    14,
    46,
    20,
    48,
    47,
    24,
    23,
    49,
    45,
    19,
    38,
    39,
    11,
    1,
    32,
    25,
    35,
    8,
    17,
    7,
    9,
    4,
    2,
    34,
    10,
    3,
]

const max = (arr) => arr.reduce((a,b) => b > a ? b : a)
const filterOnes = (arr) => arr.filter(a => a === 1)
const filterThrees = (arr) => arr.filter(a => a === 3)

const adapterArray = (adapterSet, last = 0, diff) => {
    if (adapterSet.size === 0) return []
    let diffs = []
    let options = [last+1, last+2, last+3]
    for (let opt of options) {
        if (adapterSet.has(opt)) {
            adapterSet.delete(opt)
            diffs = adapterArray(adapterSet, opt, diff = opt - last)
            if (diffs !== null) return [...diffs,  diff]
            adapterSet.add(opt)  // the first opt replaced for next iteration
        }  
    }
    return null // no option available, backtrack
}

const removeElement = (arr, el) => arr.filter(e => e !== el)
const union = (setA, setB) => new Set([...setA, ...setB])

const recur = (arr, n, final, memo = new Map()) => {
    let ans1, ans2, ans3
    if (memo.has(n)) return memo.get(n)
    if (!arr.includes(n)) return 0 // option not available
    if (n === final) {
        return 1
    }
    n = n + 1
    ans1 = recur(arr, n, final, memo)
    memo.set(n, ans1) 
    ans2 = recur(arr, n+1, final, memo) 
    memo.set(n+1, ans2)
    ans3 = recur(arr, n+2, final, memo)
    memo.set(n+2, ans3)
    
    return ans1 + ans2 + ans3
}

const solvit2 = async () => {
    let data = await readlines()
    // let data = testData.map(d => Number(d))
    data = data.map(d => Number(d))
    data = data.sort((a, b) => a - b)
    let adapterArr = [...data, max(data)+3, 0] // add the first and last connector
    //const paths = adapterArrayPart2(adapterArr, 0, max(data)+3)
    const paths = recur(adapterArr, 0, max(data)+3)
    return paths
}

const solvit = async () => {
    // let data = await readlines()
    let data = testData
    data = data.map(d => Number(d))
    const adapterSet = new Set(data)
    adapterSet.add(max(data)+3) // final connection is 3 higher than the max in the set
    const sequence = adapterArray(adapterSet)
    return filterOnes(sequence).length * filterThrees(sequence).length
}

solvit2().then(console.log)