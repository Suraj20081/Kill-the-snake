const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var snake1, snake2, snake3, deadSnake;
var breakButton;
var backgroundImage;

var stones = [];
var collided = false;
function preload() {
  snake1 = loadImage("./assets/snake1.png");
  snake2 = loadImage("./assets/snake2.png");

  snake3 = loadImage("./assets/snake3.png");
  
  deadSnake = loadImage("./assets/deadsnake.png");

  backgroundImage = loadImage("./assets/background.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20);
  leftWall = new Base(100, height - 300, 200, height / 2 + 100);
  rightWall = new Base(width - 100, height - 300, 200, height / 2 + 100);

  bridge = new Bridge(18, { x: 50, y: height / 2 - 140 });
  jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-100, 100);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }

  snake = createSprite(width / 2, height - 100, 50, 50);
  snake.addAnimation("lefttoright", snake1, snake2, snake1);
  snake.addAnimation("righttoleft", snake3, snake1, snake3);
  snake.addImage("deadSnake", deadSnake);

  snake.scale = 0.5;
  snake.velocityX = 10;

  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);

  bridge.show();

  for (var stone of stones) {
    stone.show();
    var pos = stone.body.position;
    
    var distance = dist(snake.position.x, snake.position.y, pos.x, pos.y);
    //var distance = dist(zombie.position.x, zombie.position.y);
    //var distance = dist(pos.x, pos.y);
    //var distance = dist(zombie, pos);


    /*if (distance >= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("sad");
      collided = true;
    }*/

    /*if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.Image("sad");
      collided = true;
    }*/

    if (distance <= 50) {
      snake.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      snake.changeImage("deadSnake");
      collided = true;
    }

    /*if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.Velocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("sad");
      collided = true;
    }*/

  }

  if (snake.position.x >= width - 300 && !collided) {
    snake.velocityX = -10;
    snake.changeAnimation("righttoleft");
  }

  if (snake.position.x <= 300 && !collided) {
    snake.velocityX = 10;
    snake.changeAnimation("lefttoright");
  }

  drawSprites();
}

function handleButtonPress() {
  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}
