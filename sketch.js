//Declaración de variables
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage, cloudsGroup;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;
var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOverImg, restart, restartImg;

var jumpSound, dieSound, checkPointSound;

function preload(){
  //Precarga de las animaciones e imagenes
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}


function setup() {
  createCanvas(600, 200);
  
  var message = "Este es un mensaje";
  console.log(message);
  
  //Creación del objeto trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;

 //Creación del objeto suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //Creación del objeto suelo invisible  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //Texto game over
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  //imagen restart
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  //Creación de grupos
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //Valor inicial del marcador
  score = 0;
  
  //Radio de colisión de rex
  trex.setCollider("circle", 0,0,40);
  trex.debug = false;
}


function draw() {
  //Color de fondo
  background("red");  
  
  //Marcador
  text("Score: " + score, 500,50);
  
  if(gameState === PLAY){
    //visibilidad game over
    gameOver.visible = false;
    restart.visible = false;
    
    //Avance del suelo
    ground.velocityX = -(4 + 3*score/100);

    //Puntuación
    score = score + Math.round(getFrameRate()/60);
    
    //Visualización del suelo
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //Salto y Gravedad en trex
    if(keyDown("space") && trex.y>=150) {
      trex.velocityY = -13;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 0.8;
  
    //Aparición de las nubes
    spawnClouds();
  
    //Aparición de los obstáculos
    spawnObstacles();
    
    //Colisión de trex con obstáculos
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
    
    //Sonido del checkPoint (cada 100 puntos)
    if(score > 0 && score % 100 === 0){
      checkPointSound.play();
    }
  }
   else if (gameState === END) {
    //visibilidad game over 
    gameOver.visible = true;
    restart.visible = true;
     
    //Suelo estático
    ground.velocityX = 0;
    trex.velocityY = 0;
     
    //Cambia animación del trex
    trex.changeAnimation("collided",trex_collided);
     
    //Establece ciclo de vida interminable
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //Nubes y obstáculos estáticos
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
     
     //Función del botón reinicio
    if(mousePressedOver(restart) || keyDown("space")){
    reset();
    }
  }
  
  //Suelo donde corre trex
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}


function spawnObstacles(){
  //Aparición de los obstáculos
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + score / 100);
    
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
    }
    
    obstacle.scale = 0.5;
    obstacle.lifetime = 105;
    
    //Añade cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }  
}


function spawnClouds() {
  //Dibujar las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
       
    //Ciclo de vida de la nube
    cloud.lifetime = 205;
    
    //Ajusta de profundidad de nube
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //Añade cada nube al grupo
    cloudsGroup.add(cloud);
  }
}

