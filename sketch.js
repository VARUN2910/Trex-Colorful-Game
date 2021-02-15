var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex2.png","trex3.png");
ground1=loadImage("ground2.png");
 cloud1=loadImage("cloud.png"); 
  trex_collided = loadAnimation("trex_collide.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  gameover=loadImage("game_over.png");
  restart1=loadImage("restart.png");
  gameState=PLAY;
  checkPointSound = loadSound("checkPoint.mp3");
  jumpS=loadSound("jump.mp3");
  die=loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(80,400,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.05;
  trex.setCollider("circle",0,0,500);
  
  ground=createSprite(0,height-50,20,20);
  ground.x=ground.width/2;
  ground.addImage(ground1);
  
  ground2=createSprite(300,height-25,600,20);
  ground2.visible=false;
  
  score=0;
  
  gameOver=createSprite(width-680,height-280);
  gameOver.addImage('g',gameover);
  gameOver.scale=0.2;
  gameOver.visible=false;
  restart=createSprite(width-680,height-240);
  restart.addImage("re",restart1);
  restart.scale=0.5;
  restart.visible=false;
  cloudsGroup=new Group();
  obstaclesGroup=new Group();
}
function draw() {
  background(255);

  text("Score: "+score,width-90,30);


   if (gameState===PLAY){
  if(score%100===0 && score>0){
    checkPointSound.play();
  }
    if(frameCount%4===0){
    score=score+1;
    }
  ground.velocityX=-(8+3*score/50);
  trex.velocityY = trex.velocityY + 1;
  trex.collide(ground2);
  trex.depth=ground.depth+1;
  spawnObstacles();
  spawnClouds();
 
      if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if(keyDown("space")&&trex.y >=height-70) {
      trex.velocityY = -18;
      jumpS.play();
    }
    if(obstaclesGroup.isTouching(trex)){
        die.play();
        gameState = END;
    }
    
  }
  else
    if(gameState === END) {
    checkPointSound.stop(); 
    gameOver.visible=true;
    restart.visible=true;  
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)) {
      reset();
    }
  }
 drawSprites();
  }
function spawnClouds(){
  if (frameCount % 90 === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloud1);
    cloud.scale =random(0.06,0.1);
    cloud.velocityX = -(6 + 3*score/50);
    cloud.lifetime = 900;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  } 
}
function spawnObstacles() {
  if(frameCount % 90 === 0) {
    var obstacle = createSprite(width,height-70,10,40);
    obstacle.velocityX = -(8+3*score/50);
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale=0.08;  
              
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale=0.08;
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale=0.08;
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale=0.08;
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.scale=0.08;
              break;
      default: break;
    }
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
  }
