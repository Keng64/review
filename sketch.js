let morgan;
let nate;
let gamemode = 'menu';
let pressedKeys = {};
let hasrunExplore = false;
let hasrunchar = false;
let characterChoice;
let t=0;
function preload() {
  // Load assets
  morgan = loadImage('/assets/morgan.jpg');
  nate = loadImage('/assets/nate.jpg');
  nocharacter = loadImage('/assets/nocharacter.jpg');
  menuBackground = loadImage('/assets/menubackground.png');
  hole=loadImage('/assets/hole.png');
  underground = loadImage('/assets/undergroundBackground.png');
  insideBackground = loadImage('/assets/inside.png')
  DayOne = loadImage('/assets/DayOne.png')
  DayNow = loadImage('/assets/DayNow.png')
  accomplishment = loadImage('/assets/accomplishments.png')
  pond = loadImage('/assets/pond.png')
  ebucket = loadImage('/assets/emptybucket.png')
  fbucket = loadImage('/assets/filledbucket.png')
  plant1 = loadImage('/assets/plant1.png')
  plant2 = loadImage('/assets/tree.png')
  treebackground = loadImage('/assets/treebackground.png')
  keng = loadImage('/assets/keng.png')
}

///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
/////////////////////// CLASSES

class player {
  constructor(position) {
    this.pos = position; // Player position
    this.char;
    
    this.vel = { x: 0, y: 0 }; // Player velocity
    this.acc = { x: 0, y: 0 }; // Player acceleration
    this.gravity = 0.5; // Gravity strength
    this.ground = 350; // Ground level (adjust as needed)
    this.friction = 0.85; // Friction to slow down horizontal movement
    this.maxSpeed = 2; // Max horizontal speed
    this.width = 50;
    this.height = 50;
  }

  changeProfile(profile) {
    this.char = profile;
  }

  update() {
    if (!hasrunchar) {
      this.char = nocharacter
      hasrunchar = true
    }
    image(this.char,plr.pos.x,plr.pos.y,this.width,this.height)
      // Apply gravity
    this.vel.y += this.gravity; // Gravity accelerates downward velocity

    // Horizontal movement
    if (pressedKeys.a) {
      this.acc.x = -0.5; // Accelerate left
    } else if (pressedKeys.d) {
      this.acc.x = 0.5; // Accelerate right
    } else {
      this.acc.x = 0; // No acceleration when no keys are pressed
    }

    // Apply acceleration to velocity
    this.vel.x += this.acc.x;

    // Limit horizontal speed to maxSpeed
    this.vel.x = constrain(this.vel.x, -this.maxSpeed, this.maxSpeed);

    // Apply friction to slow down gradually when no keys are pressed
    if (!pressedKeys.a && !pressedKeys.d) {
      this.vel.x *= this.friction;
      if (abs(this.vel.x) < 0.1) this.vel.x = 0; // Stop completely if very slow
    }

    // Update position with velocity
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // Prevent falling below the ground
    if (this.pos.y > this.ground) {
      this.pos.y = this.ground; // Stop at ground level
      this.vel.y = 0;           // Reset vertical velocity
    }

    // Jumping
    if ((pressedKeys.w || pressedKeys[" "]) && this.pos.y === this.ground) {
      this.vel.y = -10; // Add upward velocity for jump
    }
  }
}

class gameObject {
  constructor (position,w,h) {
    this.pos = position;
    this.width = w;
    this.height = h;
  }
}


function isCollidingAABB(player,object) {
  return (
    player.pos.x < object.pos.x + object.width &&
    player.pos.x + player.width > object.pos.x &&
    player.pos.y < object.pos.y + object.height &&
    player.pos.y + player.height > object.pos.y
  );
}

///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
////////////////////////// SET UPS

function setup() {
  createCanvas(400, 400);
}


///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
/////////////////////// DRAW

const plr = new player({x: 0, y: 0})
const char1 = new gameObject({x: 100,y: 250},50,50);
const char2 = new gameObject({x: 250,y: 250},50,50);
function draw() {
  background(255);
  
  if (gamemode == 'menu') {
    //Create background
    image(menuBackground,0,0,400,400); // Background
    image(hole,25,200,200,200) // Hole 1
    image(hole,175,200,200,200) // Hole 2
    textSize(14)
    fill(255)
    text('Jump at your desired character, to choose your character',20,150)
    text('                    Morgan                              Nate',20,240)

    // Show Players
    image(morgan,(400/4),250,50,50)
    image(nate,(400/2)+50,250,50,50)

    //Modify player
    plr.update()

    //is colliding with morgan
    if (isCollidingAABB(plr,char1)) {
      plr.ground = 600;
      characterChoice = morgan;
      gamemode = 'explore';
    } else if (isCollidingAABB(plr,char2)) { // is colliding with morgan
      plr.ground = 600;
      characterChoice = nate;
      gamemode = 'explore';
    }
  } else if (gamemode == 'explore') {
    runExplore();
  } else if (gamemode == 'inside') {
    inside();
  } else if (gamemode == 'kengroom') {
    kengroom();
  } else if (gamemode == 'acc') {
    acc();
  } else if (gamemode == 'growth') {
    growth();
  } else if (gamemode == 'ending') {
    ending();
  } else if (gamemode == 'looproom') {
    looproom();
  }
}

function keyPressed() {
  pressedKeys[key] = true;
}

function keyReleased() {
  pressedKeys[key] = false;
}