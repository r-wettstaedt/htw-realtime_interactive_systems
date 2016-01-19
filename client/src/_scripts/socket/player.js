import world from '../world/world'

export default function(io, port) {
    const _player = io.connect(`http://localhost:${port}/ris/player`)

    _player.on('move', data => {
        console.log('player/move')
        world.player.posX = data.posX
        world.player.posY = data.posY
        world.player.lastUpdate = Date.now()
        world.vPlayers = data.vPlayers
        world.map = data.map || world.map
    })

    _player.on('vPlayer', vPlayer => {
        let contains = false
        for (let index = 0; index < world.vPlayers.length; index++) {
            if (world.vPlayers[index].id === vPlayer.id) {
                contains = true
                world.vPlayers[index] = vPlayer
                break
            }
        }

        if (!contains) world.vPlayers.push(vPlayer)
    })

    return _player
}
