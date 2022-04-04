/* Problem requires reading a list numbers from a file 
and returning the product of the triplet of numbers that sum to 2020  
*/

const fs = require("fs").promises;

const readlines = async() => {
    // read the lines of the file, as strings
    // const data = await fs.readFile('input3.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('testfile3.txt', {encoding: 'utf-8'});
    return data.split('\n');
};

const solveIt  = async() => {
    // convert lines to array of numbers
    const lines = await readlines()
    const numberArray = await [...lines
            .map((val) => val.trim())
            .map((val) => Number(val))]
    //call solver function
    console.log(sumThree(2020, numberArray)) 
    /* need to print the result in here, because only calculated from async awaited values
      - If try to print the returned result of this function when called, will just see the Promise pending.
    */
};


function sumTwo(total = 2020, numberList = [1,3,5]) {
    // return the product of two numbers in the number list that sum to the total

    //console.log(numberList, typeof numberList[5], typeof 20); 
    //numberList.includes(20) ? console.log("Yes") : console.log("No")
    
    let numberSet = new Set()  // This method by Alvin (Zablan)  the programmer
    for (let num of numberList) {
        const difference = total - num
        if (numberSet.has(difference)) {   // will not compare a number with itself (unless number ocurrs twice)
          return difference * num;  // odd - but the question asks for a product of the two
        }
        numberSet.add(num)    // add the number to the set to check against
    }
    return null;
}

function sumThree(totalThree = 2020, numberList = [1,3,5]) {
    // find product of three numbers making a total
    
    //use sumTwo with each number not already tested - put the tested numbers into a set
    let numberSet = new Set()
    for (let num of numberList) {
        if (!numberSet.has(num)) {
            let result = sumTwo(totalThree - num, numberList) 
            if (result) return num * result 
        }
        numberSet.add(num)    
    }
    return null;
}

solveIt().then(console.log)