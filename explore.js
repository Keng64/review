let tempbackground = false
let tempinside = false


function runExplore() {
    let startTime = new Date(); // Record the start time

    if (!hasrunExplore) {
        // Simulate some task with a timeout
      setTimeout(() => {
        let endTime = new Date(); // Record the end time
        let elapsedTime = (endTime - startTime) / 1000; // Time in seconds
        
        //ACTION
        plr.pos.x = 175;
        plr.pos.y = -50;
        plr.ground = 350
        plr.changeProfile(characterChoice);
        tempbackground = true
      }, 900);
      hasrunExplore = true
    } 
    //Backgrounds Display here
    if (!tempbackground) {
      image(menuBackground,0,0,400,400); // Background
      image(hole,25,200,200,200) // Hole 1
      image(hole,175,200,200,200) // Hole 2
    } else {
      // Background
      image(underground,0,0,400,400)
    }
    // TRIGGER BOX DETAILS X: 360,Y: 375,W: 75,H: 75
    enterBox = new gameObject({x: 315,y: 375},75,75)
    
    //Modify player
    plr.update()
    
    if (isCollidingAABB(plr,enterBox)) {
      fill(255)
      text("'e' to enter",plr.pos.x,plr.pos.y-20)
      if (pressedKeys.e) {
        tempinside = false
        plr.pos.y=170
        gamemode='inside'
      }
    }
}

function inside() {
  if (!tempinside) {
    plr.pos.x = 50;
    tempinside = true
  }
  if (plr.pos.x < -20) {
    plr.pos.x = 370
    gamemode = 'explore'
  } 
  if (plr.pos.x > 400) {
    plr.pos.x = 0
    gamemode = 'ending'
  }


  // MAYBE ADD A SOUND TRANSITION IN THE FUTURE USING THE DATE; TIME THING

  // BACKGROUND
  image(insideBackground,0,0,400,400)
  
  // Create object position
  door1 = new gameObject({x: 65,y: 350},1,70);
  door2 = new gameObject({x: 195,y: 350},1,70);
  door3 = new gameObject({x: 330,y: 350},1,70);
  
  fill(0)
  if (isCollidingAABB(plr,door1)) {
    text("Keng's Room",plr.pos.x-10,plr.pos.y-20);
    if (pressedKeys.e) {
      gamemode = 'kengroom'
    }
  } else if (isCollidingAABB(plr,door2)) {
    text("Accomplishments/Strength",plr.pos.x-50,plr.pos.y-20);
    if (pressedKeys.e) {
      gamemode = 'acc'
    }
  } else if (isCollidingAABB(plr,door3)) {
    text("Growth",plr.pos.x,plr.pos.y-20);
    if (pressedKeys.e) {
      gamemode = 'growth'
    }
  }
  

  //PLR update
  plr.update();
}

let kengroomtemp = false
let dayone = true
function kengroom() {
  if (plr.pos.x < -20) {
      
    dayone = true
    kengroomtemp = false
    gamemode = 'inside'
  }

  // DAY ONE
  if (dayone) {
    if (!kengroomtemp) {
      plr.pos.x=0
      kengroomtemp = true
    }
    image(DayOne,0,0,400,400)

    if (plr.pos.x > 390) {
      
      dayone = false
      kengroomtemp = false
    }

    plr.update()
  }

  // DAY NOW  
  if (!dayone) {
    if (!kengroomtemp) {
      plr.pos.x=0
      kengroomtemp = true
    }
    image(DayNow,0,0,400,400)

    if (plr.pos.x > 390) {
      dayone = true
      kengroomtemp = false
      plr.pos.x = 0
      gamemode = 'inside'
    }

    plr.update()
  }
}

let acctemp = false
function acc() {
  if (!acctemp) {
    plr.pos.x = 0
    acctemp = true
  }

  image(accomplishment,0,0,400,400)

  //DETECT USER if exit
  if (plr.pos.x > 360) {
    plr.pos.x = 20
    gamemode = 'inside'
  }

  plr.update()
}

// NOTES FOR RESET
// set player pos x to 0
// growthtemp false
// inventory empty
// bucketpickedup false
// reset bean 0
// reset mode 'gameplay'
// presenttemp false

let growthtemp = false
let inventory; // inv: empty, ebucket, fbucket
let bucketpickedup = false
let beanlevel = 0
let mode = 'gameplay' // gameplay or present
let presenttemp = false

// PICKUp bucket object
pbucket = new gameObject({x: 270,y:380},10,20)
pondObject = new gameObject({x: 60,y: 370},150,30)
plantObject = new gameObject({x: 350,y: 378},30,30)

