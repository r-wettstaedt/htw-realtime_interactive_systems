import gl from '../webgl'

const cubeVertexPositionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer)

cubeVertexPositionBuffer.vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPositionBuffer.vertices), gl.STATIC_DRAW)
cubeVertexPositionBuffer.itemSize = 3
cubeVertexPositionBuffer.numItems = 24




const cuboidVertexPositionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, cuboidVertexPositionBuffer)

cuboidVertexPositionBuffer.vertices = [
    // Front face
    -1.0, -3.0,  1.0,
     1.0, -3.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -3.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -3.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -3.0, -1.0,
     1.0, -3.0, -1.0,
     1.0, -3.0,  1.0,
    -1.0, -3.0,  1.0,

    // Right face
     1.0, -3.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -3.0,  1.0,

    // Left face
    -1.0, -3.0, -1.0,
    -1.0, -3.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cuboidVertexPositionBuffer.vertices), gl.STATIC_DRAW)
cuboidVertexPositionBuffer.itemSize = 3
cuboidVertexPositionBuffer.numItems = 24



const vertexTextureCoordBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer)

const textureCoords = [
    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW)
vertexTextureCoordBuffer.itemSize = 2
vertexTextureCoordBuffer.numItems = 24



const vertexIndexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer)

const cubeVertexIndices = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
]

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW)
vertexIndexBuffer.itemSize = 1
vertexIndexBuffer.numItems = 36


export default {
    cubeVertexPositionBuffer : cubeVertexPositionBuffer,
    cuboidVertexPositionBuffer : cuboidVertexPositionBuffer,
    vertexTextureCoordBuffer : vertexTextureCoordBuffer,
    vertexIndexBuffer : vertexIndexBuffer,
}
