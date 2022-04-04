
const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input16.txt', {encoding: 'utf-8'});
    const blankLine = /\r\n\r\n|\r\r|\n\n/
    return data.split(blankLine) 
};



// make an object from input as lines of key value strings
const makeObject = (lines, splitAt = ': ') => {

    console.log(lines[0].split(splitAt))
 return Object.fromEntries(lines.map(line => line.split(splitAt)))
}



const inRange = (v, rangeArr) =>  v <= rangeArr[1] && v >= rangeArr[0]

const isValid = (v, validStrs = validRangeStrs) => {
      for (rangeStr of validStrs) {
          if (inRange(v, rangeStr.split('-'))) return true
      }
      return false
}

const ticketValues = [
7,3,47,
40,4,50,
55,2,20,
38,6,12,
]
const validRangeStrs = ['1-3','5-7', '6-11', '33-44', '13-40', '45-50']

const countErrors = (codes=ticketValues, validStrs=validRangeStrs) => {
    let errRate = 0
    for (v of codes) if (!isValid(v, validStrs)) errRate += v
    return errRate
}
//console.log(countErrors())

const validStr = (ticketFields) => {
 return Object.values(ticketFields).map(e => e.split(' or ')).flat()
}
const solveIt  = async() => {
    // convert lines to array of numbers
    const input = await readlines()
    const newline = /\r\n|\r|\n/
    const ticketFields = makeObject(input[0].split(newline), ': ')
    const validRangeStrings = validStr(ticketFields)
    const myTicket = input[1].split(newline)[1].split(',').map(e => +e)
    const nearbyTickets = input[2].split(newline).slice(1).map(a => a.split(',').map(e => +e))
    let errCount = 0
    for (let ticket of nearbyTickets) {
        errCount = errCount + countErrors(ticket, validRangeStrings)
    }
    return errCount
}

solveIt().then(console.log)