const canvas = document.getElementById("airplanefighter");
const ctx = canvas.getContext("2d");
let plane_x = 240, plane_y = 410;
let rightPressed = false, leftPressed = false, spacePressed = false;
let step = 40;
let mine_x = 0, mine_y = 0, movingMines = [], columns = 12, startingMines = 30;
let score = 0, scoreBonusOne = 0, bombsDestroyed = 0, second = 1;
let bulletNumber = 0, maxBullets = 60, bulletStep = 5, bullets = [];
let ZERO = 0, TEN = 10, THIRTY = 30, FORTY = 40, HUNDRED = 100, THOUSAND = 1000, ONE = 1, THIRTY_FIVE = 35, FIVE = 5;
let bombOutside = 490, bonusPosition = 400;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function move_plane() {
	ctx.clearRect(plane_x, plane_y, step, step);
	drawPlane();
	if (rightPressed) {
  	plane_x += step;
    if (plane_x + step > canvas.width) { 
    	plane_x = canvas.width - step;
    }
  } else if (leftPressed) {
    	plane_x -= step;
      if (plane_x < ZERO) {
        plane_x = ZERO;
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
  		for (let i = ZERO; i < movingMines.length; ++i) {
    		ctx.drawImage(img, movingMines[i].x, movingMines[i].y, step, step)
    		ctx.clearRect(movingMines[i].x, movingMines[i].y - TEN, FORTY, TEN);
    		if (movingMines[i].y === bombOutside) {
    			replaceMines(i);
    		}
    		if (movingMines[i].y === bonusPosition) {
    			bonusOne();
    		}
    		movingMines[i].y += FIVE;
    		gameOver(movingMines[i].x, movingMines[i].y);
    	}
  	},
  	false
	);
	img.src = "mine.png";
	ctx.closePath();
}

function generateStartingMines() {
	for (let i = ZERO; i < startingMines; ++i) {
		mine_x = (Math.floor(Math.random() * columns - ONE) + ONE) * step;
		mine_y = -(Math.floor(Math.random() * columns - ONE) + ONE) * step;
		movingMines.push({x: mine_x, y: mine_y});
	}
}

function replaceMines(position) {
	mine_x = (Math.floor(Math.random() * columns - ONE) + ONE) * step;
	mine_y = -(Math.floor(Math.random() * columns - ONE) + ONE) * step;
	movingMines[position] = ({x: mine_x, y: mine_y});
}

function main() {
	setInterval(drawObstacle, HUNDRED);
	setInterval(drawPlane, HUNDRED);
	setInterval(updateScore, THOUSAND);
	setInterval(moveBullets, TEN);
	generateStartingMines();
}

function updateScore() {
	score += second;
	document.getElementById("score").innerHTML = score;
}

function bonusOne() {
	scoreBonusOne += ONE;
	document.getElementById("bonus1").innerHTML = scoreBonusOne;
}

function gameOver(mineX, mineY) {
	if (plane_x === mineX && plane_y === mineY || plane_x === mineX && plane_y === mineY + THIRTY) {
		document.getElementById('gameover').removeAttribute("hidden");
		movingMines = [];
		second = ZERO;
		step = ZERO;
	}
}

function loadBullets() {
	bullets[bulletNumber] = ({x: plane_x, y: plane_y - THIRTY});
	moveBullets(bulletNumber);
	++bulletNumber;
	if (bulletNumber === maxBullets) {
		bulletNumber = ZERO;
	}
}

function moveBullets(bulletPosition) {
	ctx.beginPath();
	let img = new Image();
	img.addEventListener(
  	"load",
  	() => {
  		for (let i = ZERO; i < bulletNumber; ++i) {
    		ctx.drawImage(img, bullets[i].x, bullets[i].y, step, step)
    		ctx.clearRect(bullets[i].x, bullets[i].y + THIRTY, FORTY, TEN);
    		if (bullets[i].y > -THIRTY) {
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

function impactCheck(bulletX, bulletY, j) {
	for (let i = ZERO; i < movingMines.length; ++i) {
		if (movingMines[i].x === bulletX && movingMines[i].y === bulletY && movingMines[i].y > -THIRTY) {
			movingMines[i] = [];
			explosion(bulletX, bulletY);
			replaceMines(i);
			++bombsDestroyed;
			bullets[j].y = -THIRTY_FIVE;
			document.getElementById("bombs").innerHTML = bombsDestroyed;	
		}
	}
}

function explosion(explosionX, explosionY) {
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
