import world from './world/world'
import socket from './socket/'
world.createWorld()
let fork = require('child_process').fork

for (let i = 0; i < 2; i++) {
    let child = fork('./../ai/app')
}
