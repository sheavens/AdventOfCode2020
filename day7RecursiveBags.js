const fs = require("fs").promises;

const readlines = async() => {
    // const data = await fs.readFile('testfile7.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('input7.txt', {encoding: 'utf-8'});
    return data.split(/\n/); //split on new lines
};

const solveIt  = async() => {
    const bagData = await readlines()
    const bags = makeObject(bagData)
    const containerBags = containerSet(bags, "shiny gold")
    return containerBags
}

const solveItPart2  = async() => {
    const bagData = await readlines()
    const bags = makeObject(bagData)
    const bagCount = inBagsRecurse(bags, "shiny gold")
    return bagCount
}

const sumOfSetSizes = (sets) => sets.reduce((a, b) => a + b.size, 0)

const makeObject = (bagData) => {
    let entries = []
    for (bagLine of bagData) {
        entries.push(makeEntry(bagLine))
    }
    return Object.fromEntries(entries)
}

const makeEntry = (bagLine) => {
    let bag, contents
    [bag, contents] = bagLine.split('contain')
    const cleanBag = bag.trim().slice(0,-4).trim()
    const cleanContents = contents.replace(/bags/g,"bag").replace(/bag\./g,"bag").slice(0,-3).split("bag,").map(e => e.trim())
    const contentsKeys = cleanContents.map(e => e.split(' ').splice(1).join(' '))
    const contentsValues = cleanContents.map(e => e.split(' ')[0])
    let objectEntries = []
    for (let i = 0; i < contentsKeys.length; i++) objectEntries.push([contentsKeys[i], contentsValues[i]]) 
    const contentsObject = Object.fromEntries(objectEntries)
    return[cleanBag, contentsObject]
/*       Repl results successful: 

     [ '1 posh black', '1 faded green', '4 wavy red' ]
      > array.map(e => e.split(' ')[0])
      [ '1', '1', '4' ] */

/*       > array.map(e => e.split(' ').splice(1).join(' '))
      [ 'posh black', 'faded green', 'wavy red' ]
      > */

}

const containerSet = (bagObject, bagToFind, resultSet = new Set()) => {
    const inBagSet = inBags(bagObject, bagToFind)
    if (inBagSet.size === 0) return resultSet
    for (let bag of inBagSet) {
        containerSet(bagObject, bag, resultSet.add(bag))
    }
    return resultSet
 }

// console.log(containerSet(bags, "jet black")) // {"green", "blue", " crimson yellow", "jet black"}]

const inBags = (bagObject, bagToFind) => {
    let inBags = new Set()
    for (const bag in bagObject)  {
        if (bagToFind in bagObject[bag])
        inBags.add(bag)
    }
    return inBags
}

const inBagsRecurse = (bagObj, outerBag, num = 1, total = 0) => {

    console.log('bagObj[outerBag]', bagObj[outerBag])
    if ("other" in bagObj[outerBag]) {
        console.log("RETURN TRIGGERED")
        return total
    }    
    const prevNum = num
    for (let innerBag in bagObj[outerBag]) {
        console.log("innerbag, bagObj[outerBag][innerBag]", innerBag, bagObj[outerBag][innerBag])
            num = prevNum * bagObj[outerBag][innerBag]     
            total = inBagsRecurse( bagObj, innerBag, num, total += num)
            console.log("num, total", num, total)
    }
    return total
}


const countBagsInside = (bagObject, bagToSearch, numberBags = 1, totalBags = 0) => {
    // if (!(bagToSearch in bagObject) || bagObject[bagToSearch][other] ===  'no') return
    numberBags = numberBags * numberBags
    for (let bag in bagObject[bagToSearch]) {
        console.log(bag)
    
    //    countBagsInside(bagObject, bag, bag, totalBags += bag.value)
    }
    return bagObject[bagToSearch][bag]
}

const bagsInside = (bagObject, thisBag) => {
    let bagsIn = new Set()
    for (const bag in bagObject)  {
        if (thisBag in bagObject)
        inBags.add(bag)
    }
    return inBags
    if ((thisBag in bagObject) && bagObject[thisBag] !=  null) return true
}

solveIt().then(console.log)


