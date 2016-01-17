import io from 'socket.io-client'
import worldObj from './world/world'

const port = 3003

export const world  = io.connect(`http://localhost:${port}/ris/world`)
export const player = io.connect(`http://localhost:${port}/ris/player`)


world.on('connect', () => {
    console.log('world/connection')
    world.emit('request')
    world.on('world', map => {
        let str = []
        for (let i = 0; i < map.maze.length; i++) {
            if (i % (map.width) === 0) str.push('\n')
            str.push(map.maze[i] ? 'x' : '-')
        }
        console.log(str.join(' '))
        worldObj.map = map.maze
        worldObj.width = map.width
        worldObj.height = map.height
    })
})
