// imports
var cursor = require('ansi')(process.stdout)
var clear = require('clear')
var keypress = require('keypress')
var brain = require('brain')

var g = 0.1

// stores the fly info
var fly
var landing
var ui = true

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
    // draw the landing
    if (ui && !fly) {
      var landpos = landing
      landpos = landpos >= 0 ? landpos < process.stdout.columns ? ~~landpos : process.stdout.columns - 1 : 0
      cursor.goto(0, 0).black().write('landing : ').grey().write('(' + landpos + '; 0)')
    }
  }
  // draw the basket
  cursor.goto()

  if (fly) {
    // draw the force
    if (ui) {
      cursor.goto(0, 0).black().write('force : ').grey().write('(' + fly.velocity.x.toFixed(2) + '; ' + fly.velocity.y.toFixed(2) + ')')
    }
    // draw the ball
    var y = process.stdout.rows - 1 - ~~fly.pos.y
    cursor.goto(~~fly.pos.x, y >= 0 ? y : 0).red().write(y < 0 ? '+' : 'O')
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
    launch({x: Math.random() * 5, y: 1 + Math.random() * 5})
  }

  if (key && key.name === 'u') {
    ui = !ui
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
