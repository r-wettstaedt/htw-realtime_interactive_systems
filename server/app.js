import gen from './mapGenerator'

let io = require('socket.io')(3003)

const world = io.of('/ris/world').on('connection', socket => {
    console.log('world/connection')
    socket.on('request', () => {
        console.log('world/request')
        socket.emit('world', gen())
    })
})
const player = io.of('/ris/player').on('connection', socket => {
    console.log('player/connection')
    socket.on('move', data => {
        // console.log(data)
    })
})

