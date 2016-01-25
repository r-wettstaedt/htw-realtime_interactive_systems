import world from '../world/world'
import loop from '../loop'
import lobby from '../../_modules/lobby/lobby'

export default function(io, url) {
    const _player = io.connect(`http://${url}/ris/player`)

    _player.on('connect', () => {
        _player.emit('register')
    })

    _player.on('registered', data => {
        if (world.debug) console.log('player/registered', data)
        world.width = data.width
        world.height = data.height
        world.player.posX = Math.round(data.width)
        world.player.posY = Math.round(data.height)

        world.player.id = data.id
        world.player.texture = data.texture
        world.player.texture.skippedFrames = Number.MAX_SAFE_INTEGER - 50
        world.player.hasGodMode = data.hasGodMode
        world.player.isGameMaster = data.isGameMaster

        if (data.isGameMaster) {
            lobby.initBtn().then(() => {
                _player.emit('gameStart')
            })
        }
    })

    _player.on('registeredAll', data => {
        if (world.debug) console.log('player/registeredAll', data)

        world.players = data
        lobby.setPlayers()
    })

    _player.on('gameStart', () => {
        if (world.debug) console.log('player/gameStart')

        lobby.startGame().then(() => {
            world.isGameRunning = true
            loop()
        })
    })

    _player.on('moveConfirmation', data => {
        if (world.debug) console.log('player/moveConfirmation', data)
        world.player.posX = data.posX
        world.player.posY = data.posY
        world.player.lastUpdate = Date.now()
    })

    _player.on('visibleArea', data => {
        if (world.debug) console.log('player/visibleArea', data)
        world.vPlayers = data.vPlayers
        world.map = data.map || world.map
    })

    _player.on('vPlayer', vPlayer => {
        if (world.debug) console.log('player/vPlayer', vPlayer)
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
        if (world.debug) console.log('player/lvPlayer', id)
        for (let i = 0; i < world.vPlayers.length; i++) {
            if (world.vPlayers[i].id === id) {
                world.vPlayers.splice(i, 1)
                break
            }
        }
    })

    _player.on('gameover', data => {
        if (world.debug) console.log('player/gameover')
        world.isGameRunning = false
        lobby.endGame()
        setTimeout(() => {
            world.map = data.map,
            world.vPlayers = []
            for (let id of Object.keys(data.players)) {
                if (id === world.player.id) continue
                world.vPlayers.push(data.players[id])
            }
        }, 3000);
    })

    _player.on('disconnectedPlayer', id => {
        delete world.players[id]
        lobby.setPlayers()
    })

    return _player
}
