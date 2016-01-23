import world from '../world/world'

module.exports = function(io, port) {
    const _world = io.connect(`http://localhost:${port}/ris/world`)

    _world.on('connect', () => {
        console.log('world/connection')

        _world.emit('request')

        _world.on('world', data => {
            console.log('world/world')

            world.map = data.map
            world.width = data.width
            world.height = data.height

            world.player.posX = Math.round(data.width)
            world.player.posY = Math.round(data.height)

        })

        _world.on('gameover', data => {
            console.log('world/gameover', data)
            world.isGameRunning = false
            setTimeout(() => {
                world.map = data.map,
                world.vPlayers = data.players
            }, 3000);
        })
    })


    return _world
}
