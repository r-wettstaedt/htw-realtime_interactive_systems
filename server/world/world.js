import generator from './generator'

class World {

    constructor () {
        const maze = generator()
        this.width = maze.width
        this.height = maze.height

        this.map = maze.maze

        this.players = {}
    }

    getPlayers (id) {
        if (id)
            return this.players[id]
        return this.players
    }

    addPlayer (id) {
        this.players[id] = {
            id : id,
            posX : this.width,
            posY : this.height,
        }
    }

    removePlayer (id) {
        this.players[id] = null
    }

    setPlayerPosition (id, x, y) {
        const player = this.players[id]
        const posX = Math.floor(x / 2)
        const posY = Math.floor(y / 2)
        const pos  = posY * this.width + posX
        const n = this.map[Math.round(pos)]

        console.log(Math.floor(posX), Math.floor(posY), Math.floor(pos), n)
        if (posX > 0 && posX < this.width &&
            posY > 0 && posY < this.height &&
            this.map[Math.round(pos)]) {

            player.posX = x
            player.posY = y
        }
    }


    destroy () {
        this.width = null
        this.height = null
        this.map = null
        this.players = null
    }

}



export default {
    world : {},

    createWorld : function () {
        if (this.world.destroy)
            this.world.destroy()
        this.world = new World()
        return this
    },

    getPlayers : function() {
        return this.world.getPlayers.apply(this.world, arguments)
    },
    addPlayer : function () {
        this.world.addPlayer.apply(this.world, arguments)
        return this
    },
    removePlayer : function () {
        this.world.removePlayer.apply(this.world, arguments)
        return this
    },
    setPlayerPosition : function() {
        this.world.setPlayerPosition.apply(this.world, arguments)
        return this
    },

    asShippable : function () {
        return {
            map : this.world.map,
            width : this.world.width,
            height : this.world.height,
        }
    },
}
