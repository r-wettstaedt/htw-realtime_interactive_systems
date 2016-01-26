import world from '../world/world'
import lobby from '../../_modules/lobby/lobby'
import loop from '../loop'

export function registered (socket, data) {
    if (world.debug) console.log('registered', data)

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
        lobby.initGMBtn().then(() => {
            socket.emit('gamestart')
        })
    }
    if (data.isGameRunning) {
        lobby.initJoinBtn()
        .then(lobby.startGame.bind(lobby))
        .then(loop)
        world.isGameRunning = data.isGameRunning
    }

}

export function registeredAll (socket, data) {
    if (world.debug) console.log('registeredAll', data)

    world.players = data
    lobby.setPlayers()

}
