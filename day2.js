/* Problem requires reading from a file a list of lines. 
Each line contains of a range, character and password .. example 3 lines:
1-3 a: abcdef
2-9 c: cccccc
1-3 b: cdefg
Valid passwords contain the character a number of times within the range.
Solution is the number of valid passwords in the file
*/

const fs = require("fs").promises;

const readlines = async() => {
    // read the lines of the file, as strings
    // day2_testdata.txt to test
    // const data = await fs.readFile('day2_testdata.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('input2.txt', {encoding: 'utf-8'});
    return data.split('\n');
};

const solveIt  = async() => {
    // convert lines to array of numbers
    const lines = await readlines()
    console.log("number of lines, last line", lines.length, lines[lines.length])
    let validCount = 0
    for (let line of lines) {
        if (validPassword_part2(line)) validCount = validCount + 1
        console.log('validCount',validCount)
    }
    return validCount
};

const validPassword = (line) => {
    let range, letterColon, password, rangeArr
    [range, letterColon, password] = line.split(' ')
    rangeArr = range.split('-').map((d) => Number(d))
    const letter = letterColon.charAt(0)
    const count = letterCount(letter, password)
    // console.log('count',count, count >= rangeArr[0], count <= rangeArr[1])
    if (count >= rangeArr[0] && count <= rangeArr[1]) return true
    return false
}

const validPassword_part2 = (line) => {
    let range, letterColon, password, rangeArr
    [range, letterColon, password] = line.split(' ')
    rangeArr = range.split('-').map((d) => Number(d))
    const letter = letterColon.charAt(0)
    const lettercheck = password.charAt(rangeArr[0]-1).concat(password.charAt(rangeArr[1]-1))
    console.log(password, rangeArr, lettercheck, letter)
    const count = letterCount(letter, lettercheck)
    // console.log('count',count, count >= rangeArr[0], count <= rangeArr[1])
    if (count === 1) return true
    return false
}

const letterCount = (letter, theString, count = 0) => {
// recursive letter counting function
    const foundAt = theString.indexOf(letter)
    if (foundAt === -1) return count
    count = count + 1
    return letterCount(letter, theString.slice(foundAt + 1), count) 
}

solveIt().then(console.log)