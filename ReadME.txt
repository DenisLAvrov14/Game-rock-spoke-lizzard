# Rock-Paper-Scissors (Generalized Version)

This is a cryptographically secure implementation of the **generalized** "Rock-Paper-Scissors" game. The game allows you to input any odd number of moves (greater than or equal to 3) as command-line arguments, and it uses HMAC to ensure the computer’s fairness.

## How the Game Works:

1. **Game Initialization**:
   - The player provides an odd number of unique moves (e.g., "rock", "paper", "scissors" or "rock", "paper", "scissors", "lizard", "Spock") via the command-line arguments.
   - The script generates a cryptographically secure random key (256 bits) using the `crypto` library.
   - The computer makes its move randomly from the available options.
   - A **HMAC** (using SHA-256) is generated from the computer's move and the secure key. The HMAC is shown to the user.

2. **User Turn**:
   - The user is shown a list of available moves along with an HMAC that corresponds to the computer’s move. The HMAC ensures that the computer's move was not altered after the player makes their move.
   - The user is asked to input their move by selecting the corresponding number.
   - If the user enters `?`, a help table is displayed that shows the win/lose/draw relationships between all possible moves.
   - The user can enter `0` to exit the game.

3. **Game Outcome**:
   - Once the user has made their choice, the computer's move is revealed.
   - The game then displays who won based on the circular game logic (half the moves following the player’s move are winners, half are losers).
   - The cryptographic key used for HMAC is revealed so the user can verify the HMAC’s correctness.

## Rules for Winning:

- The win/lose relationships follow a **circular** structure. For example:
   - If there are 5 moves, the 2 moves after your move win, and the 2 moves before your move lose.
   - For 3 moves (rock-paper-scissors): 4
     - Rock beats scissors.
     - Scissors beat paper.
     - Paper beats rock.
   - This pattern holds for any number of moves.

## Command-Line Usage:

```bash
node game.js [move1] [move2] [move3] ...

Examples:
node game.js rock paper scissors
node game.js rock paper scissors lizard Spock