// imports
var cursor = require('ansi')(process.stdout)
var clear = require('clear')
var keypress = require('keypress')
var brain = require('brain')

var g = 0.1

// stores the fly info
var fly
var landing

function launch(velocity) {
  // check if velocity is a fine object
  if (!velocity || !velocity.x || !velocity.y || fly) {
    return
  }
  // save fly data
  fly = {
    pos: { x:0, y:0 },
    t: 0,
    velocity: velocity
  }

}

function iterate() {
  // if velocity is real and positive
  if (!(fly && fly.velocity.x >= 0 && fly.velocity.y >= 0)) {
    return
  }
  // if the height is floor, we stop
  if (fly.pos.y <= 0 && fly.t > 0) {
    landing = fly.pos.x
    fly = undefined
    return
  }

  // increment time
  fly.t++
  // compute next position
  fly.pos.x = fly.velocity.x * fly.t
  fly.pos.y = -g*Math.pow(fly.t, 2) + fly.velocity.y * fly.t
}


function draw() {
  // clear screen
  console.log('\033[2J')
  // reset cursor
  cursor.reset()

  // iterate
  iterate()

  // draw the character
  cursor.goto(0, process.stdout.rows - 2).black().write('X')
  // draw the wall
  cursor.goto(0, process.stdout.rows - 1).grey().write(Array(process.stdout.columns).join("-"))
  // draw the landing
  if (landing) {
    cursor.goto(landing, process.stdout.rows - 1).yellow().write('#')
  }
  // draw the ball
  if (fly) {
    cursor.goto(~~fly.pos.x, process.stdout.rows - 1 - ~~fly.pos.y).red().write('O')
  }
}



function key(character, key) {
  // handle ctrl+c
  if (key && key.ctrl && key.name === 'c') {
    process.stdin.pause()
    console.log('\033[2J')
    cursor.reset()
    process.exit()
  }

  if (key && key.name === 'e') {
    launch({x: 1.75, y: 2})
  }
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

// start the program
main()
