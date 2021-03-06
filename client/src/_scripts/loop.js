const mat4 = require('./../../node_modules/gl-matrix/src/gl-matrix.js').mat4
import gl from './webgl'
import world from './render/world'
import worldObj from './world/world'
import players from './render/players'
import * as socket from './socket'
import {initTextures, textures} from './util'

initTextures()

let mvMatrix = mat4.create()
let pMatrix = mat4.create()
let pressedKeys = { asIndex : -1 }

export default function loop() {
    window.requestAnimationFrame(loop)

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0)
    mat4.identity(mvMatrix)

    if (!worldObj.isGameRunning) pressedKeys = { asIndex : -1 }

    if (pressedKeys.W) worldObj.updatePos(0, -0.15, pressedKeys.asIndex)
    if (pressedKeys.S) worldObj.updatePos(0,  0.15, pressedKeys.asIndex)
    if (pressedKeys.D) worldObj.updatePos( 0.15, 0, pressedKeys.asIndex)
    if (pressedKeys.A) worldObj.updatePos(-0.15, 0, pressedKeys.asIndex)

    let s1 = Date.now()
    world(mvMatrix, pMatrix, pressedKeys, textures.world)
    let e1 = Date.now()

    let s2 = Date.now()
    players(mvMatrix, pMatrix, pressedKeys, textures.players)
    let e2 = Date.now()

    // console.log(e1 - s1, e2 - s2)
}

document.onkeypress = document.onkeyup = event => {
    const str = String.fromCharCode(event.which || event.keyCode).toUpperCase()

    if (event.type === 'keypress') {
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
        pressedKeys[str] = true
    } else if (event.type === 'keyup') {
        delete pressedKeys[str]
    }

    if (Object.keys(pressedKeys).length === 1) pressedKeys.asIndex = -1
}
