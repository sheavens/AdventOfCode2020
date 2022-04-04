
const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input16.txt', {encoding: 'utf-8'});
    const blankLine = /\r\n\r\n|\r\r|\n\n/
    return data.split(blankLine) 
};

// make an object from input as lines of key value strings
const makeObject = (lines, splitAt = ': ') => Object.fromEntries(lines.map(line => line.split(splitAt)))

const inRange = (v, rangeArr) =>  v <= rangeArr[1] && v >= rangeArr[0]

const isValid = (v, validStrs = validRangeStrs) => {
    // test for a value being within one of the valid ranges
      for (rangeStr of validStrs) {
          if (inRange(v, rangeStr.split('-'))) return true
      }
      return false
}

const range = (start, stop, step) => {
    const arrayLength = Math.floor(((stop - start) / step)) + 1;
    return [...Array(arrayLength).keys()].map(x => (x * step) + start);
}

const ticketValues = [
7,3,47,
40,4,50,
55,2,20,
38,6,12,
]
const validRangeStrs = ['1-3','5-7', '6-11', '33-44', '13-40', '45-50']


const numErrors = (codes=ticketValues, validStrs=validRangeStrs) => {
    let num = 0
    for (v of codes) if (!isValid(v, validStrs)) num += 1
    return num
}

const validStr = (ticketFields) => {
 return Object.values(ticketFields).map(e => e.split(' or '))//.flat()
}

const allPossible = (tickets, ranges) => {
    const toSolve = range(0, 19, 1)
    const solns = range(0, 19, 1)
    let solnArr
    let allSolnsArr = []
    for (let toSolveIndx of toSolve) {
        solnArr = []
        for (let soln of solns) {
            if (isPossible(toSolveIndx, soln, tickets, ranges)) solnArr.push(soln)
        }
        allSolnsArr.push(solnArr)
    }
    return allSolnsArr
}

const isPossible = (toSolveIndx, soln, tickets, ranges) => {
    // possble solution where all values for this fieldNo lie within ranges for this solnNo
     const fieldValues = tickets.map(d => d[toSolveIndx])
     for (let v of fieldValues)  {
        if (!isValid(v, ranges[soln])) return false
     }
     return true
}


// Set.delete(item) returns true if successful
// whereas this function returns the new Set (inefficient though as filter cont. though all Set items)
const remove = (setA, item) => new Set([...setA].filter(x => x !== item))   


// this (brute force with back-tracking) was inefficient until the valid solutions were all pre-calculated.
//This is because, with backtracking, the same solutions were re-calculated when re-tried as
// calculations remade when lower stack levels returned to.  Memo-isation would achieve
// the same efficiency gain, by internalising the calculation of valid soluitions.
const bfbt = (availableSolnSet, validSolns, toSolveIndx = 0) => { 
    // brute force with backtracking - pattern could be reused.
    // availableSlnset is the set of solns remaining unmatched with fields to solve.
    // One field (at the toSolveInx) is solved at each stack level, by finding a valid solution
    // from those remaining, proceeding "optimistically" to the next,
    // and backtracking where none of the remaining solutions are valid solutions.
    // (Other parameters are problem specific, as required for valid solution checking function
    // Also requires remove function to return new set with am item removed (non-standard in js)
    
    if (availableSolnSet.size === 0) return []
    //console.log("yet to use solutions", solnSet.size)

    let retVal
    for (let soln of Array.from(availableSolnSet)) {
        if (validSolns[toSolveIndx].includes(soln)) {
        //if (isPossible(toSolveIndx, soln, tickets, ranges)) {
            retVal = bfbt(remove(availableSolnSet, soln), validSolns, toSolveIndx + 1)
            if (retVal !== null) return [soln, ...retVal]
        }
    }
    return null  // backtrack - no more possible solns available
}

// utility - join array values to a string with join symbols
const asStr = (arr, join = "-") => arr.reduce((a,b) => a.toString() + join + b.toString())

