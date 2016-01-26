import socket from '../socket/'

export default {

    isGameRunning : false,

    width : 0,
    height : 0,

    map : [],

    player : {
        posX : 0,
        posY : 0,
        lastUpdate : Date.now(),
    },

    players : [],

    vPlayers : [],

    debug : location.hash === '#debug',

    updatePos : function(posX, posY, dir) {

        if (!this.isGameRunning) return

        const pPosX = Math.floor((this.player.posX + posX) / 2)
        const pPosY = Math.floor((this.player.posY + posY) / 2)
        const pPos  = pPosY * this.width + pPosX
        const n = this.map[Math.round(pPos)]

        if (this.player.hasGodMode ||
           (pPosX > 0 && pPosX < this.width &&
            pPosY > 0 && pPosY < this.height && n)) {

            this.player.posX += posX
            this.player.posY += posY
        }


        if (Date.now() - this.player.lastUpdate > 24) {
            socket.emit('move', {
                posX : this.player.posX,
                posY : this.player.posY,
                spritePos : this.player.texture.spritePos,
                dir : dir,
            })
        }
    },
}
