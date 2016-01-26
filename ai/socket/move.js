import world from '../world/world'

export default function (socket, data) {
    if (world.debug) console.log('moveConfirmation', data)

    world.player.posX = data.posX
    world.player.posY = data.posY
    world.player.lastUpdate = Date.now()

}
