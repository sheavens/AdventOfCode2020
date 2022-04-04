const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input14.txt', {encoding: 'utf-8'});
    return data.split(/\r\n|\r|\n/) //split on new lines
};

const toBin = (dec) => dec.toString(2)
const toDec = (bin) => parseInt(bin, 2)
const sum = (arr) => arr.reduce((a,b) => a + b, 0)

const applyMask = (mask, binNum) => mask.map((d,i) => d === 'X' || d === '1' ? d : binNum[i]) 


const split = (str, memSet = new Set()) => {
    // brilliant! generates all permutaions of str replacing 'X' with 0 or 1
    // 'XXXX' will generate all permuations of four 1's and 0's

    if (!str.includes('X')) {
        memSet.add(str)
        return memSet // Base case, no more 'X'
    }    
    // Replacing first 'X' by 0, and also by 1; two recursive calls
    split(str.replace('X', '0'), memSet)
    split(str.replace('X', '1'), memSet)
    return memSet
}

// console.log(split('XXXX'))  Useful! Generates all permutations of 1 and 0, replacing X's

//console.log(split(applyMask('000000000000000000000000000000X1001X'.split(''),
//'000000000000000000000000000000101010'.split('')).join('')))

const solveIt  = async() => {
    // convert lines to array of numbers
    const lines = await readlines()
    let mask = ''.padStart(36,'X')
    let mem, num, maskedMem
    let memMap = new Map(), memSet
    for (let line of lines) {
        if (line.slice(0, 4) === "mask") {
            mask = line.split(" = ")[1]
        } else if (line.slice(0, 3) === "mem") {
            mem = toBin(Number(line.match(/[0-9]+/)[0])) 
            num = toBin(Number((line.split(" = ")[1])))
            maskedMem = applyMask(mask.split(''), mem.padStart(36, '0').split('')).join('')
            memSet = split(maskedMem)  // generate a set of memory locations; all permutations 1 or 0 replacing 'X'
            for (let memLoc of memSet) {  // write the input value to all of the memory locations
                memMap.set(memLoc, num.padStart(36, '0').split('').join(''))
            }
        }
    }
    return sum((Array.from(memMap.values()).map(e => toDec(e))))
}

solveIt().then(console.log)