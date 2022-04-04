
const min = (arr) => arr.reduce((a,b) => a < b ? a : b )
const max = (arr) => arr.reduce((a,b) => a > b ? a : b )


const earliestTime = 1000434
const buses = [17,'x','x','x','x','x','x',41,'x','x','x','x','x','x','x','x','x',983,'x',29,'x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x',19,'x','x','x',23,'x','x','x','x','x','x','x',397,'x','x','x','x','x',37,'x','x','x','x','x','x',13]

//part 1
const solveItPart1 = () => {
    
    const nextDepartures = buses.map(e => e === 'x' ? 'Infinity' : Math.ceil(earliestTime/e) * e - earliestTime)
    const nextDeparture = min(nextDepartures)
    const firstBus = buses[nextDepartures.indexOf(nextDeparture)]
    return firstBus*nextDeparture
}
// console.log(solveItPart1())

// part 2
// Find first time at which time to next buses match the indices of bus numbers in array.

  const solveItPart2 = (buses) => {
    const numbers = buses.filter(e => e !== 'x')   // keep only the numbers, drop the 'x'
    const nextIn = numbers.map(e => buses.indexOf(e))   // ..and the corresponding minutes to next bus

    const soln = (time, nextIn, numbers)  => nextIn.every((e,i) => (time + e) % numbers[i] === 0)
    // use the longest bus time interval to find the solution; fewer steps to check
    const slowest = max(numbers)
    const slowAfter = buses.indexOf(slowest)
    
    let index = 1   
    let time = slowest * index - slowAfter
    while (soln(time, nextIn, numbers) === false) {
        index = index + 1
        time = slowest * index - slowAfter
        if (index % 1000000000 === 0) console.log(index)
    }
    return time
}

const solveItPart2Fast = (buses) => {
    const numbers = buses.filter(e => e !== 'x')   // keep only the numbers, drop the 'x'
    const nextIn = numbers.map(e => buses.indexOf(e))   // ..and the corresponding minutes to next bus
    const next = (time) => numbers.map((e,i) => time % e)  // formula for time to next bus
    const soln = (time, nextIn, numbers)  => nextIn.every((e,i) => (time + e) % numbers[i] === 0)
    
    // use the two longest bus time intervals to find the solution; fewer steps to check
    const slowest = max(numbers)
    const slowAfter = buses.indexOf(slowest)
    
    let index = 1   
 
// First find first soln for just two buses (use longest intervals)
//  soln at time = (n * lower interval - lower offset) .. Find n
// soln repeats at interval of higher bus interval (n + higher interval * index) * lower interval - lower offset
// soln for whole problem is this at some index value

// I have calcuated this for the two longest interval buses in my input (could re-write to generalise)
// (249665 + 48)/397 = 629   
    let n = 629
    let lowerInterval = 397
    let higherInterval = 983
    let lowerOffset = 48

/*     // testBuses data
    let n = (187 + 0) / 17
    let lowerInterval = 17
    let higherInterval = 19 
    let lowerOffset = 0
*/

    // time of first soln for just the two largest entries in part 2 input
    let time = (n + higherInterval*index)*lowerInterval - lowerOffset

    while (soln(time, nextIn, numbers) === false) {
        index = index + 1
        time = (n + higherInterval*index)*lowerInterval - lowerOffset
        if (index % 100000000 === 0) console.log(time)
    }
    return time
}

 // test data
/*  const testBuses = [17,'x',13,19]
console.log(solveItPart2(testBuses), 3417)
console.log(solveItPart2([17,'x','x',19]), 187) // test for fast soln method
 */
/*
console.log(solveItPart2([67,7,59,61]), 754018)
console.log(solveItPart2([67,'x',7,59,61]), 779210)
console.log(solveItPart2([67,7,'x',59,61] ),1261476 )
console.log(solveItPart2([1789,37,47,1889]), 1202161486) */

//console.log(solveItPart2([17,'x','x','x','x','x','x',41,'x','x','x','x','x','x','x','x','x',983,'x',29,'x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x',19,'x','x','x',23,'x','x','x','x','x','x','x',397,'x','x','x','x','x',37,'x','x','x','x','x','x',13]))
 
// the part 2 input takes too long to solve.  New method needed.
// Observe all the input numbers are prime numbers
// The min intervals between multiples of two base numbers cycles round.  Repeat
// is at a * b  (only true for primes).  E.g. Any two start at interval zero and are again 
// at interval 0 at a * b.  So solve 2 and use a * b as the step size.  Use two largest
// for largest step size.

const slowestTwo = ['x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x',983,'x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x',397,'x','x','x','x','x','x','x','x','x','x','x','x','x']
console.log(solveItPart2(slowestTwo)) // 249665 (= (397+48)/629
console.log(solveItPart2Fast(buses))
