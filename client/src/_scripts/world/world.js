import socket from '../socket/'

export default {

    width : 0,
    height : 0,

    map : [],

    player : {
        posX : 0,
        posY : 0,
        lastUpdate : Date.now(),
    },

    updatePos : function(posX, posY) {
        this.player.posX += posX
        this.player.posY += posY

        if (Date.now() - this.player.lastUpdate > 100) {
            socket.player.emit('move', {
                posX : this.player.posX,
                posY : this.player.posY,
            })
        }
    },
}
