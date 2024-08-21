const board = document.getElementById('plinko-board');
const dropButton = document.getElementById('drop-ball');

const rows = 6;
const columns = 7;
const pegSpacing = 40;
const offsetX = 20;
const offsetY = 60;
const gravity = 1;
let ball;

function createPeg(x, y) {
    const peg = document.createElement('div');
    peg.className = 'peg';
    peg.style.left = `${x}px`;
    peg.style.top = `${y}px`;
    board.appendChild(peg);
}

function createPegs() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const x = col * pegSpacing + (row % 2 ? pegSpacing / 2 : 0) + offsetX;
            const y = row * pegSpacing + offsetY;
            createPeg(x, y);
        }
    }
}

function dropBall() {
    if (ball) {
        board.removeChild(ball);
    }

    ball = document.createElement('div');
    ball.className = 'ball';
    ball.style.left = `${board.clientWidth / 2 - 7.5}px`;
    ball.style.top = '0px';
    board.appendChild(ball);

    let position = {
        x: board.clientWidth / 2 - 7.5,
        y: 0,
        vx: Math.random() * 2 - 1,
        vy: 0
    };

    function updateBall() {
        position.vy += gravity;
        position.y += position.vy;
        position.x += position.vx;

        if (position.x <= 0 || position.x >= board.clientWidth - 15) {
            position.vx *= -1;
        }

        ball.style.left = `${position.x}px`;
        ball.style.top = `${position.y}px`;

        if (position.y < board.clientHeight - 15) {
            requestAnimationFrame(updateBall);
        }
    }

    updateBall();
}

createPegs();

dropButton.addEventListener('click', dropBall);
