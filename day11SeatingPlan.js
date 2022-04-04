const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input11.txt', {encoding: 'utf-8'});
    return data.split(/\r\n|\r|\n/) //split on new lines
};

const testData = [
"L.LL.LL.LL",
"LLLLLLL.LL",
"L.L.L..L..",
"LLLL.LL.LL",
"L.LL.LL.LL",
"L.LLLLL.LL",
"..L.L.....",
"LLLLLLLLLL",
"L.LLLLLL.L",
"L.LLLLL.LL",
]
// note that grid.values[y][x] correspond to row y, column x, so this is the right order for pt{x:x, y:y, grid.values[y][x]}
// to correspond to the grid values as seen in an x y box
const first = (fn, pt, grid) => {
    let neighbour = fn(pt, grid)
    while (neighbour && neighbour.value === '.') {
        neighbour = fn(neighbour, grid)}
    return neighbour
}

const countFirst = (pt, grid, v = "L") => 
// count the first seat seen in each direction, if the seat is occupied
[first(north, pt, grid), first(south, pt, grid), first(east, pt, grid), first(west, pt, grid), 
    first(northEast, pt, grid), first(northWest, pt, grid), first(southEast, pt, grid), first(southWest, pt, grid)]
    .filter(pt => pt !== null)
    .filter(e => e.value && e.value === '#')
    .length

const countNeighbours = (pt, grid, v = "L") => 
    [north(pt, grid), south(pt, grid), east(pt, grid), west(pt, grid), northEast(pt, grid), northWest(pt, grid), southEast(pt, grid), southWest(pt, grid)]
    .filter(pt => pt !== null)
    .filter(e => e.value && e.value === '#')
    .length

const north = (pt, grid) => pt.y === 0 ? null : {x: pt.x, y: pt.y - 1, value: grid.values[pt.y - 1][pt.x]}
const south = (pt, grid) => pt.y === grid.height-1 ? null : {x: pt.x, y: pt.y + 1, value: grid.values[pt.y + 1][pt.x]}
const east = (pt, grid) => pt.x ===  grid.width-1 ? null : {x: pt.x + 1, y: pt.y, value: grid.values[pt.y][pt.x + 1]}
const west = (pt, grid) => pt.x === 0 ? null : {x: pt.x - 1, y: pt.y, value: grid.values[pt.y][pt.x - 1]}
const northEast = (pt, grid) => pt.y === 0 || pt.x ===  grid.width-1 ? null : {x: pt.x + 1, y: pt.y - 1, value: grid.values[pt.y - 1][pt.x + 1]}
const southEast = (pt, grid) => pt.y === grid.height-1 || pt.x ===  grid.width-1 ? null : {x: pt.x + 1, y: pt.y + 1, value: grid.values[pt.y + 1][pt.x + 1]}
const northWest = (pt, grid) => pt.y === 0 || pt.x ===  0 ? null : {x: pt.x - 1, y: pt.y - 1, value: grid.values[pt.y - 1][pt.x - 1]}
const southWest = (pt, grid) => pt.y === grid.height-1 || pt.x ===  0 ? null : {x: pt.x - 1, y: pt.y + 1, value: grid.values[pt.y + 1][pt.x - 1]}

// make a new array of arrays - each row a new, independent array
const newArrArr = (r, c) => new Array(r).fill(0).map(e => new Array(c).fill(0))
    
const solvit = async () => {
    let data = await readlines()
    // let data = testData
    data = data.map(x => x.trim().split(''))
    let grid = {width: data[0].length, height: data.length, values: data }
    let pt = {}
    let updatedGrid = {}
    let moved = true
    while (moved === true) {
        moved = false
        updatedGrid = { width: grid.width, height: grid.height, values: newArrArr(grid.height, grid.width)}
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                pt = {x: x, y: y, value: grid.values[y][x]}
                neighbours = countNeighbours(pt, grid)
                if (neighbours === 0 && pt.value === "L") { 
                    updatedGrid.values[y][x] = "#"
                    moved = true
                } else if (neighbours >= 4 && pt.value === "#") {
                    updatedGrid.values[y][x] = "L"
                    moved = true
                } else {
                    updatedGrid.values[y][x] = grid.values[y][x]
                }
            }
        }
        grid = { width: updatedGrid.width, height: updatedGrid.height, values: updatedGrid.values }
        //grid = updatedGrid // I think this won't work, grid will change with updated grid
}
return grid.values.flat().filter(e => e === '#').length
}

const solvitPart2 = async () => {
    let data = await readlines()
    // let data = testData
    data = data.map(x => x.trim().split(''))
    let grid = {width: data[0].length, height: data.length, values: data }
    let pt = {}
    let updatedGrid = {}
    let moved = true
    let neighbours
    while (moved === true) {
        moved = false
        updatedGrid = { width: grid.width, height: grid.height, values: newArrArr(grid.height, grid.width)}
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                pt = {x: x, y: y, value: grid.values[y][x]}
                neighbours = countFirst(pt, grid)
                if (neighbours === 0 && pt.value === "L") { 
                    updatedGrid.values[y][x] = "#"
                    moved = true
                } else if (neighbours >= 5 && pt.value === "#") {
                    updatedGrid.values[y][x] = "L"
                    moved = true
                } else {
                    updatedGrid.values[y][x] = grid.values[y][x]
                }
            }
        }
        grid = { width: updatedGrid.width, height: updatedGrid.height, values: updatedGrid.values }
        //grid = updatedGrid // I think this won't work, grid will change with updated grid
}
return grid.values.flat().filter(e => e === '#').length
}

    
solvitPart2().then(console.log)