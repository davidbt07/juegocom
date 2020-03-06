// setup canvas

const canvas = document.querySelector('canvas');
const para = document.querySelector('p');
const ctx = canvas.getContext('2d');
const ctx2 = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}
function Shape(x,y, velX, velY, exists){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}
function Ball(x,y,velx,vely,exists,color,size){
    Shape.call(this, x,y,velx,vely,exists);
    this.color = color;
    this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}
Ball.prototype.update = function(){
    if((this.x + this.size)>=width){
        this.velX = -(this.velX);
    }
    if((this.y + this.size)>=height){
        this.velY = -(this.velY);
    }
    if((this.x - this.size)<=0){
        this.velX = -(this.velX);
    }
    if((this.y - this.size)<=0){
        this.velY = -(this.velY);
    }
    this.x += this.velX;
    this.y += this.velY;
}
Ball.prototype.collisionDetect = function(){
    for(var j = 0; j < balls.length; j++){
        if((this !== balls[j])){
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < this.size + balls[j].size){
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
            }
        }
    }
}


function EvilCircle(x,y, velX, velY, existe){
    Shape.call(this, x, y, 20, 20, existe);
    this.color = 'white';
    this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function(){
    
    ctx2.beginPath();
    ctx2.strokeStyle = this.color;
    ctx2.lineWidth = 5;
    ctx2.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx2.stroke();
}

EvilCircle.prototype.checkBounds = function(){
    if((this.x + this.size)>=width){
        this.x -= this.size;  
    }
    if((this.y + this.size)>=height){
        this.y -= this.size;
    }
    if((this.x - this.size)<=0){
        this.x += this.size;
    }
    if((this.y - this.size)<=0){
        this.y += this.size;
    }
}
EvilCircle.prototype.setControls = function(){
    var _this = this;
    window.onkeydown = function(e){
        if(e.keyCode === 65){
            _this.x -= _this.velX;
        }else if (e.keyCode === 68) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
            _this.y += _this.velY;
        }
    }
}

EvilCircle.prototype.collisionDetect = function(){
    for(var j = 0; j < balls.length; j++){
        
        if(balls[j].exists === true){
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < this.size + balls[j].size){
                balls[j].exists = false;
                cantBalls -= 1;
            }
        }
    }
}
var balls = [];
var cont = 0;

var size2 = random(10,20);
var evil = new EvilCircle(random(0+size2,width-size2),
random(0+size2,height-size2),
20,
20,
true
);
evil.setControls();

var cantBalls = 0;
function loop(){
    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    ctx.fillStyle = 'rgb(0, 0, 0, 0.25)';
    ctx.fillRect(0,0,width,height);
    
    while(balls.length<5){
        var size = random(10,20);
        var ball = new Ball(
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-7,7),
            random(-7,7),
            true,
            'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
            size
        );
        balls.push(ball);
        cantBalls += 1;
    }

    for(var i = 0;i < balls.length; i++){
        
        if(balls[i].exists === true){
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
       
        }
    }
    para.textContent = 'Cantidad de Bolas: ' + cantBalls;
    if(cantBalls === 0){
        var respuesta = prompt('Quieres volver a jugar?');
        if(respuesta === 'si'|| respuesta === 'SI'){
            for(var i = 0; i<5;i++){
                balls[i].exists = true;
                cantBalls += 1;
            }
        }else{
            alert('Gracias por jugar');
        }
    }
    requestAnimationFrame(loop);
    
}

loop();