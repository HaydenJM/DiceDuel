/* 
Licensed under the Open Source License for "Dice Duel". 
See LICENSE.txt for details.
*/

class DiceDuel {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.createBackgroundBubbles();
        this.resetGame();
		
		if (this.confirmationModal) {
			this.confirmationModal.classList.add('hidden');
			this.confirmationModal.style.display = 'none';
		}

		if (this.resultsModal) {
			this.resultsModal.classList.add('hidden');
			this.resultsModal.style.display = 'none';
		}
    }

    // Element Initialization
    initializeElements() {
    // Screens
        this.screens = {
            start: document.getElementById('start-screen'),
            multiplayer: document.getElementById('multiplayer-modes'),
            help: document.getElementById('help-screen'),
            gameBoard: document.getElementById('game-board')
        };

    // Verify all screens are found
        Object.entries(this.screens).forEach(([key, screen]) => {
            if (!screen) {
                console.error(`Screen not found: ${key}`);
            }
        });

    // Start Screen Buttons
        this.singleplayerBtn = document.getElementById('singleplayer-btn');
        this.multiplayerBtn = document.getElementById('multiplayer-btn');
        this.helpBtn = document.getElementById('help-btn');

    // Multiplayer Mode Buttons
        this.multiplayerModes = {
            oneRound: document.getElementById('mode-1round'),
            threeRounds: document.getElementById('mode-3rounds'),
            fiveRounds: document.getElementById('mode-5rounds'),
            unlimited: document.getElementById('mode-unlimited'),
            returnToStart: document.getElementById('return-to-start')
        };

    // Help Screen
        this.closeHelpBtn = document.getElementById('close-help');

    // Game Board Elements
        this.gameMode = 'singleplayer';
        this.gameModeDisplay = document.querySelector('.game-mode-display');
        this.rollDiceButton = document.getElementById('roll-dice');
        
    // In-Game Control Buttons
        this.restartGameBtn = document.getElementById('restart-game');
        this.returnToMenuBtn = document.getElementById('return-to-menu');

    // Dice and Sum Elements
        this.dice1 = document.querySelector('.dice1');
        this.dice2 = document.querySelector('.dice2');
		
    // Robust dice sum element initialization
        const diceSumElement = document.querySelector('.dice-sum');
			if (diceSumElement) {
				this.diceSumElement = diceSumElement;
			} else {
    // Create the element if it doesn't exist
				this.diceSumElement = document.createElement('div');
				this.diceSumElement.classList.add('dice', 'dice-sum');
            
    // Try to insert it next to the other dice elements
        const diceSection = document.querySelector('.dice-section');
            if (diceSection) {
                diceSection.insertBefore(this.diceSumElement, document.getElementById('roll-dice'));
                console.warn('Dice sum element was automatically created');
            } else {
                console.error('Could not create dice sum element');
            }
        }
        
    // Player Elements
        this.player1Grid = document.querySelector('.player1 .number-grid');
        this.player2Grid = document.querySelector('.player2 .number-grid');
        this.player1ScoreElement = document.getElementById('player1-score');
        this.player2ScoreElement = document.getElementById('player2-score');
        
    // Confirmation Modal
        this.confirmationModal = document.getElementById('confirmation-modal');
        this.confirmationTitle = document.getElementById('confirmation-title');
        this.confirmationMessage = document.getElementById('confirmation-message');
        this.confirmActionBtn = document.getElementById('confirm-action');
        this.cancelActionBtn = document.getElementById('cancel-action');
        
    // Results Modal
        this.resultsModal = document.getElementById('results-modal');
        this.resultsText = document.getElementById('results-text');
    }

    // Event Listeners Setup
    setupEventListeners() {
    // Start Screen Listeners
        this.addSafeEventListener(this.singleplayerBtn, 'click', () => {
            console.log('Singleplayer button clicked');
            this.startSingleplayerGame();
        });
        
        this.addSafeEventListener(this.multiplayerBtn, 'click', () => {
            console.log('Multiplayer button clicked');
            this.showMultiplayerModes();
        });
        
        this.addSafeEventListener(this.helpBtn, 'click', () => {
            console.log('Help button clicked');
            this.showHelpScreen();
        });
		
        const closeResultsBtn = document.getElementById('close-results');
        if (closeResultsBtn) {
            this.addSafeEventListener(closeResultsBtn, 'click', () => {
                if (this.resultsModal) {
                    this.resultsModal.classList.add('hidden');
                    this.resultsModal.style.display = 'none';
                }
            });
        }

    // Multiplayer Mode Listeners
        Object.values(this.multiplayerModes).forEach(btn => {
            this.addSafeEventListener(btn, 'click', (e) => this.handleMultiplayerModeSelection(e));
        });

    // Help Screen Listener
        this.addSafeEventListener(this.closeHelpBtn, 'click', () => this.returnToStartScreen());

    // Game Board Listeners
        this.addSafeEventListener(this.rollDiceButton, 'click', () => this.rollDice());
        this.addSafeEventListener(this.player1Grid, 'click', (e) => this.markNumber(e, 1));
        this.addSafeEventListener(this.player2Grid, 'click', (e) => this.markNumber(e, 2));

    // In-Game Control Listeners
        this.addSafeEventListener(this.restartGameBtn, 'click', () => this.showConfirmationModal(
            'Restart Game', 
            'Are you sure you want to restart the game?', 
            () => this.resetGame()
        ));

        this.addSafeEventListener(this.returnToMenuBtn, 'click', () => this.showConfirmationModal(
            'Return to Menu', 
            'Are you sure you want to return to the main menu?', 
            () => this.returnToStartScreen()
        ));

    // Confirmation Modal Listeners
        this.addSafeEventListener(this.confirmActionBtn, 'click', () => this.executeConfirmedAction());
        this.addSafeEventListener(this.cancelActionBtn, 'click', () => this.closeConfirmationModal());
    }

    // Safe Event Listener Wrapper
    addSafeEventListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.error(`Cannot add ${event} listener to undefined element`);
        }
    }

    // Background Bubble Creation
    createBackgroundBubbles() {
        const backgroundBubbles = document.querySelector('.background-bubbles');
        if (!backgroundBubbles) {
            console.error('Background bubbles container not found');
            return;
        }
        
    // Clear existing bubbles to prevent duplication
        backgroundBubbles.innerHTML = '';
        
        const bubbleCount = 15;

        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
    // Randomize bubble properties
            const size = Math.random() * 100 + 50; // 50-150px
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.top = `${Math.random() * 100}%`;
            
    // Add randomized animation delay and duration
            bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
            bubble.style.animationDelay = `${Math.random() * -15}s`;

            backgroundBubbles.appendChild(bubble);
        }
    }

    // Screen Switching
    switchScreen(fromScreen, toScreen) {
        if (fromScreen && toScreen) {
            fromScreen.classList.remove('active');
            toScreen.classList.add('active');
        } else {
            console.error('Invalid screen switching attempt');
        }
    }

    /* Singleplayer Iter. 1
    startSingleplayerGame() {
        this.gameMode = 'singleplayer';
        this.switchScreen(this.screens.start, this.screens.gameBoard);
        this.gameModeDisplay.textContent = 'Singleplayer Mode';
        this.resetGame();
    }
	*/
	// Singleplayer Iter. 2
	startSingleplayerGame() {
		this.gameMode = 'singleplayer';
		this.switchScreen(this.screens.start, this.screens.gameBoard);
		this.gameModeDisplay.textContent = 'Singleplayer Mode';
    
    // ADD: Disable or hide Player 2 elements
		this.player2Grid.style.display = 'none';
		document.querySelector('.player2 h2').style.display = 'none';
		document.querySelector('.player2 .player-score').style.display = 'none';
    
		this.resetGame();
	}
    showMultiplayerModes() {
        this.switchScreen(this.screens.start, this.screens.multiplayer);
    }

    handleMultiplayerModeSelection(e) {
        const buttonId = e.target.id;

        switch(buttonId) {
            case 'mode-1round':
                this.startMultiplayerGame('single');
                break;
            case 'mode-3rounds':
                this.startMultiplayerGame('three');
                break;
            case 'mode-5rounds':
                this.startMultiplayerGame('five');
                break;
            case 'mode-unlimited':
                this.startMultiplayerGame('unlimited');
                break;
            case 'return-to-start':
                this.returnToStartScreen();
                break;
        }
    }

    startMultiplayerGame(mode) {
        this.gameMode = 'multiplayer';
        this.gameModeDisplay.textContent = `Multiplayer - ${mode.charAt(0).toUpperCase() + mode.slice(1)} Rounds`;
        this.switchScreen(this.screens.multiplayer, this.screens.gameBoard);
        this.resetGame();
    }

    showHelpScreen() {
        this.switchScreen(this.screens.start, this.screens.help);
    }

	returnToStartScreen() {
    // Explicitly check which screen is currently active and switch back to start
        const activeScreens = [
            this.screens.multiplayer,
            this.screens.help,
            this.screens.gameBoard
        ];

        const currentActiveScreen = activeScreens.find(screen => screen.classList.contains('active'));

        if (currentActiveScreen) {
            this.switchScreen(currentActiveScreen, this.screens.start);
        } else {
            console.error('No active screen found');
        }
    }

    // Confirmation Modal Methods
    showConfirmationModal(title, message, action) {
		this.confirmationTitle.textContent = title;
		this.confirmationMessage.textContent = message;
		this.pendingAction = action;
    
		this.confirmationModal.classList.remove('hidden');
		this.confirmationModal.style.display = 'block';
	}

    closeConfirmationModal() {
		this.confirmationModal.classList.add('hidden');
		this.confirmationModal.style.display = 'none';
	}

    executeConfirmedAction() {
        if (this.pendingAction) {
            this.pendingAction();
            this.pendingAction = null;
        }
        this.closeConfirmationModal();
    }

    /* Dice Rolling Method Iter. 1
    rollDice() {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        
        // Update dice display
        this.dice1.textContent = die1;
        this.dice2.textContent = die2;
        
        // Check for doubles
        this.handleDoubles(die1, die2);
        
        return { die1, die2 };
    }
	*/
	
	/* Dice Rolling Method Iter. 2 WORKING
	rollDice() {
    // Check if any numbers can be marked
		const currentPlayerGrid = this.gameMode === 'singleplayer' 
			? this.player1Grid
			: this.currentPlayer === 1 
				? this.player1Grid 
				: this.player2Grid;

		const availableNumbers = Array.from(currentPlayerGrid.querySelectorAll('.number:not(.marked)'));
    
		const die1 = Math.floor(Math.random() * 6) + 1;
		const die2 = Math.floor(Math.random() * 6) + 1;
    
    // Update dice display
		this.dice1.textContent = die1;
		this.dice2.textContent = die2;
    
    // Check for doubles
		this.handleDoubles(die1, die2);
    
    // Find valid numbers that can be marked
		const validNumbers = availableNumbers.filter(el => {
			const num = parseInt(el.dataset.number);
			return num === die1 || num === die2 || num === (die1 + die2);
		});
    
    // Disable roll button only if no valid numbers exist
		this.rollDiceButton.disabled = validNumbers.length === 0;
    
		return { die1, die2 };
	}
	*/

	// Dice Rolling Method Iter. 3
    rollDice() {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const diceSum = die1 + die2;

    // Update dice display
        this.dice1.textContent = die1;
        this.dice2.textContent = die2;
        
    // Robust dice sum update
        if (this.diceSumElement) {
            this.diceSumElement.textContent = diceSum;
        } else {
            console.error('Cannot update dice sum - element not found');
        }

    // Check for doubles
        if (die1 === die2) {
            console.log('Doubles rolled!');
        }

    // Only apply game-over logic in singleplayer mode
        if (this.gameMode === 'singleplayer') {
            const currentPlayerGrid = this.player1Grid;
            const availableNumbers = Array.from(currentPlayerGrid.querySelectorAll('.number:not(.marked)'));
            
    // Find valid numbers that can be marked
            const validNumbers = availableNumbers.filter(el => {
                const num = parseInt(el.dataset.number);
                return num === die1 || num === die2 || num === diceSum;
            });
            
    // Check for game over condition
            if (validNumbers.length === 0) {
                this.showGameOverModal();
                return { die1, die2, diceSum, gameOver: true };
            }
            
    // Disable roll button only if no valid numbers exist
            this.rollDiceButton.disabled = validNumbers.length === 0;
        }
        
        return { die1, die2, diceSum };
    }
	
	// Gameover modal
    showGameOverModal() {
    // Calculate the player's current score
        const player1Score = Array.from(this.player1Numbers).reduce((a, b) => a + b, 0);
        
    // Update results modal content
        if (this.resultsModal) {
            this.resultsText.innerHTML = `
                <h2>Game Over</h2>
                <p>No valid moves remaining!</p>
                <p>Your Score: ${player1Score}</p>
            `;
            
    // Make sure the results modal is visible
            this.resultsModal.classList.remove('hidden');
            this.resultsModal.style.display = 'block';
        }

    // Disable roll dice button
        this.rollDiceButton.disabled = true;
    }

    /* Number Marking Method Iter. 1
    markNumber(event, player) {
        const numberElement = event.target.closest('.number');
        if (!numberElement || numberElement.classList.contains('marked')) return;

        const number = parseInt(numberElement.dataset.number);
        const { die1, die2 } = this.getCurrentDiceRoll();
        const currentNumberSet = player === 1 ? this.player1Numbers : this.player2Numbers;

        // Check if the number can be marked
        if (
            number === die1 || 
            number === die2 || 
            number === (die1 + die2)
        ) {
            numberElement.classList.add('marked');
            numberElement.style.pointerEvents = 'none';
            currentNumberSet.add(number);
            
            // Update score
            this.updateScore(player);
            
            // Check for win condition
            if (this.checkWinCondition(player)) {
                this.endRound(player);
            } else {
                // Switch players
                this.currentPlayer = player === 1 ? 2 : 1;
            }
        }
    }
	*/

	// Number Marking Method Iter. 2
	markNumber(event, player) {
    // Prevent marking in multiplayer if not current player's turn
		if (this.gameMode === 'multiplayer' && this.currentPlayer !== player) return;

			const numberElement = event.target.closest('.number');
		if (!numberElement || numberElement.classList.contains('marked')) return;

			const number = parseInt(numberElement.dataset.number);
			const { die1, die2 } = this.getCurrentDiceRoll();

    // Check if the number can be marked
		if (
			number === die1 || 
			number === die2 || 
			number === (die1 + die2)
		) {
			numberElement.classList.add('marked');
			numberElement.style.pointerEvents = 'none';
        
			const currentNumberSet = player === 1 ? this.player1Numbers : this.player2Numbers;
			currentNumberSet.add(number);
        
    // Update score
			this.updateScore(player);
        
    // Re-enable roll button
			this.rollDiceButton.disabled = false;
        
    // Check for win condition
			if (this.checkWinCondition(player)) {
				this.endRound(player);
			} else if (this.gameMode === 'multiplayer') {
    // Switch players in multiplayer mode
				this.currentPlayer = player === 1 ? 2 : 1;
			}
		}
	}
	
	/* Number Marking Method Iter. 3
	markNumber(event, player) {
    // Prevent marking in multiplayer if not current player's turn
		if (this.gameMode === 'multiplayer' && this.currentPlayer !== player) return;

			const numberElement = event.target.closest('.number');
		if (!numberElement || numberElement.classList.contains('marked')) return;

			const number = parseInt(numberElement.dataset.number);
			const { die1, die2 } = this.getCurrentDiceRoll();

    // Check if the number can be marked
		if (
			number === die1 || 
			number === die2 || 
			number === (die1 + die2)
		) {
			numberElement.classList.add('marked');
			numberElement.style.pointerEvents = 'none';
        
			const currentNumberSet = player === 1 ? this.player1Numbers : this.player2Numbers;
			currentNumberSet.add(number);
        
    // Update score
			this.updateScore(player);
        
    // MODIFICATION: Disable roll dice button in singleplayer
    // This forces the player to re-roll after marking a number
			if (this.gameMode === 'singleplayer') {
				this.rollDiceButton.disabled = true;
			}
        
    // Check for win condition
			if (this.checkWinCondition(player)) {
				this.endRound(player);
			} else if (this.gameMode === 'multiplayer') {
    // Switch players in multiplayer mode
				this.currentPlayer = player === 1 ? 2 : 1;
			}
		}
	}
	*/
	
	/* Number Marking Method Iter. 4
	markNumber(event, player) {
    // Prevent marking in multiplayer if not current player's turn
		if (this.gameMode === 'multiplayer' && this.currentPlayer !== player) return;

			const numberElement = event.target.closest('.number');
		if (!numberElement || numberElement.classList.contains('marked')) return;

			const number = parseInt(numberElement.dataset.number);
			const { die1, die2 } = this.getCurrentDiceRoll();

    // Check if the number can be marked
		if (
			number === die1 || 
			number === die2 || 
			number === (die1 + die2)
		) {
			numberElement.classList.add('marked');
			numberElement.style.pointerEvents = 'none';
        
			const currentNumberSet = player === 1 ? this.player1Numbers : this.player2Numbers;
			currentNumberSet.add(number);
        
    // Update score
			this.updateScore(player);
        
    // MODIFICATION: In singleplayer, disable roll button until next valid roll
			if (this.gameMode === 'singleplayer') {
				this.rollDiceButton.disabled = true;
			}
        
    // Check for win condition
			if (this.checkWinCondition(player)) {
				this.endRound(player);
			} else if (this.gameMode === 'multiplayer') {
    // Switch players in multiplayer mode
				this.currentPlayer = player === 1 ? 2 : 1;
			}
		}
	}
	*/
	
    // Utility Methods
    getCurrentDiceRoll() {
        return {
            die1: parseInt(this.dice1.textContent),
            die2: parseInt(this.dice2.textContent)
        };
    }

    updateScore(player) {
        const playerNumberSet = player === 1 ? this.player1Numbers : this.player2Numbers;
        const scoreElement = player === 1 ? this.player1ScoreElement : this.player2ScoreElement;
        
        const score = Array.from(playerNumberSet).reduce((a, b) => a + b, 0);
        scoreElement.textContent = score;
    }

    checkWinCondition(player) {
        const playerNumberSet = player === 1 ? this.player1Numbers : this.player2Numbers;
        return playerNumberSet.size === 12;
    }

    endRound(winningPlayer) {
        this.roundsPlayed++;
        
    // Calculate scores
        const player1Score = Array.from(this.player1Numbers).reduce((a, b) => a + b, 0);
        const player2Score = Array.from(this.player2Numbers).reduce((a, b) => a + b, 0);
        
    // Determine next steps based on game mode
        if (this.gameMode === 'single' || 
            (this.gameMode === 'three' && this.roundsPlayed === 3) ||
            (this.gameMode === 'five' && this.roundsPlayed === 5)) {
            this.showFinalResults(player1Score, player2Score);
        }
    }

    showFinalResults(player1Score, player2Score) {
    // Determine winner
        const winner = player1Score > player2Score ? 'Player 1' : 
                       player2Score > player1Score ? 'Player 2' : 'Tie';
        
    // Display results
        this.resultsText.innerHTML = `
            <p>Player 1 Score: ${player1Score}</p>
            <p>Player 2 Score: ${player2Score}</p>
            <p>Winner: ${winner}</p>
        `;
        
        this.resultsModal.classList.remove('hidden');
    }

    /* Game Reset Method Iter. 1
    resetGame() {
    // Reset game state
        this.currentPlayer = 1;
        this.roundsPlayed = 0;
        this.player1Numbers = new Set();
        this.player2Numbers = new Set();
        
    // Reset UI
        this.resetPlayerGrid(this.player1Grid);
        this.resetPlayerGrid(this.player2Grid);
        this.player1ScoreElement.textContent = '0';
        this.player2ScoreElement.textContent = '0';
        
    // Reset dice
        this.dice1.textContent = '1';
        this.dice2.textContent = '1';
        
    // Enable roll dice button
        this.rollDiceButton.disabled = false;
    }
	*/

	/* Game Reset Method Iter. 2 WORKING
	resetGame() {
    // Reset game state
		this.currentPlayer = 1;
		this.roundsPlayed = 0;
		this.player1Numbers = new Set();
		this.player2Numbers = new Set();
    
    // Reset UI
		this.resetPlayerGrid(this.player1Grid);
		this.resetPlayerGrid(this.player2Grid);
		this.player1ScoreElement.textContent = '0';
		this.player2ScoreElement.textContent = '0';
    
    // MODIFY: Reset dice to blank or initial state
		this.dice1.textContent = '';
		this.dice2.textContent = '';
    
    // MODIFY: Always enable roll dice button
		this.rollDiceButton.disabled = false;
    
    // Reset for singleplayer or multiplayer
		if (this.gameMode === 'singleplayer') {
			this.player2Grid.style.display = 'none';
			document.querySelector('.player2 h2').style.display = 'none';
			document.querySelector('.player2 .player-score').style.display = 'none';
		}
	}
	*/

	// Game Reset Method Iter. 3
    resetGame() {
    // Reset game state
        this.currentPlayer = 1;
        this.roundsPlayed = 0;
        this.player1Numbers = new Set();
        this.player2Numbers = new Set();
    
    // Reset UI
        this.resetPlayerGrid(this.player1Grid);
        this.resetPlayerGrid(this.player2Grid);
        this.player1ScoreElement.textContent = '0';
        this.player2ScoreElement.textContent = '0';
    
    // Reset dice and sum
        this.dice1.textContent = '';
        this.dice2.textContent = '';
        
    // Reset dice sum
        if (this.diceSumElement) {
            this.diceSumElement.textContent = '';
        }
    
    // Close results modal if it's open
        if (this.resultsModal) {
            this.resultsModal.classList.add('hidden');
            this.resultsModal.style.display = 'none';
        }
    
    // Always enable roll dice button
        this.rollDiceButton.disabled = false;
    
    // Reset for singleplayer mode
        if (this.gameMode === 'singleplayer') {
            this.player2Grid.style.display = 'none';
            document.querySelector('.player2 h2').style.display = 'none';
            document.querySelector('.player2 .player-score').style.display = 'none';
        }
    }

    resetPlayerGrid(grid) {
        const numbers = grid.querySelectorAll('.number');
        numbers.forEach(num => {
            num.classList.remove('marked');
            num.style.pointerEvents = 'auto';
        });
    }
}

	// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    try {
        const game = new DiceDuel();
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});