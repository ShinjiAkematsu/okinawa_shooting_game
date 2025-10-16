const gameBoard = document.getElementById('game-board');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

let playerLeft = 275;
let score = 0;
let gameInterval;
let enemyInterval;
let enemies = [];

const playerSpeed = 15;
const bulletSpeed = 10;
const enemySpeed = 1;

function movePlayer(e) {
    if (e.key === 'ArrowLeft' && playerLeft > 0) {
        playerLeft -= playerSpeed;
    } else if (e.key === 'ArrowRight' && playerLeft < 550) {
        playerLeft += playerSpeed;
    }
    player.style.left = playerLeft + 'px';
}

function shoot(e) {
    if (e.key !== ' ') return; // スペースキー以外は無視

    let bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = (playerLeft + 20) + 'px';
    bullet.style.bottom = '60px';
    gameBoard.appendChild(bullet);

    let bulletInterval = setInterval(() => {
        let bulletBottom = parseInt(bullet.style.bottom);
        if (bulletBottom > 500) {
            bullet.remove();
            clearInterval(bulletInterval);
            return;
        }

        // 当たり判定
        enemies.forEach((enemy, enemyIndex) => {
            const enemyRect = enemy.getBoundingClientRect();
            const bulletRect = bullet.getBoundingClientRect();

            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top
            ) {
                enemy.remove();
                enemies.splice(enemyIndex, 1);
                bullet.remove();
                clearInterval(bulletInterval);
                score += 10;
                scoreDisplay.textContent = score;
            }
        });

        bullet.style.bottom = (bulletBottom + bulletSpeed) + 'px';
    }, 20);
}

function createEnemies() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            let enemy = document.createElement('div');
            enemy.classList.add('enemy');
            enemy.style.left = (j * 60 + 40) + 'px';
            enemy.style.top = (i * 50 + 30) + 'px';
            gameBoard.appendChild(enemy);
            enemies.push(enemy);
        }
    }
}

function moveEnemies() {
    let direction = enemySpeed;
    enemyInterval = setInterval(() => {
        let furthestLeft = 560;
        let furthestRight = 40;

        enemies.forEach(enemy => {
            let enemyLeft = parseInt(enemy.style.left);
            if (enemyLeft < furthestLeft) furthestLeft = enemyLeft;
            if (enemyLeft > furthestRight) furthestRight = enemyLeft;
        });

        if (furthestRight > 560 || furthestLeft < 0) {
            direction *= -1;
            enemies.forEach(enemy => {
                enemy.style.top = (parseInt(enemy.style.top) + 30) + 'px';
                 if (parseInt(enemy.style.top) > 450) {
                    gameOver();
                }
            });
        }

        enemies.forEach(enemy => {
            enemy.style.left = (parseInt(enemy.style.left) + direction) + 'px';
        });

    }, 100);
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    alert('ゲームオーバー！ スコア: ' + score);
    startButton.textContent = 'リスタート';
    startButton.style.display = 'block';
}

function gameLoop() {
    // ゲームのメインループ（今回は主に敵の動きを制御）
    moveEnemies();
}

function startGame() {
    // リセット処理
    score = 0;
    scoreDisplay.textContent = score;
    playerLeft = 275;
    player.style.left = playerLeft + 'px';
    enemies.forEach(enemy => enemy.remove());
    enemies = [];
    document.querySelectorAll('.bullet').forEach(b => b.remove());
    clearInterval(gameInterval);
    clearInterval(enemyInterval);

    // ゲーム開始
    createEnemies();
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60fps
    startButton.style.display = 'none';
}

document.addEventListener('keydown', movePlayer);
document.addEventListener('keydown', shoot);
startButton.addEventListener('click', startGame);
