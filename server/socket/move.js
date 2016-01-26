import world from '../world/world'

export default function (server, basket, player, socket, data) {
    // console.log('player/move', id, data)

    if (!world.isGameRunning()) return

    let s1 = Date.now()

    const positionSet = world.setPlayerPosition(player.id, data, () => {
        //gameover
        const state = {
            players : world.playersAsShippable(true),
            map : world.asShippable().map,
        }
        server.emit('gameover', state)
    })
    if (!world.isGameRunning()) return

    let moveConfirmation = null
    if (!positionSet) {
        moveConfirmation = {
            posX : player.posX,
            posY : player.posY,
        }
    }
    socket.emit('moveConfirmation', moveConfirmation)

    world.getVisibleAreas(player.id)
    socket.emit('visibleArea', {
        vPlayers : player.vPlayers,
        map : player.map,
    })

    for (let i = 0; i < player.vPlayers.length; i++) {
        const vPlayer = player.vPlayers[i]
        const b = basket[vPlayer.id]
        if (!b || vPlayer.isAI) return

        b.emit('vPlayer', {
            id   : player.id,
            prevPosX : player.prevPosX,
            prevPosY : player.prevPosY,
            lastUpdate : player.lastUpdate,
            posX : player.posX,
            posY : player.posY,
            dir : player.dir,
            texture : player.texture,
            isAI : player.isAI,
        })
    }

    for (let i = 0; i < player.lvPlayers.length; i++) {
        const lvPlayer = player.lvPlayers[i]
        const b = basket[lvPlayer.id]
        if (!b) return

        b.emit('lvPlayer', player.id)
    }

    let e1 = Date.now()
    // console.log(e1 - s1)

}
