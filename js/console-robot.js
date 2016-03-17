// imports
var cursor = require('ansi')(process.stdout)
var clear = require('clear')
var keypress = require('keypress')
var brain = require('brain')

var g = 9.81

// stores the fly info
var fly = {
  velocity: { x:0, y:0 },
  pos: { x:0, y:20 },
  t: 0
}

function launch(velocity) {
  // check if velocity is a fine object
  if (!velocity || !velocity.x || !velocity.y) {
    return
  }
  // save fly data
  fly.pos = { x:0, y:20 }
  fly.t = 0
  fly.velocity = velocity
}

function iterate() {
  // if velocity is real and positive
  if (!(fly.velocity.x > 0 && fly.velocity.y > 0)) {
    return
  }

  // increment time
  fly.t++
  // compute next position
  fly.pos.x = fly.velocity.x * fly.t
  fly.pos.y = 5
}


function draw() {
  // clear screen
  console.log('\033[2J')
  // reset cursor
  cursor.reset()

  // iterate
  iterate()

  // draw the character
  cursor.goto(0, 20).black().write('X')
  // draw the ball
  cursor.goto(~~fly.pos.x, ~~fly.pos.y).red().write('O')
}

function main() {
  // set the frame duration
  var framerate = 100
  i = 0

  // hook up on the keyboard
  keypress(process.stdin)
  process.stdin.on('keypress', key)
  process.stdin.setRawMode(true)
  process.stdin.resume()

  // program the graphic update
  var drawId = setInterval(draw, framerate)
}


function key(character, key) {
  // handle ctrl+c
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause()
    console.log('\033[2J')
    cursor.reset()
    process.exit()
  }
}

// start the program
main()
