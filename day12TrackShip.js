const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input12.txt', {encoding: 'utf-8'});
    return data.split(/\r\n|\r|\n/) //split on new lines
};

const testData = [
'F10',
'N3',
'F7',
'R90',
'F11',
]

const turn = (pt, rotationIdx) => {
    const [x, y] = pt
    const transforms = [
    // 0, 1, 2 or 3 quarter turns
        [x, y],
        [y, -x],
        [-x, -y],
        [-y, x]
    ]

    return transforms[rotationIdx]
    }  

const modulo = (a, n = 4) =>((a % n) + n) % n // gives array index 0-n, whether move a is +ve or negative

const move = (location, direction, steps) => {
    let e = location.E 
    let n = location.N
    switch(direction) {
        case 'E': e = e + steps
            break
        case 'N': n = n + steps
            break
        case 'S': n = n - steps 
            break
        case 'W': e = e - steps
            break
        default:
            console.log("No place to move")
        }    
    return location = { N: n, E: e}
}


const travel = (location, dir, input) => {
    const directions = ['E','S','W','N']
    input.forEach(line => {
        if (line.charAt(0) === 'R') { dir = directions[modulo(directions.indexOf(dir) + line.slice(1)/90, 4)] 
        } else if (line.charAt(0) === 'L') { dir = directions[modulo(directions.indexOf(dir) - line.slice(1)/90, 4)] 
        } else if (line.charAt(0) === 'F') {
            location = move(location, dir, steps = Number(line.slice(1)))
        } else {
            location = move(location, line.charAt(0), steps = Number(line.slice(1)))
        }
    })
    return location
}

const moveBy = (waypointLoc, steps) => { 
    return { N: waypointLoc.N * steps, E: waypointLoc.E * steps }
}

const moveShip = (from, by) => {
    return { N: from.N + by.N, E: from.E + by.E}
}

const rotateWaypoint = (waypointLoc, quarterTurns) => {
    // rotate the waypoint about the ship. Quarterturns -ve for L/anti-clockwise
    const [e, n] = turn([waypointLoc.E, waypointLoc.N], modulo(quarterTurns))
    return  {N: n, E: e}
}

const moveWaypoint = (waypointLoc, direction, steps) => {
    // move waypoint the number in the direction
    let e = +waypointLoc.E 
    let n = +waypointLoc.N
    switch(direction) {
        case 'E': e = e + steps
            break
        case 'N': n = n + steps
            break
        case 'S': n = n - steps 
            break
        case 'W': e = e - steps
            break
        default:
            console.log("No direction to move")
    }
    return { N: n, E: e}
}


const travel2 = (shipLoc, waypointLoc, dir, input) => {
    input.forEach(line => {
        switch (line.charAt(0)) {
            case 'R': waypointLoc = rotateWaypoint(waypointLoc, +line.slice(1)/90 ) 
                break
            case 'L': waypointLoc = rotateWaypoint(waypointLoc, -1 * line.slice(1)/90 ) 
                break
            case 'F': shipLoc = moveShip(shipLoc, moveBy(waypointLoc, +line.slice(1)))
                break
            default:
                waypointLoc = moveWaypoint(waypointLoc, line.charAt(0), +line.slice(1))
        }
    })
    return shipLoc
}

const manhattan = (startLocation, endLocation) => Math.abs(startLocation.N - endLocation.N) + Math.abs(startLocation.E - endLocation.E)

const solvit = async () => {
    let input = await readlines()
    // let input = testData
    let dir = 'E'
    let location = {N: 0, E: 0}
    return manhattan(location, travel(location, dir, input))    
}

const solvit2 = async () => {
    let input = await readlines()
    // let input = testData
    const shipLoc = {N: +0, E: +0}
    return manhattan(shipLoc, travel2(shipLoc, waypointLoc = {N: +1, E: +10}, dir = 'E', input))    
}

solvit().then(console.log)

solvit2().then(console.log)