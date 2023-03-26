const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);
const button = document.createElement("button");
button.innerText = "시작하기"
button.addEventListener("click", startStop);
document.body.appendChild(button);

const backgroundImage = new Image();
const spaceshipImage = new Image();
const enemyImage = new Image();
const bulletImage = new Image();
const loseImage = new Image();
backgroundImage.src = "static/우주.jpg";
spaceshipImage.src = "static/우주선.png"
enemyImage.src = "static/pepe.png";
bulletImage.src = "static/bullet.png";
loseImage.src = "static/페페.jpg";
let gameOver = false;
let score = 0;

function startStop() {
    if (button.innerText = "시작하기") {
        button.innerText = "그만하기";
        createEnemy();
    }
}

let spaceX = 168;
let spaceY = 636;
function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceX, spaceY);
    ctx.fillText(`Score:${score}`, 20, 20);
    ctx.fillStyle = 'white'
    ctx.font = '20px Arial'
    bulletList.map((props)=>{if(props.alive) {ctx.drawImage(bulletImage, props.x + 32 - 14, props.y, 25, 30)} })
    enemyList.map((prop)=>{ctx.drawImage(enemyImage, prop.x, prop.y)})
}

function createBullet() {
    console.log("총알생성!")
    let bullet = new Bullet();
    bullet.init();
}

let bulletList = [];
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceX;
        this.y = spaceY;
        this.alive = true;
        bulletList.push(this);
    };
    this.shoot = function() {
        if (this.y <-25) {
            return;
        }
        this.y -= 7;
    };
    this.checkHit = function() {
        for (let i =0; i <enemyList.length; i++) {
            if (this.y <= enemyList[i].y+48 && this.y >= enemyList[i].y && this.x >= enemyList[i].x-30 && this.x <= enemyList[i].x +30) {
                score++;
                this.alive = false;
                enemyList.splice(i,1);
            }
        }
    }
}

function createEnemy() {
    setInterval(()=>{
        console.log("적군생성!")
        let enemy = new Enemy();
        enemy.init(); 
    },1500);
}

function generateRandom(min, max) {
    return Math.floor(Math.random()*(max-min+1))+min
}

let enemyList = [];
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = generateRandom(0, canvas.width-48);
        enemyList.push(this)
    }
    this.invade = function() {
        this.y +=1;
        if (this.y >= canvas.height-48)  {
            gameOver =true
        }
    }
}

let keysDown = {};
function setupKeyboardListener() {
    document.addEventListener("keydown", (event)=>{keysDown[event.key] = true;});
    document.addEventListener("keyup", (event)=>{delete keysDown[event.key]; if (event.key === " ") {createBullet();}})
}

function movingSpaceship() {
    if (spaceX > 336) {spaceX = 336;};
    if (spaceX < 0) {spaceX = 0;};
    if (spaceY > 636) {spaceY = 636;};
    if (spaceY < 0) {spaceY = 0;};
    if ("ArrowRight" in keysDown) {spaceX += 5;};
    if ("ArrowLeft" in keysDown) {spaceX -= 5;};
    if ("ArrowUp" in keysDown) {spaceY -= 5;};
    if ("ArrowDown" in keysDown) {spaceY += 5;};

    bulletList.map((props)=>{if (props.alive) {props.shoot(); props.checkHit()}});
    enemyList.map((prop)=>{prop.invade()});
}


function main() {
    if(!gameOver) {
        render();
        movingSpaceship();
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(loseImage, 50, 100,300, 300)
    }
}

setupKeyboardListener();
main();

