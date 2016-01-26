let returnObj = {}

export default function generator (width = 15, height = 15) {

    width = width % 2 === 0 ? ++width : width
    height = height % 2 === 0 ? ++height : height

    const size = width * height

    const dir = {
        N : 0,
        W : 1,
        S : 2,
        E : 3,
    }

    const grid = []
    for (let i = 0; i < size; i++) {
        grid[i] = {
            walls : [true, true, true, true],
            visited : false,
        }
    }

    let visited = 1
    const stack = []
    let current = {
        x : Math.floor(width / 2),
        y : Math.floor(height / 2),
        pos : Math.floor(height / 2) * width + Math.floor(width / 2),
    }
    let goal
    let pathLength = 0

    while (visited < size) {
        let neighbors = [{
            x : current.x,
            y : current.y - 1,
            dir : dir.N,
        }, {
            x : current.x - 1,
            y : current.y,
            dir : dir.W,
        }, {
            x : current.x,
            y : current.y + 1,
            dir : dir.S,
        }, {
            x : current.x + 1,
            y : current.y,
            dir : dir.E
        }]

        neighbors = neighbors.filter( n => {
            n.pos = n.y * width + n.x
            if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
                const neighbor = grid[n.pos]
                return !neighbor.visited
            }
        })

        if (neighbors.length) {
            const rand = Math.floor(Math.random() * neighbors.length)
            const neighbor = neighbors[rand]
            stack.push(current)

            grid[current.pos].walls[neighbor.dir] = false
            grid[current.pos].visited = true

            current = neighbor

            grid[current.pos].walls[(neighbor.dir + 2) % 4] = false
            grid[current.pos].visited = true

            visited++
            pathLength++
        } else if (stack.length) {
            if (!goal || pathLength > goal.pathLength) {
                goal = current
                goal.pathLength = pathLength
                pathLength = 0
            }
            current = stack.pop()
        }
    }
    if (!goal) goal = current


    returnObj.maze = []
    returnObj.mazeWidth = width * 2
    returnObj.mazeHeight = height * 2

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const gridPos = y * width + x
            const pos = y * 2 * returnObj.mazeWidth + x * 2
            const east = pos + 1
            const south = pos + returnObj.mazeWidth
            const southeast = south + 1

            returnObj.maze[pos] = 1
            returnObj.maze[east] = 0
            returnObj.maze[south] = 0
            returnObj.maze[southeast] = 0
            if ((goal.y * 2 * returnObj.mazeWidth + goal.x * 2) === pos)
                returnObj.maze[pos] = 2

            const walls = grid[gridPos].walls
            if (!walls[2]) returnObj.maze[south] = 1
            if (!walls[3]) returnObj.maze[east] = 1
        }
    }

    /* Add row before */
    for (let x = 0; x < returnObj.mazeWidth; x++) {
        returnObj.maze.splice(0, 0, 0)
    }

    returnObj.mazeWidth++
    returnObj.mazeHeight++

    /* Add column before */
    for (let y = 0; y < returnObj.mazeHeight; y++) {
        returnObj.maze.splice(y * returnObj.mazeWidth, 0, 0)
    }

    return {
        maze : returnObj.maze,
        width : returnObj.mazeWidth,
        height : returnObj.mazeHeight,
    }
}



export function printMaze (pos) {
    let symbols = {
        0 : '\u001b[0m ',
        1 : '\u001b[0m\u001b[47m ',
        2 : '\u001b[0m\u001b[41m ',
        3 : '\u001b[0m\u001b[47m\u001b[31mo',
    }
    let str = []
    for (let i = 0; i < returnObj.maze.length; i++) {
        if (i % (returnObj.mazeWidth) === 0) str.push('\n')

        if (pos === i)
            str.push(symbols[3])
        else
            str.push(symbols[returnObj.maze[i]])
    }

    console.log(str.join(' '))
    console.log('\u001b[0m')
}
