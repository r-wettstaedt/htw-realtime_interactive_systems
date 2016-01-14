import cube from './buffers/cube'
import plane from './buffers/plane'


export default {
    cube : {
        vertexPositionBuffer : cube.cubeVertexPositionBuffer,
        vertexTextureCoordBuffer : cube.vertexTextureCoordBuffer,
        vertexIndexBuffer : cube.vertexIndexBuffer,
    },
    cuboid : {
        vertexPositionBuffer : cube.cuboidVertexPositionBuffer,
        vertexTextureCoordBuffer : cube.vertexTextureCoordBuffer,
        vertexIndexBuffer : cube.vertexIndexBuffer,
    },
    plane : plane,
}
