export default function gen () {

    const width  = 5
    const height = 5
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
        } else if (stack.length) {
            current = stack.pop()
        }

    }


    const maze = []
    let mazeWidth = width * 2 // + 2
    let mazeHeight = height * 2 //+ 2

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const gridPos = y * width + x
            const pos = y * 2 * mazeWidth + x * 2
            const east = pos + 1
            const south = pos + mazeWidth
            const southeast = south + 1

            maze[pos] = 1
            maze[east] = 0
            maze[south] = 0
            maze[southeast] = 0

            const walls = grid[gridPos].walls
            if (!walls[2]) maze[south] = 1
            if (!walls[3]) maze[east] = 1
        }
    }

    /* Add row before */
    for (let x = 0; x < mazeWidth; x++) {
        maze.splice(0, 0, 0)
    }

    mazeWidth++
    mazeHeight++

    /* Add column before */
    for (let y = 0; y < mazeHeight; y++) {
        maze.splice(y * mazeWidth, 0, 0)
    }

    let str = []
    for (let i = 0; i < maze.length; i++) {
        if (i % (mazeWidth) === 0) str.push('\n')
        str.push(maze[i] ? 'x' : '-')
    }

    console.log(str.join(' '))


    return {
        maze : maze,
        width : mazeWidth,
        height : mazeHeight,
    }

}