function growth() {
  if (mode == 'gameplay') {
    if (!growthtemp) {
      plr.pos.x = 0
      growthtemp = true
    }

    //BACKGROUND
    fill(100,180,220)
    square(0,0,400)
    fill(0)
    textSize(15)
    text("Grab the bucket and water the plant!",30,200);
    text("water the plant 3 times to grow",30,220);
    image(pond,60,370,150,30)

    // BUCKET display
    if (!bucketpickedup) {
      image(ebucket,260,380,30,20)
    } else {
      try {
        image(inventory,plr.pos.x+8,plr.pos.y-20,30,20)
      } 
      catch {
        print('bucket error')
      }
    }

    // BEAN display
    if (beanlevel < 3) {
      image(plant1,350,378,30,30)
    } else if (beanlevel < 6) {
      image(plant2,330,300,70,100)
    } else if (beanlevel > 5) {
      image(plant2,315,-400,100,800)
      bucketpickedup = false
    }


    // Player mechanics bucket
    if (!bucketpickedup) {
      if (isCollidingAABB(plr,pbucket)) {
        textSize(10)
        text("'e' to pickup",plr.pos.x,plr.pos.y-20);
        if (pressedKeys.e) {
          bucketpickedup = true
          inventory = ebucket
        }
      }
    }

    if (bucketpickedup) {
      if (inventory == ebucket) {
        // fill bucket mechanics
        if (isCollidingAABB(plr,pondObject)) {
          textSize(10)
          text("'f' to fill bucket",plr.pos.x-5,plr.pos.y-25);
          if (pressedKeys.f) {
            inventory = fbucket
          }
        }
      } else if (inventory == fbucket) {
        // Start plant tree mechanics here
        if (isCollidingAABB(plr,plantObject)) {
          textSize(10)
          text("'f' to water plant",plr.pos.x-5,plr.pos.y-25);
          if (pressedKeys.f) {
            inventory = ebucket
            beanlevel+=1
          }
        }
      }
    }

    if (!bucketpickedup && (beanlevel > 5) && isCollidingAABB(plr, plantObject)) {
      textSize(10)
      text("'e' to climb the tree",plr.pos.x-25,plr.pos.y-25);
      if (pressedKeys.e) {
        mode = 'present'
      }
    }


    plr.update()
  } else if (mode == 'present') {
    if (!presenttemp) {
      plr.pos.x = 0
      plr.pos.y = 350
      presenttemp = true
    }

    image(treebackground,0,0,400,400)

    if (plr.pos.x > 360) {
      // RESET HERE
      // NOTES FOR RESET
// set player pos x to 0
// growthtemp false
// inventory empty
// bucketpickedup false
// reset bean 0
// reset mode 'gameplay'
// presenttemp false
      plr.pos.x = 0
      growthtemp = false
      inventory = 'empty'
      bucketpickedup = false
      beanlevel = 0
      mode = 'gameplay'
      presenttemp = false

      // GO TO MAIN MENU
      gamemode = 'inside'
    }

    plr.update()
  }
}

let kengTalking = false // TEST
let kengtalktrack = false
let kengnum = -5;

firsttext = 'In the future, I plan to look into mechatronics and computer science.'
secondtext = 'I want to dive into these fields because I enjoy using creativity'
secondtext2 = 'I also enjoy watching Sci-Fi movies which intrigues my passion for Mechatronics'
thirdtext = 'Thank you Morgan (PC) for helping us be comfortable and for the check ins'
fourthtext = 'Thank you Nate (SuperVisor) for giving me critical feedback and teaching me'
fifthtext = 'The end!'
function ending() {
  if (!kengTalking) {
    image(insideBackground,0,0,400,400)
  // Go back inside
    if (plr.pos.x < -50) {
      plr.pos.x = 390
      gamemode = 'inside'
    }
    // go loop room
    if (plr.pos.x > 400) {
      plr.pos.x=0
      gamemode = 'looproom'
    }


    // DISPLAY KENG
    image(keng, 350,350,50,50)
    
    // Talk
    let kengObject = new gameObject({x: 350,y: 350},50,50)
    
    if (isCollidingAABB(plr, kengObject)) {
      fill(0)
      text("'e' to talk to Keng",plr.pos.x-25,plr.pos.y-25);
      if (pressedKeys.e) {
        kengTalking = true
      }
    }

    plr.update()
  } else if (kengTalking) {
    if (!kengtalktrack) {
      kengnum = -5
      kengtalktrack = true
    }
    background(0)
    kengnum +=1;
    frameRate(5) //5
    image(keng,50,50,350,350)
    if (kengnum > 0) {
      if (kengnum < 30) {
        textSize(13)
        fill(255)
        text(firsttext,10,350)
      } else if (kengnum < 60) {
        textSize(13)
        fill(255)
        text(secondtext,10,350)
        textSize(10)
        text(secondtext2,10,370)
      } else if (kengnum < 90) {
        textSize(10)
        fill(255)
        text(thirdtext,10,350)
      } else if (kengnum < 120) {
        textSize(10)
        fill(255)
        text(fourthtext,10,350)
      } else if (kengnum < 125) {
        textSize(10)
        fill(255)
        text(fifthtext,200,350)
      }
    }

    if (kengnum > 125) {
      frameRate(60)
      kengtalktrack = false
      kengTalking = false
    }
  }
}

let loop = 0
function looproom() {
  image(insideBackground,0,0,400,400)
  if (pressedKeys.g) { // play around
    plr.maxSpeed = 50
    plr.vel = {x: 100,y: 0}
    plr.acc = {x: 200,y: 200}
  }
  if (pressedKeys.h) {
    plr.maxSpeed = 50
    plr.vel = {x: -100,y: 0}
    plr.acc = {x: -200,y: -200}
  }


  if (loop == 0) {
    if (plr.pos.x < -50) {
      plr.pos.x =390
      gamemode = 'ending'
    }
    if (plr.pos.x > 400) {
      loop+=1
      plr.pos.x = -40
    }
  } else if (loop > 0) {
    if (plr.pos.x < -50) {
      loop-=1
      plr.pos.x = 390
    }
    if (plr.pos.x > 400) {
      loop+=1
      plr.pos.x = -40
    }
  }

  plr.update()
}