const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input13.txt', {encoding: 'utf-8'});
    return data.split(/\r\n|\r|\n/) //split on new lines
};

const mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'
/* mem[8] = 11
mem[7] = 101
mem[8] = 0 */

const toBin = (dec) => dec.toString(2)
const toDec = (bin) => parseInt(bin, 2)
const sum = (arr) => arr.reduce((a,b) => a + b, 0)

const applyMask = (mask, binNum) => mask.map((d,i) => d !=='X' ? d : binNum[i])
// console.log(applyMask(mask.split(''), '101'.padStart(36, '0').split('')))

const solveIt  = async() => {
    // convert lines to array of numbers
    const lines = await readlines()
    let mask = ''.padStart(36,'X')
    let mem, num
    let memMap = new Map()
    for (let line of lines) {
        if (line.slice(0, 4) === "mask") {
            mask = line.split(" = ")[1]
        } else if (line.slice(0, 3) === "mem") {
            mem = line.match(/[0-9]+/)[0] 
            num = toBin(Number((line.split(" = ")[1])))
            memMap.set(mem, applyMask(mask.split(''), num.padStart(36, '0').split('')).join(''))
        }
    }
    let arr = Array.from(memMap.values())
    console.log(arr)
    console.log(arr.map(e => toDec(e)))
    return sum((Array.from(memMap.values()).map(e => toDec(e))))
}

solveIt().then(console.log)