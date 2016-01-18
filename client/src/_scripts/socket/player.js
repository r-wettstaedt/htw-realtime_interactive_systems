import world from '../world/world'

export default function(io, port) {
    const _player = io.connect(`http://localhost:${port}/ris/player`)

    _player.on('move', data => {
        console.log('player/move')
        world.player.posX = data.posX
        world.player.posY = data.posY
        world.player.lastUpdate = Date.now()
        world.map = data.map
    })

    return _player
}
