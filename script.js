const board = document.getElementById('plinko-board');
const dropButton = document.getElementById('drop-ball');
const betAmountInput = document.getElementById('bet-amount');
const pointsDisplay = document.getElementById('points-display');

const rows = 6;
const columns = 7;
const pegSpacing = 40;
const offsetX = 20;
const offsetY = 60;
const gravity = 0.5;
const multipliers = [0.4, 0.7, 1, 2, 3, 5, 11];
let ball;
let points = 1000;
const pegs = [];

function createPeg(x, y) {
    const peg = document.createElement('div');
    peg.className = 'peg';
    peg.style.left = `${x}px`;
    peg.style.top = `${y}px`;
    board.appendChild(peg);
    pegs.push({ x, y });
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

function createBins() {
    const binWidth = board.clientWidth / multipliers.length;
    multipliers.forEach((multiplier, index) => {
        const bin = document.createElement('div');
        bin.className = 'bin';
        bin.style.width = `${binWidth}px`;
        bin.style.left = `${index * binWidth}px`;
        bin.innerText = `${multiplier}x`;
        board.appendChild(bin);
    });
}

function updatePoints(amount) {
    points += amount;
    pointsDisplay.innerText = `Points: ${points}`;
}

function dropBall() {
    const betAmount = parseInt(betAmountInput.value);
    if (isNaN(betAmount) || betAmount < 1 || betAmount > points) {
        alert('Invalid bet amount!');
        return;
    }

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

        pegs.forEach(peg => {
            const dx = peg.x - position.x - 7.5;
            const dy = peg.y - position.y - 7.5;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 12.5) {
                position.vy *= -1;
                position.vx += (Math.random() - 0.5) * 2;
            }
        });

        if (position.x <= 0 || position.x >= board.clientWidth - 15) {
            position.vx *= -1;
        }

        ball.style.left = `${position.x}px`;
        ball.style.top = `${position.y}px`;

        if (position.y < board.clientHeight - 15) {
            requestAnimationFrame(updateBall);
        } else {
            const binIndex = Math.floor(position.x / (board.clientWidth / multipliers.length));
            const multiplier = multipliers[binIndex];
            updatePoints(betAmount * multiplier - betAmount);
        }
    }

    updatePoints(-betAmount);
    updateBall();
}

createPegs();
createBins();

dropButton.addEventListener('click', dropBall);

