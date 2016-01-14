import gl from '../webgl'

const vertexPositionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
const vertices = [
     1.0,  1.0,  0.0,
    -1.0,  1.0,  0.0,
     1.0, -1.0,  0.0,
    -1.0, -1.0,  0.0
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
vertexPositionBuffer.itemSize = 3
vertexPositionBuffer.numItems = 4



const vertexTextureCoordBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer)

const textureCoords = [
    1.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW)
vertexTextureCoordBuffer.itemSize = 2
vertexTextureCoordBuffer.numItems = 6

export default {
    vertexPositionBuffer : vertexPositionBuffer,
    vertexTextureCoordBuffer : vertexTextureCoordBuffer,
}
