
/* Problem requires reading a list numbers from a file 
and returning the value accumulated from a sequence of commands in an array until an array node is repeated 
*/

const fs = require("fs").promises;

const readlines = async() => {
    // read the lines of the file, as strings
    const data = await fs.readFile('input8.txt', {encoding: 'utf-8'});
    // const data = await fs.readFile('testfile8.txt', {encoding: 'utf-8'});
    return data.split('\n');
};

const solveIt  = async() => {
    // convert lines to array of numbers
    const lines = await readlines()
    // make an array of objects
    return tryCorrection(makeObject(lines))
   //  return accInLoop(objectArray)
};

const tryCorrection = (ObjectArray) => {
    // trial and error.. keep trying a correction until runs sucessfully
    let result = {}
    let success = false
    let indexToCorrect = -1  //will not correct anything the fist time.. in case it works O.K
    result =  accInLoop(ObjectArray, -1)
    success = result.success
    indexToCorrect = 0
    // if it did not work O.K, try to correct, trying to change one jmp/nop command each run
    while (!success && indexToCorrect < ObjectArray.length + 1 ) {
        result =  accInLoop(ObjectArray, indexToCorrect)
        success = result.success
        indexToCorrect = getNextJmpOrNop(ObjectArray, indexToCorrect)
    }
    return result
}

const getNextJmpOrNop = (objectArray, index) => {
// find next command jmp or nop.  Excludes current index..
    let found = false
    index = nextIndex(objectArray, index).index
    while (!found && index < objectArray.length + 1) {
        if ('jmp' in objectArray[index] || 'nop' in objectArray[index]) return index
        index = nextIndex(objectArray, index).index
    }
    return Infinity // no more to find
}

const nextIndex = (objectArray, index) => {
    const command = objectArray[index];
    if ('nop' in command) {
        index = index + 1;
    } else if ('jmp' in command) {
        index = index + Number(command.jmp);
    } else if ('acc' in command) {
//        acc = acc + Number(command.acc);
        index = index + 1;
    } else {
        return { error: "command not recognised", index: index }; 
    }
    return { error: "None", index: index }; 
}

function accInLoop(objectArray, correctCommandAtIndex = -1) {
    /*  returns the value os accumulator before sequence of game steps repeats*/
    let index = 0;
    let acc = 0;
    let commandSet = new Set();
    let command = {};
    // let prevCommands = []
    let success = false;
    while (!commandSet.has(index) && index >= 0 && index < objectArray.length) {
        commandSet.add(index);
        command = objectArray[index];
        // correct command where fault detected
        if (index === correctCommandAtIndex)
            command = correctedCommand(command, index);

        if ('nop' in command) {
            index = index + 1;
        } else if ('jmp' in command) {
            index = index + Number(command.jmp);
        } else if ('acc' in command) {
            acc = acc + Number(command.acc);
            index = index + 1;
        } else {
            return { error: "command not recognised", index: index };
        }
    }
    // console.log ("index, objectArray.length, acc", index, objectArray.length, acc)
    if (index === objectArray.length) success = true   
    return { accumulator: acc, success: success, indexCorrected: correctCommandAtIndex }
}
// console.log ("acc: ", accInLoop([{acc: 5},{jmp: +2},{acc: +3},{jmp: -1},{nop: 0},{jmp: +5},{acc: 5},{jmp: -2},]))
   //  acc: 8

const makeObject = (lines) => {
    const objArr = lines.map(line => [line.split(' ')]).map(Object.fromEntries)
    return objArr
}

const correctedCommand = (command, index) => { // a single fault corrected by swapping a jmp for a nop (or vv)
    // console.log("CORRECTING COMMAND", command, index)
    if ('jmp' in command) {
        command = {'nop': Number(command.jmp)}
    } else if ('nop' in command) {
        command = {'jmp': Number(command.nop)}
    }
    return command
}

const intersection = (setA, setB) => [...setA].filter(x => setB.has(x)) //returns an array 

solveIt().then(console.log)