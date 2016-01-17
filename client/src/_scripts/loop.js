const mat4 = require('./../../node_modules/gl-matrix/src/gl-matrix.js').mat4
import gl from './webgl'
import map from './render/map'
import players from './render/players'
import * as socket from './socket'

let mvMatrix = mat4.create()
let pMatrix = mat4.create()
let pressedKeys = { asIndex : -1 }

;(function loop() {
    window.requestAnimationFrame(loop)

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0)
    mat4.identity(mvMatrix)

    map(mvMatrix, pMatrix, pressedKeys)
    players(mvMatrix, pMatrix, pressedKeys)
})()

document.onkeydown = document.onkeyup = event => {
    const str = String.fromCharCode(event.which || event.keyCode)
    socket.player.emit('move', str)

    switch (str) {
        case 'W':
            pressedKeys.asIndex = 0
            break
        case 'A':
            pressedKeys.asIndex = 1
            break
        case 'S':
            pressedKeys.asIndex = 2
            break
        case 'D':
            pressedKeys.asIndex = 3
            break
        default:
            pressedKeys.asIndex = -1
            break
    }

    pressedKeys[str]    = event.type === 'keydown'
    pressedKeys.asIndex = event.type === 'keyup' ? -1 : pressedKeys.asIndex
}
