const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input9.txt', {encoding: 'utf-8'});
    return data.split(/\r\n|\r|\n/) //split on new lines
};

const testData = 
[35,
20,
15,
25,
47,
40,
62,
55,
65,
95,
102,
117,
150,
182,
127,
219,
299,
277,
309,
576]

const previous = ( from=0, n=25, data=testData) => data.slice(from, from + n)

const nextNum = (indx, data = testData) => Number(data[indx])

const solvit = async () => {
    let data = await readlines()
    data = data.map(d => Number(d))
    let priorNum = 25
    for (let i = priorNum+1; i < data.length; i++) {
        let next = nextNum(i, data)
        let prior = previous(i - priorNum, priorNum, data)
        let invalid = true
        for (let n of prior) {
            if(prior.includes(next - n) && (next - n) !== next) {
                invalid = false
            } 
        }
        if (invalid) {
            console.log(next, prior)
            return {"n is invalid" : next} //20874512 soln in my case
        }    
    }
    return "all valid"
}

// part 2. Find a contiguous lits of at least two numbers adding to 20874512
// Plan. add up numbers until this total exceeded, then start from the next number.

const max = (arr) => arr.reduce((a,b) => b > a ? b : a)
const min = (arr) => arr.reduce((a,b) => b < a ? b : a)

const solvit2 = async () => {
    let data = await readlines()
    data = data.map(d => Number(d))
    const targetSum = 20874512
    let sum, i, range
    let startFrom = 0
    while (startFrom < data.length) {    
        sum = 0
        startFrom = startFrom + 1
        i = startFrom
        range = []
        while (sum < targetSum) {
            sum = sum + data[i]
            range.push(data[i])
            i = i+1
        }
        if (sum === targetSum) return min(range) + max(range)
    }
    j = j + 1
    return null
}

solvit2().then(console.log)