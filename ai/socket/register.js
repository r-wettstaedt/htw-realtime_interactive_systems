import world from '../world/world'
import loop from '../loop'

export default function (socket, data) {
    if (world.debug) console.log('registered')

    world.player.posX = data.posX
    world.player.posY = data.posY
    world.player.texture = data.texture

    world.width = data.world.width
    world.height = data.world.height
    world.map = data.world.map

    world.isGameRunning = true
    loop()
}
