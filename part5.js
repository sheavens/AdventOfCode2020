/* Problem requires calcalculating airline seat number from code such as: 
The first 7 characters will either be F or B; these specify exactly one of the 128 rows on the plane (numbered 0 through 127). Each letter tells you which half of a region the given seat is in. Start with the whole list of rows; the first letter indicates whether the seat is in the front (0 through 63) or the back (64 through 127). The next letter indicates which half of that region the seat is in, and so on until you're left with exactly one row.

For example, consider just the first seven characters of FBFBBFFRLR:

Start by considering the whole range, rows 0 through 127.
F means to take the lower half, keeping rows 0 through 63.
B means to take the upper half, keeping rows 32 through 63.
F means to take the lower half, keeping rows 32 through 47.
B means to take the upper half, keeping rows 40 through 47.
B keeps rows 44 through 47.
F keeps rows 44 through 45.
The final F keeps the lower of the two, row 44.

The last three characters will be either L or R; these specify exactly one of the 8 columns of seats on the plane (numbered 0 through 7). The same process as above proceeds again, this time with only three steps. L means to keep the lower half, while R means to keep the upper half.

For example, consider just the last 3 characters of FBFBBFFRLR:

Start by considering the whole range, columns 0 through 7.
R means to take the upper half, keeping columns 4 through 7.
L means to take the lower half, keeping columns 4 through 5.
The final R keeps the upper of the two, column 5.
So, decoding FBFBBFFRLR reveals that it is the seat at row 44, column 5.

Every seat also has a unique seat ID: multiply the row by 8, then add the column. In this example, the seat has ID 44 * 8 + 5 = 357.
*/

const fs = require("fs").promises;

const readlines = async() => {
    // const data = await fs.readFile('testfile5.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('input5.txt', {encoding: 'utf-8'});
    return data.split('\n');
};

maximum = (arr) => arr.reduce((a, b) => b > a ? b : a, 0) 
const solveIt  = async() => {
    // convert lines to array of numbers
    const seatCodes = await readlines()
    const seatIDs = seatCodes.map(d => calcSeatID(d))
    console.log("seatIDs", seatIDs)
    return maximum(seatIDs)
    //call solver function

};

const solvePart2  = async() => {
    // convert lines to array of numbers
    const seatCodes = await readlines()
    const seatIDs = seatCodes.map(d => calcSeatID(d))
    const seatSet = new Set(seatIDs)
    const missing = new Set()
    for (let i = 1; i < 1022; i++) {
      if (!seatSet.has(i) && seatSet.has(i-1) && seatSet.has(i+1)) missing.add(i)  
    }
    return missing
};


const low = (arr) => [arr[0], Math.floor(arr[0] + (arr[1]-arr[0])/2)]
const high = (arr) => [Math.ceil(arr[0] + (arr[1] - arr[0])/2), arr[1]]

const decode = (code, arr, loLetter) => {
    if (arr[1]-arr[0] === 1) return code[0] ===  loLetter ? arr[0] : arr[1] 
    return decode(code.slice(1), arr = code[0] === loLetter ? low(arr) : high(arr), loLetter)
}
const rowNum = (code) => {
    if (!code.length === 10) return null
    return decode(code, [0, 127], 'F')
}

const colNum = (code) => {
    if (!code.length === 10) return null
    return decode(code, [0, 7], 'L')
}

/* const reduceRow = (code) => {['F','B'].reduce((arr, b) => b === 'F' ? low(arr) : high(arr), [0, 127]) }
console.log('reduce alternative', reduceRow('FBFBBFF')) */

const calcSeatID = (seatCode) => {
    const ID = (8 * rowNum(seatCode.slice(0,-3)) + colNum(seatCode.slice(-3)))
    return ID
}


/* Every seat also has a unique seat ID: multiply the row by 8, then add the column. In this example, the seat has ID 44 * 8 + 5 = 357.

Here are some other boarding passes:

BFFFBBFRRR: row 70, column 7, seat ID 567.
FFFBBBFRRR: row 14, column 7, seat ID 119.
BBFFBBFRLL: row 102, column 4, seat ID 820.
As a sanity check, look through your list of boarding passes. What is the highest seat ID on a boarding pass? */

testArray = ['FBFBBFFRLR','BFFFBBFRRR', 'FFFBBBFRRR', 'BBFFBBFRLL', ' ']
console.log("rows", testArray.map(e => rowNum(e.slice(0,-3))))
console.log("cols", testArray.map(e => colNum(e.slice(-3))))
const output = testArray.map(e => calcSeatID(e))
console.log('IDs', output)

// solveIt().then(console.log)
solvePart2().then(console.log)
