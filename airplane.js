const canvas = document.getElementById("airplanefighter");
const ctx = canvas.getContext("2d");
let plane_x = 240;
let plane_y = 410;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let step = 40;
let mine_x = 0;
let mine_y = 0;
let movingMines = [];
let bullets = [];
let columns = 12;
let startingMines = 30;
let score = 0;
let scoreBonusOne = 0;
let bombsDestroyed = 0;
let second = 1;
let bulletNumber = 0;
let maxBullets = 60;
let bulletStep = 5;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function move_plane() {
	ctx.clearRect(plane_x, plane_y, step, step);
	drawPlane();
	if(rightPressed) {
  	plane_x += step;
    if (plane_x + step > canvas.width){
    	plane_x = canvas.width - step;
    }
  } else if(leftPressed) {
    	plane_x -= step;
      if (plane_x < 0){
        plane_x = 0;
       }
    }
}

function drawPlane() {
	ctx.beginPath();
	let img = new Image();
	img.addEventListener(
  	"load",
  	() => {
    	ctx.drawImage(img, plane_x, plane_y, step, step)
  	},
  	false
	);
	img.src = "airplane.svg";
	ctx.closePath();
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
  move_plane();
  if (e.key === " ") {
  	spacePressed = true;
  	loadBullets();
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
  if (e.key === " ") {
  	spacePressed = false;
  }
}

function drawObstacle() {
	ctx.beginPath();
	let img = new Image();
	img.addEventListener(
  	"load",
  	() => {
  		for (let i = 0; i < movingMines.length; ++i) {
    		ctx.drawImage(img, movingMines[i].x, movingMines[i].y, step, step)
    		ctx.clearRect(movingMines[i].x, movingMines[i].y - 10, 40, 10);
    		if (movingMines[i].y === 490) {
    			replacingMines(i);
    		}
    		if (movingMines[i].y === 400) {
    			bonusOne();
    		}
    		movingMines[i].y += 5;
    		gameOver(movingMines[i].x, movingMines[i].y);
    	}
  	},
  	false
	);
	img.src = "mine.png";
	ctx.closePath();
}

function generateStartingMines() {
	for (let i = 0; i < startingMines; ++i) {
		mine_x = (Math.floor(Math.random() * columns - 1) + 1) * step;
		mine_y = -(Math.floor(Math.random() * columns - 1) + 1) * step;
		movingMines.push({x: mine_x, y: mine_y});
	}
}

function replacingMines(position) {
	mine_x = (Math.floor(Math.random() * columns - 1) + 1) * step;
	mine_y = -(Math.floor(Math.random() * columns - 1) + 1) * step;
	movingMines[position] = ({x: mine_x, y: mine_y});
}

function main() {
	setInterval(drawObstacle, 100);
	setInterval(drawPlane, 100);
	setInterval(updateScore, 1000);
	setInterval(moveBullets, 10);
	generateStartingMines();
}

function updateScore() {
	score += second;
	document.getElementById("score").innerHTML = score;
}

function bonusOne() {
	scoreBonusOne += 1;
	document.getElementById("bonus1").innerHTML = scoreBonusOne;
}

function gameOver(mineX, mineY) {
	if (plane_x === mineX && plane_y === mineY || plane_x === mineX && plane_y === mineY + 30) {
		document.getElementById('gameover').removeAttribute("hidden");
		movingMines = [];
		second = 0;
		step = 0;
	}
}

function loadBullets () {
	bullets[bulletNumber] = ({x: plane_x, y: plane_y - 30});
	moveBullets(bulletNumber);
	++bulletNumber;
	if (bulletNumber === maxBullets) {
		bulletNumber = 0;
	}
}

function moveBullets(bulletPosition) {
	ctx.beginPath();
	let img = new Image();
	img.addEventListener(
  	"load",
  	() => {
  		for (let i = 0; i < bulletNumber; ++i) {
    		ctx.drawImage(img, bullets[i].x, bullets[i].y, step, step)
    		ctx.clearRect(bullets[i].x, bullets[i].y + 30, 40, 10);
    		if (bullets[i].y > -30) {
    			bullets[i].y -= bulletStep;	
    		}
    		impactCheck(bullets[i].x, bullets[i].y, i);
    	}
  	},
  	false
	);
	img.src = "bullet.png";
	ctx.closePath();
}

function impactCheck (bulletX, bulletY, j) {
	for (let i = 0; i < movingMines.length; ++i) {
		if (movingMines[i].x === bulletX && movingMines[i].y === bulletY && movingMines[i].y > -30) {
			movingMines[i] = [];
			explosion(bulletX, bulletY);
			replacingMines(i);
			++bombsDestroyed;
			bullets[j].y = -35;
			document.getElementById("bombs").innerHTML = bombsDestroyed;	
		}
	}
}

function explosion (explosionX, explosionY) {
	ctx.beginPath();
	let img = new Image();
	img.addEventListener(
  	"load",
  	() => {
    	ctx.drawImage(img, explosionX, explosionY, step, step)
  	},
  	false
	);
	img.src = "impact.png";
	ctx.closePath();
}
