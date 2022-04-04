/* Problem requires counting trees on a rough through a forest
Each line contains a row of trees "x" or spaces "."
The route gous x rows down and y trees across.
The forest is infinite horizontally, by repeating the tree sequence on each row
*/

const fs = require("fs").promises;

const readlines = async() => {
    // read the lines of the file, as strings
    // day2_testdata.txt to test
    // const data = await fs.readFile('testfile3.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('input3.txt', {encoding: 'utf-8'});
    return data.split('\n');
};

const solveIt  = async() => {
    // convert lines to array of numbers
    const forest = await readlines()
    //call solver function
    console.log(forest)
    // return countTrees(forest, [1,3])
    return countTrees(forest, [1,1]) * countTrees(forest, [1,3]) * countTrees(forest, [1,5]) * countTrees(forest, [1,7]) * countTrees(forest, [2,1])
    /* need to print the result in here, because only calculated from async awaited values
      - If try to print the returned result of this function when called, will just see the Promise pending.
    */
};

const countTrees = (forest, track = [1,0]) => {
    let treeCount = 0, treeLine, treeNumber = 0
    for (treeLine = 0; treeLine < forest.length; treeLine = treeLine + track[0]) {
        console.log ("treeLine, track[1], forest[treeLine].length", treeLine, track[1], forest[treeLine].length)
        if (forest[treeLine].charAt(treeNumber) === "#")  treeCount = treeCount + 1
        treeNumber = (treeNumber + track[1]) % forest[treeLine].length
        console.log("treenumber", treeNumber)
    }
    console.log(treeCount)
    return treeCount
}

solveIt().then(console.log)