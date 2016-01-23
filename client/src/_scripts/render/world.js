import gl from '../webgl'
import buffer from '../buffer'
import shaderProgram from '../shaders'
import texture from '../texture'
import {degToRad, stack} from '../util'
import world from '../world/world'
const mat4 = require('./../../../node_modules/gl-matrix/src/gl-matrix.js').mat4

let neheTextures

texture(['castleCenter.png', 'grassCenter.png', 'boxCoin.png', 'bg_castle.png']).then( textures => {neheTextures = textures })

export default function draw(mvMatrix, pMatrix, pressedKeys) {
    let startPosX = - world.player.posX - 1
    let startPosY = - world.player.posY - 0.5

    let posX = startPosX - 2
    let posY = startPosY
    let posZ = -20

    let str = []

    for (let index = 0; index < world.map.length; index++) {
        let m = world.map[index]

        if (index % world.width === 0) {
            posX = startPosX
            posY+= 2
            str.push('\n')
        }
        posX += 2
        if (m === null) continue

        stack.push(mvMatrix)

        if (m) {
            mat4.translate(mvMatrix, mvMatrix, [posX, -posY, posZ])

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cube.vertexPositionBuffer)
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.cube.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
        } else {
            mat4.translate(mvMatrix, mvMatrix, [posX, -posY, posZ + 2])

            mat4.rotate(mvMatrix, mvMatrix, degToRad(90), [1, 0, 0])
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cuboid.vertexPositionBuffer)
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.cuboid.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cube.vertexTextureCoordBuffer)
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffer.cube.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        if (neheTextures)
            gl.bindTexture(gl.TEXTURE_2D, neheTextures[m])
        gl.uniform1i(shaderProgram.samplerUniform, 0)

        let length = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2))
        let brightness = 0.8 - (length * 0.15)
        let brightnessColor = [1.0, 1.0, 1.0, 1.0]

        let w = world.vPlayers
        for (let i = 0; i < world.vPlayers.length; i++) {
            let vPlayer = world.vPlayers[i]
            if (!vPlayer.isAI || vPlayer.texture.sprite === 4) continue

            let X =
                vPlayer.posX - world.width -
                posX - world.player.posX  + world.width

            let Y =
                vPlayer.posY - world.height -
                posY - world.player.posY + world.height

            length = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))

            let _brightness = 0.6 - (length * 0.1)
            if (_brightness < 0) _brightness = 0.0
            brightness += _brightness

            if (vPlayer.texture.sprite === 5) {
                brightnessColor = [
                    brightnessColor[0] - 0.0,
                    brightnessColor[1] - _brightness,
                    brightnessColor[2] - (0.4 * _brightness),
                    brightnessColor[3],
                ]
            } else if (vPlayer.texture.sprite === 6) {
                brightnessColor = [
                    brightnessColor[0] - 0.0,
                    brightnessColor[1] - (0.2 * _brightness),
                    brightnessColor[2] - _brightness,
                    brightnessColor[3],
                ]
            }
        }

        if (brightness < 0.05) brightness = 0.05

        gl.uniform1f(shaderProgram.brightnessUniform, brightness)
        gl.uniform4f(shaderProgram.brightnessColorUniform, brightnessColor[0], brightnessColor[1], brightnessColor[2],brightnessColor[3])

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.cube.vertexIndexBuffer)
        gl.setMatrixUniforms(mvMatrix, pMatrix)
        gl.drawElements(gl.TRIANGLES, buffer.cube.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)

        stack.pop(mvMatrix)

    }

    // console.log(str.join(' '))

}
