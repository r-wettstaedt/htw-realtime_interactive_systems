import world from '../world/world'

export default function(io, port) {
    const _player = io.connect(`http://localhost:${port}/ris/player`)

    _player.on('moveConfirmation', data => {
        console.log('player/moveConfirmation')
        world.player.posX = data.posX
        world.player.posY = data.posY
        world.player.lastUpdate = Date.now()
    })

    _player.on('visibleArea', data => {
        console.log('player/visibleArea', data)
        world.vPlayers = data.vPlayers
        world.map = data.map || world.map
    })

    _player.on('vPlayer', vPlayer => {
        console.log('player/vPlayer')
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

    _player.on('lvPlayer', id => {
        console.log('player/lvPlayer')
        for (let i = 0; i < world.vPlayers.length; i++) {
            if (world.vPlayers[i].id === id) {
                world.vPlayers.splice(i, 1)
                break
            }
        }
    })

    return _player
}
