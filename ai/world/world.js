import socket from '../socket/'

export default {

    isGameRunning : true,

    width : 0,
    height : 0,

    map : [],

    player : {
        posX : 0,
        posY : 0,
        lastUpdate : Date.now(),

        texture : {
            dirIndex : 0,
            spritePos : 18,
        }
    },

    vPlayers : [],

    updatePos : function(posX, posY, dir) {

        if (!this.isGameRunning) return
        this.player.posX = posX
        this.player.posY = posY
        this.player.texture.spritePos = dir * 9

        if (Date.now() - this.player.lastUpdate > 24) {
            socket.player.emit('move', {
                posX : this.player.posX,
                posY : this.player.posY,
                spritePos : this.player.texture.spritePos,
                dir : dir,
            })
        }
    },
}