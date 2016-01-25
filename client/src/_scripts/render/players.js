import gl from '../webgl'
import buffer from '../buffer'
import shaderProgram from '../shaders'
import texture from '../texture'
import {degToRad, stack} from '../util'
import world from '../world/world'
const mat4 = require('./../../../node_modules/gl-matrix/src/gl-matrix.js').mat4

export default function draw (mvMatrix, pMatrix, pressedKeys, neheTextures) {

    const players = [world.player, ...world.vPlayers]
    for (let i = 0; i < players.length; i++) {
        const player = players[i]

        stack.push(mvMatrix)

        const v = {
            X : player.posX - world.player.posX,
            Y : world.player.posY - player.posY,
        }
        if (player.isAI) {
            const max = 500
            const diff = Math.min(max, Date.now() - player.lastUpdate)
            const diffX = (player.posX - player.prevPosX) / max * diff
            const diffY = (player.posY - player.prevPosY) / max * diff

            player.iPosX = player.prevPosX + diffX || player.posX
            player.iPosY = player.prevPosY + diffY || player.posY
            v.X = player.iPosX - world.player.posX
            v.Y = world.player.posY - player.iPosY

            player.animation = {
                maxDuration : max,
                diff : diff,
            }
        }
        mat4.translate(mvMatrix, mvMatrix, [v.X, v.Y, -18.5])

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.plane.vertexPositionBuffer)
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.plane.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.plane.vertexTextureCoordBuffer)
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffer.plane.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        if (neheTextures && player.texture) {
            const texture = player.texture

            if (++texture.skippedFrames >= 4) {
                texture.skippedFrames = 0
                texture.dirIndex = (texture.dirIndex + 1) % 9

                if (i === 0 && pressedKeys.asIndex >= 0) {
                    texture.spritePos = texture.dirIndex + (pressedKeys.asIndex * 9)

                    if (world.debug) console.log(player)
                }
            }

            if (player.isAI) {
                texture.dirIndex = Math.floor(9 / player.animation.maxDuration * player.animation.diff) % 9

                texture.spritePos = texture.dirIndex + (player.dir * 9)
                if (isNaN(texture.spritePos)) texture.spritePos = 18
            }


            gl.bindTexture(gl.TEXTURE_2D, neheTextures[texture.sprite][texture.spritePos])
        }

        gl.uniform1i(shaderProgram.samplerUniform, 0)

        let length = Math.sqrt(Math.pow(v.X, 2) + Math.pow(v.Y, 2))
        let brightness = 1 - (length * 0.1)
        if (brightness < 0.05) brightness = 0.05
        if (!world.isGameRunning) brightness = 1

        gl.uniform1f(shaderProgram.brightnessUniform, brightness)

        gl.setMatrixUniforms(mvMatrix, pMatrix)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.plane.vertexPositionBuffer.numItems)

        stack.pop(mvMatrix)
    }

}
