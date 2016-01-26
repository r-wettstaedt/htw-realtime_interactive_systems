import world from '../../_scripts/world/world'
import {textures} from '../../_scripts/util'

export default {

    $el : document.querySelectorAll('.lobby')[0],
    $list : document.querySelectorAll('.lobby__players')[0],
    $template : document.querySelectorAll('.lobby__player-item.hidden')[0],
    $startBtn : document.querySelectorAll('.lobby__btn')[0],
    $hideBtn : document.querySelectorAll('.lobby__btn')[1],
    $msg : document.querySelectorAll('.lobby__msg')[0],

    setPlayer : function (id, isMe) {
        const player = world.players[id]
        if (player.isAI) return

        const $clone = this.$template.cloneNode(true)
        const $icons = $clone.querySelectorAll('.lobby__player-icon')
        $clone.className = 'lobby__player-item'

        if (player.isGameMaster) $icons[0].className = 'lobby__player-icon'
        if (isMe)                $icons[1].className = 'lobby__player-icon'
        if (player.isWinner)     $icons[2].className = 'lobby__player-icon'

        const $img = $clone.children[0]
        if (textures.players) {
            $img.src = textures.players[player.texture.sprite][player.texture.spritePos].image.src
        } else {
            setTimeout(this.setPlayers.bind(this), 1000)
        }

        this.$list.appendChild($clone)
    },

    setPlayers : function () {
        this.$list.innerHTML = ''

        this.setPlayer(world.player.id, true)

        for (let id of Object.keys(world.players)) {
            if (id !== world.player.id) this.setPlayer(id)
        }
    },

    initGMBtn : function() {
        return new Promise( resolve => {
            this.$startBtn.className = 'lobby__btn'
            this.$startBtn.onclick = event => {
                event.preventDefault()
                resolve()
                this.$msg.innerHTML = 'Starting game..'
            }
        })
    },

    initJoinBtn : function() {
        return new Promise( resolve => {
            this.$msg.innerHTML = 'Game is in progress'
            this.$startBtn.innerHTML = 'Join game'
            this.$startBtn.className = 'lobby__btn'
            this.$startBtn.onclick = event => {
                event.preventDefault()
                resolve()
                this.$msg.innerHTML = 'Starting game..'
            }
        })
    },

    startGame : function() {
        return new Promise( resolve => {
            let i = 3
            this.$msg.className += ` ${this.$msg.className}--counting`
            const interval = setInterval(() => {
                this.$msg.innerHTML = i

                if (!i--) {
                    clearInterval(interval)
                    this.$el.className += ' hidden'
                    resolve()
                }
            }, 1000)
        })
    },

    endGame : function() {
        this.$msg.innerHTML = 'Game over'
        this.$msg.className = 'lobby__msg lobby__msg--panel'
        this.$list.className += ' hidden'
        this.$startBtn.className += ' hidden'
        this.$el.className = 'lobby'
    },

    showEndScreen : function() {
        this.setPlayers()
        this.$list.className = 'lobby__players'
        this.$el.className += ' lobby--overlay'
        this.$hideBtn.className = 'lobby__btn'

        this.$hideBtn.onclick = event => {
            event.preventDefault()
            this.$el.className = 'lobby'
            setTimeout(() => {
                this.$el.className += ' hidden'
            }, 250)
        }
    }

}
