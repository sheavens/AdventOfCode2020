// output the nth number of a spen sequence. start of sequnce given. Continues
// with each sucessive number being the interval sice that number last occured (was spoken), or 0

const input = [0,13,16,17,1,10,6]

let seq = input.reverse()

const lastTime = (arr) => !arr.includes(arr[0]) ? 0 : arr.slice(1).indexOf(arr[0]) + 1

while (seq.length < 2020) {
    seq.unshift(lastTime(seq))
}
console.log(seq[0])

// part 2 - faster soln needed - used map to save just last occurrence of a value

const order = [0,13,16,17,1,10]
//const order = [0,3]
let next = 6
let last
let seqMap = new Map()
for (let i in order) {
    seqMap.set(order[i], Number(i))
}
for (let indx = order.length; indx < 30000000; indx++) {
    last = next
    next = !(seqMap.get(last) === undefined) ? indx - seqMap.get(last) : 0
    seqMap.set(last, indx)
}

console.log(last)
