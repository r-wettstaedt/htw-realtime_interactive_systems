# Mazerunners
Multiplayer Mazerunning game in WebGL.

##This game was built with following criteria in mind
* realtime multiplayer capabilities
* actual 3D objects in WebGL
* dynamically fetched and rendered world
* multiple AIs joining the players

##Screenshot
![screenshot](https://r-wettstaedt.com/images/ris/thumbnail.png "screenshot")

##Architecture
* Client
    * game world rendered in vanilla WebGL (no libraries)
    * own spritesheet loader and animator
    * dynamically renders more parts of the world, depending on the line of sight of the player
    * connection to the server via WebSockets

* Server
    * Node.js application, handling connections, position and individual player world objects
    * randomly generates a maze on match start using [depth-first algorithm](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker)

* AI
    * communicates to the server like a client
    * walks semi-randomly through the maze
    * is a __bunny__ 🐇
    * may __glow__
