import gl from './webgl'
import * as buffer from './buffer'
import shaderProgram from './shaders'
import texture from './texture'

import mat from './../../node_modules/gl-matrix/src/gl-matrix.js'
let mat4 = mat.mat4

let mvMatrix = mat4.create()
let pMatrix = mat4.create()
let neheTexture

texture('grass.png').then(function(neheTex) {
    neheTexture = neheTex
    draw()
})

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix)
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix)
}

let xRot = 0
let yRot = 0
let zRot = 0

function draw() {
    window.requestAnimationFrame(draw)

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0)

    mat4.identity(mvMatrix)

    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -5.0])

    mat4.rotate(mvMatrix, mvMatrix, xRot+=0.01, [1, 0, 0])
    mat4.rotate(mvMatrix, mvMatrix, yRot+=0.01, [0, 1, 0])
    mat4.rotate(mvMatrix, mvMatrix, zRot+=0.01, [0, 0, 1])

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cubeVertexPositionBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cubeVertexTextureCoordBuffer)
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffer.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, neheTexture)
    gl.uniform1i(shaderProgram.samplerUniform, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.cubeVertexIndexBuffer)
    setMatrixUniforms()
    gl.drawElements(gl.TRIANGLES, buffer.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)
}
