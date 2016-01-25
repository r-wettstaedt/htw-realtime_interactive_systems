import world from '../world/world'

module.exports = function(io, port) {
    const _world = io.of('/ris/world')

    _world.on('connection', socket => {

        console.log('world/connection')
        socket.on('request', () => {
            console.log('world/request')
            socket.emit('world', world.asShippable())
        })

    })

    // world.on('gameover', state => {
    //     let players = []
    //     for (let id of Object.keys(state.players)) {
    //         let player = state.players[id]
    //         players.push({
    //             posX : player.posX,
    //             posY : player.posY,
    //             texture : player.texture,
    //         })
    //     }
    //     state.players = players
    //     _world.emit('gameover', state)
    // })

    return _world
}
