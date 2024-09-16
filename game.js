const crypto = require('crypto');
const readline = require('readline');

// Class to handle key generation and HMAC calculation
class CryptoHandler {
    static generateKey() {
        return crypto.randomBytes(32).toString('hex'); // 256-bit key
    }

    static generateHMAC(key, message) {
        return crypto.createHmac('sha256', key).update(message).digest('hex');
    }
}

// Class to handle game rules and determine the winner
class GameRules {
    constructor(moves) {
        this.moves = moves;
        this.numMoves = moves.length;
    }

    // Generate a help table that displays win/lose/draw results
    generateHelpTable() {
        const header = ['PC\\User'].concat(this.moves);
        const table = [header];

        for (let i = 0; i < this.numMoves; i++) {
            const row = [this.moves[i]];
            for (let j = 0; j < this.numMoves; j++) {
                if (i === j) {
                    row.push('Draw');
                } else if (this.isWinningMove(i, j)) {
                    row.push('Win');
                } else {
                    row.push('Lose');
                }
            }
            table.push(row);
        }
        this.printTable(table);
    }

    // Determine if move1 beats move2
    isWinningMove(move1, move2) {
        const half = Math.floor(this.numMoves / 2);
        return (move1 - move2 + this.numMoves) % this.numMoves <= half;
    }

    // Print the help table in a formatted way
    printTable(table) {
        table.forEach(row => {
            console.log(row.join(' | '));
        });
    }

    // Determine the game outcome based on user and computer move
    determineWinner(userMove, computerMove) {
        if (userMove === computerMove) {
            return 'Draw';
        } else if (this.isWinningMove(userMove, computerMove)) {
            return 'You win!';
        } else {
            return 'Computer wins!';
        }
    }
}

// Class to handle game interaction (menu, user input, game flow)
class Game {
    constructor(moves) {
        this.moves = moves;
        this.rules = new GameRules(moves);
        this.key = CryptoHandler.generateKey();
        this.computerMove = Math.floor(Math.random() * moves.length);
        this.hmac = CryptoHandler.generateHMAC(this.key, moves[this.computerMove]);
    }

    // Show menu and wait for user input
    showMenu() {
        console.log(`HMAC: ${this.hmac}`);
        console.log('Available moves:');
        this.moves.forEach((move, index) => {
            console.log(`${index + 1} - ${move}`);
        });
        console.log('0 - Exit');
        console.log('? - Help');
        this.getUserMove();
    }

    // Get user input and process it
    getUserMove() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter your move: ', (input) => {
            if (input === '?') {
                this.rules.generateHelpTable();
                this.getUserMove();
            } else if (input === '0') {
                console.log('Goodbye!');
                rl.close();
            } else {
                const userMove = parseInt(input, 10) - 1;
                if (isNaN(userMove) || userMove < 0 || userMove >= this.moves.length) {
                    console.log('Invalid move, please try again.');
                    this.getUserMove();
                } else {
                    this.playRound(userMove);
                    rl.close();
                }
            }
        });
    }

    // Play a round of the game
    playRound(userMove) {
        console.log(`Your move: ${this.moves[userMove]}`);
        console.log(`Computer move: ${this.moves[this.computerMove]}`);
        const result = this.rules.determineWinner(userMove, this.computerMove);
        console.log(result);
        console.log(`HMAC key: ${this.key}`);
    }
}

// Validate command-line arguments and start the game
function startGame() {
    const moves = process.argv.slice(2);

    if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
        console.log('Error: You must provide an odd number of unique moves (3 or more).');
        console.log('Example: node game.js rock paper scissors');
        return;
    }

    const game = new Game(moves);
    game.showMenu();
}

startGame();
