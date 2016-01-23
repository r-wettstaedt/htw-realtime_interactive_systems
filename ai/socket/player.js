import world from '../world/world'
import loop from '../loop'

module.exports = function(io, port) {
    const _player = io.connect(`http://localhost:${port}/ris/player`)

    _player.on('connect', () => {
        _player.emit('registerAI')
    })

    _player.on('registeredAI', data => {
        console.log('player/registeredAI')
        world.player.posX = data.posX
        world.player.posY = data.posY
        world.player.texture = data.texture

        loop()
    })

    _player.on('registered', data => {
        console.log('player/registered')
        world.player.texture = data.texture
        world.player.hasGodMode = data.hasGodMode
    })

    _player.on('moveConfirmation', data => {
        world.player.posX = data.posX
        world.player.posY = data.posY
        world.player.lastUpdate = Date.now()
    })

    _player.on('visibleArea', data => {
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

    _player.on('lvPlayer', id => {
        for (let i = 0; i < world.vPlayers.length; i++) {
            if (world.vPlayers[i].id === id) {
                world.vPlayers.splice(i, 1)
                break
            }
        }
    })

    return _player
}
