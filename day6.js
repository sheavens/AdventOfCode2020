/* Problem requires count of questions (a-z) answered Y by one or more members of each group
abc

a
b
c

ab
ac

a
a
a
a

b
This list represents answers from five groups:

The first group contains one person who answered "yes" to 3 questions: a, b, and c.
The second group contains three people; combined, they answered "yes" to 3 questions: a, b, and c.
The third group contains two people; combined, they answered "yes" to 3 questions: a, b, and c.
The fourth group contains four people; combined, they answered "yes" to only 1 question, a.
The last group contains one person who answered "yes" to only 1 question, b.
In this example, the sum of these counts is 3 + 3 + 3 + 1 + 1 = 11. */

const fs = require("fs").promises;

const readlines = async() => {
    // const data = await fs.readFile('testfile6.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('input6.txt', {encoding: 'utf-8'});
    return data.split(/\n\n/); //split on blank lines
};

const solveIt  = async() => {
    const answersByGroup = await readlines()
    const clean = answersByGroup.map( d => d.replace(/\s+/g,' ').split(' '))
    console.log(sumOfSetSizes(AllLettersByGroup(clean))) // part 1 answer
    return sumOfSetSizes(LettersInEveryGroup(clean))//part2 answer
}

const AllLettersByGroup = (arrayByGroup) => {
    const joined = arrayByGroup.map(d => d.join(''))
    const sets = joined.map(d => new Set(d.split('')))
    return sets
}

const LettersInEveryGroup = (arrayByGroup) => {
//an array of sets where each set is the intersection of a group of sets
    let inEverySet = [] 
    const setGroups = arrayByGroup.map(d => d.map(e => new Set(e.split('')))) // get an array of sets 
    setGroups.forEach(group => inEverySet.push(intersection(group)))
return inEverySet
}
// test code
/* const arr = ['def', 'grte', 'satr']
const sets2 = arr.map(d => new Set(d.split('')))
console.log("sets2", sets2) */

const sumOfSetSizes = (sets) => sets.reduce((a, b) => a + b.size, 0)

const intersection = (setGroup) => {
 /*  starting with a set from the first set in the group,
    remove elements not found in all of the other sets */
    const commonSet = new Set()
    for (let elem of setGroup[0]) commonSet.add(elem)
    /*     I found that just eqauting commonSet = setGroup[0] 
        .. changes to commonSet also changed in setGroup[0] 
        so had to build commonSet by adding each element at a time
    */
    for (let e of setGroup[0]) {   
        for (let j = 1;  j  < setGroup.length; j++) {
            if (!setGroup[j].has(e)) {
                commonSet.delete(e)
                continue
            }   
        }
    }
    console.log(setGroup)
    console.log(commonSet)
    return commonSet
}

solveIt().then(console.log)