const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const playerImg = new Image();
playerImg.src = 'taylor.png';

const enemyImg = new Image();
enemyImg.src = 'kanye.png';


class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.speed = 5;
        this.bullets = [];
        this.lifes = 3;
        this.imortal = false;
        this.score = 0;
    }

    draw() {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height)
    }

    shoot() {
        this.bullets.push(new Bullet(this.x + this.width / 2, this.y));
    }

    update() {
        this.draw();
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.y < 0) {
                this.bullets.splice(index, 1);
            }
        });
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.speed = 10;
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= this.speed;
        this.draw();
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.speed = 1;
    }

    draw() {
        ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height)
    }

    update() {
        this.y += this.speed;
        this.draw();
    }
}

const player = new Player(canvas.width / 2 - 25, canvas.height - 70);
let enemies = [];

setInterval(() => {
    const enemyX = Math.random() * (canvas.width - 50);
    enemies.push(new Enemy(enemyX, -50));
}, 1500);

setInterval(() => {
    player.shoot()
}, 500)

const checkCollision = (rect1, rect2) => {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
};

const drawText = (text, x, y, fontSize = '20px', fontFamily = 'Arial', color = 'black') => {
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
};

const setImortal = () => {
    player.imortal = false
}

let isGameOver = false

const gameOver = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawText('GAME OVER', canvas.width / 2 - 60, canvas.height / 2, '40px');
    drawText('Clique para reiniciar', canvas.width / 2 - 80, canvas.height / 2 + 40);
};

const drawGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!isGameOver){
        player.update();

        drawText(`Vidas: ${player.lifes}`, 10, 30);
        drawText(`Pontuação: ${player.score}`, 10, 50)
        enemies.forEach((enemy, index) => {
            enemy.update();

            if (enemy.y > canvas.height) {
                enemies.splice(index, 1);
            }

            player.bullets.forEach((bullet, bIndex) => {
                if (checkCollision(bullet, enemy)) {
                    enemies.splice(index, 1);
                    player.bullets.splice(bIndex, 1);
                    player.score += 1
                }
            });
            if (checkCollision(player, enemy)) {
                if(player.lifes <= 0){
                    isGameOver = true
                    gameOver()
                    return
                }
                if(player.imortal){
                    console.log('im')
                } else {
                    console.log('O jogador colidiu com um inimigo!');
                    player.lifes -= 1
                    player.imortal = true
                    setTimeout(setImortal, 3000)
                }
                
                // Implemente aqui a lógica para tratar a colisão (reduzir vidas, finalizar jogo, etc.)
            }
        });
    } else {
        gameOver()
    }

    requestAnimationFrame(drawGame);
};

const updatePlayerPosition = (x) => {
    player.x = x - canvas.offsetLeft - player.width / 2;
};

canvas.addEventListener('mousemove', (e) => {
    updatePlayerPosition(e.clientX);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
    const touch = e.touches[0];
    updatePlayerPosition(touch.clientX);
});

canvas.addEventListener('click', () => {
    if(isGameOver){
        isGameOver = false 
        player.lifes = 3
        player.score = 0
        enemies = []
        drawGame()
    } 
});

drawGame();
