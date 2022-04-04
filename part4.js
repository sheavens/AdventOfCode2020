/* Problem requires counting valid passports from a batch file.
Information againsta defined set of items is required for validity, 
and an additional item is optional. TheThe infut file has passport information sperated but spaced and spred across multiple lines,
separated by a blank line
*/


const fs = require("fs").promises;

const readlines = async() => {
    // read the lines of the file, as strings
    // const data = await fs.readFile('testfile4.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('input4.txt', {encoding: 'utf-8'});
    return data
            .split('\n\n')  //split the data ao ablank line
            //.replace("\n", " ")
           // .map(m => m.split(' '))
}

const solveIt  = async() => {

    const passportData = await readlines()
    //call solver function
    typeof passportData
    let required = ["byr", "iyr", "eyr", "hgt","hcl","ecl", "pid"]
    validCount = 0
    for (let pp = 0; pp < passportData.length; pp++) {
        if (validPassport(makeObject(passportData[pp]), required)) validCount++
    }
    return validCount
};

const validPassport = (passport, required) => {
    const validityCheck = [checkByr, checkIyr, checkEyr, 
                            checkHgt, checkHcl, checkEcl, checkPid]
    if (requiredAllThere(required, passport) && validityCheck.every(check => check(passport))) return true
    return false
}
    

const makeObject = (passportData) => {
    return Object.fromEntries(passportData
        .replace(/\s+/g,' ')
        .split(' ')
        .map(d => d.split(':'))
    )    
}

const requiredAllThere = (required, passport) => {
    // check all the required items are in the pssport
    const itemsIncluded = Object.keys(passport)
    for (item = 0; item < required.length; item++) {   
        if (!itemsIncluded.includes(required[item])) {
            console.log("missing item", required[item])
            return false
        }
    }
    return true
}

const checkByr = (passport) => {
    if (!isInRange(1920, 2002, Number(passport.byr))) {
        console.log("byr not in range", passport.byr)
        return false
    }
    return true
}

const checkIyr = (passport) => {
    if (!isInRange(2010, 2020, Number(passport.iyr))) {
        console.log("iyr not in range", passport.iyr)
        return false
    }
    return true
}

const checkEyr = (passport) => {
    if (!isInRange(2020, 2030, Number(passport.eyr))) {
        console.log("eyr not in range", passport.eyr)
        return false
    }
    return true
}

const checkHgt = (passport) => {
    const unit = passport.hgt.slice(-2)
    if (unit !='cm' && unit != 'in') { 
        console.log("no units", passport.hgt)
        return false
    }
    const val = Number(passport.hgt.slice(0, -2))
    if (unit === 'cm' && !isInRange(150, 193, val) ||
        unit === 'in' && !isInRange(59, 76, val)) {
        console.log("hgt not in range", passport.hgt, val)
        return false
    }
    return true
}
const checkHgt2 = (passport) => {
    if(!patternMatches(/^[0-9]+(cm$|in$)/, passport.hgt)) {
        console.log("hgt invalid pattern match", passport.hgt )
        return false
    }
    if(passport.hgt.includes("cm") && !isInRange(150, 193, Number(passport.hgt.replace("cm",'')))) {
        console.log("hgt in cm outside range", passport.hgt )
        return false
    }
    if(passport.hgt.includes("in") && !isInRange(59, 76, Number(passport.hgt.replace("in",'')))) {
        console.log("hgt in in outside range", passport.hgt, Number(passport.hgt.replace("in",''))  )
        return false
    }
    return true
}

const checkHcl = (passport) =>  {
    if (!patternMatches(/^#([0-9|a-f]{6})$/, passport.hcl)) {
        console.log("hcl length or pattern invalid", passport.hcl )
        return false
    }
    return true
}

const checkEcl = (passport) => {
    if (!isOneOf(['amb','blu', 'brn', 'gry', 'grn', 'hzl', 'oth'], passport.ecl)) {
        console.log("eye colour not valid ", passport.ecl )
        return false       
    }
    return true
}

const checkPid = (passport) => {
    if (!patternMatches(/^([0-9]{9})$/g, passport.pid)) {
        console.log("pid length or pattern invalid", passport.pid)
        return false
    }   
    return true
}

const isAtLeast = (min, value) => value >= min
const isAtMost = (max, value) => value <= max
const isInRange = (min, max, value) => isAtLeast(min, value) && isAtMost(max, value)
const isOneOf = (choices, value) => choices.includes(value)
const patternMatches = (regex, value) => value.match(regex) != null

solveIt().then(console.log)