const bfbt2 = (availableSolnSet, goodTickets, rangeStrPairs, validSolns = new Set(), invalidSolns = new Set(), toSolveIndx = 0) => { 
    // brute force with backtracking - pattern could be reused.
    // availableSlnset is the set of solns remaining unmatched with fields to solve.
    // One field (at the toSolveInx) is solved at each stack level, by finding a valid solution
    // from those remaining, proceeding "optimistically" to the next,
    // and backtracking where none of the remaining solutions are valid solutions.
    // (Other parameters are problem specific, as required for valid solution checking function
    // Also requires remove function to return new set with am item removed (non-standard in js)
    if (availableSolnSet.size === 0) return []
    //console.log("yet to use solutions", solnSet.size)
    let retVal
    for (let soln of Array.from(availableSolnSet)) {
        // if not already memoised, check for valid solution
        const solnStr = asStr([toSolveIndx, soln])
        if (!validSolns.has(solnStr) && !invalidSolns.has(solnStr)) {
            // memoise new soln
            if (isPossible(toSolveIndx, soln, goodTickets, rangeStrPairs)) {
                validSolns.add(solnStr) 
            } else {
                invalidSolns.add(solnStr)
            }
        }
        if (validSolns.has(solnStr))  {
        // assume this possible soln is the right soln and recurse (proceed "optimistically")
            retVal = bfbt2(remove(availableSolnSet, soln), goodTickets, rangeStrPairs, validSolns, invalidSolns, toSolveIndx + 1)
            if (retVal !== null) return [soln, ...retVal]
        }
    }
    return null  // backtrack - no more possible solns available
}

const multFields = (startingStr, ticketFields, myTicket, soln = [8, 1, 3, 17, 10, 0, 9, 11, 2, 19, 14, 5, 13, 18, 15, 4, 7, 6, 12, 16]) => {
// find indices of the 6 ticket fields that start with 'departure' and multiply the values of these field from my ticket.  
// Soln gives the position of each of the ticket fields.
    const fieldNames = Object.keys(ticketFields)
    const fieldNumbers = fieldNames.map((d, i) => d.startsWith(startingStr) ? i : '').filter(e => e !== '')
    // soln[0] === 8 means that ticket values at 0 are for ticket field 8 (arrival platform)
    // 'departure' fields are ticket fields 0-5.  Find the indices with ticket fields 1-6
    // ticket field 0 is at index 5..
    const fieldIndx = fieldNumbers.map(e => soln.indexOf(e))
    let mult = 1
    for (let indx of fieldIndx) {
        console.log(myTicket[indx])
        mult = mult * myTicket[indx]
    }
    return mult
}

const solveIt  = async() => {
    // convert lines to array of numbers
    const input = await readlines()
    const newline = /\r\n|\r|\n/
    const ticketFields = makeObject(input[0].split(newline), ': ')
    const rangeStrPairs = validStr(ticketFields)
    const validRangeStrings = rangeStrPairs.flat()
    const myTicket = input[1].split(newline)[1].split(',').map(e => +e)
    const nearbyTickets = input[2].split(newline).slice(1).map(a => a.split(',').map(e => +e))
    // const goodTickets = [ myTicket, ...nearbyTickets.filter(t => numErrors(t, validRangeStrings) === 0)]
    //try without myTicket - same 
    const goodTickets = [ ...nearbyTickets.filter(t => numErrors(t, validRangeStrings) === 0)]
    const range = Array((rangeStrPairs.length)).keys()
    const availableSolnSet = new Set([...range])
    
    const soln = bfbt(availableSolnSet, allPossible(goodTickets, rangeStrPairs))
    // const soln = bfbt2(availableSolnSet, goodTickets, rangeStrPairs)

    return multFields('departure', ticketFields, myTicket, soln)
    

}

solveIt().then(console.table)
