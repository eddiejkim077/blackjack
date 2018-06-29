/*----- constants -----*/
var suits = ['s', 'c', 'd', 'h'];
var ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
var masterDeck = buildMasterDeck();
var nameLookup = {
	'P': 'Player',
	'D': 'Dealer'
};
var chip = new Audio('https://freesound.org/data/previews/201/201805_3745836-lq.mp3');
var hitSound = new Audio('https://freesound.org/data/previews/96/96127_1554918-lq.mp3');
var loseSound = new Audio('https://freesound.org/data/previews/96/96129_1554918-lq.mp3');
var blackjSound = new Audio('https://freesound.org/data/previews/341/341984_6101353-lq.mp3');
var winSound = new Audio('https://freesound.org/data/previews/140/140382_2289019-lq.mp3');
var dblackjSound = new Audio('https://freesound.org/data/previews/253/253174_4404552-lq.mp3');
var pushSound = new Audio('https://freesound.org/data/previews/240/240776_4107740-lq.mp3');
/*----- app's state (variables) -----*/
var bankroll, betAmount;
var handInProgress, shuffledDeck, blackjack, winner;
var dealerHand, dealerSum, playerHand, playerSum;
/*----- cached element references -----*/
var betEl = document.querySelector('#bet-amt span');
var bankrollEl = document.querySelector('.bankroll span')
var dealBtnEl = document.querySelector('.bet-controls .deal');
var playerCardsEl = document.querySelector('.player-cards');
var dealerCardsEl = document.querySelector('.dealer-cards');
var betControlsEl = document.querySelector('.bet-controls');
var gameControlsEl = document.querySelector('.game-controls');
var hitBtnEl = document.querySelector('.hit');
var standBtnEl = document.querySelector('.stand');
var messageEl = document.getElementById('message');
/*----- event listeners -----*/
document.getElementById('inc-btn').addEventListener('click', function() {
	if (bankroll < 10) return;
	betAmount += 10;
	bankroll -= 10;
	chip.play();
	render();
});
document.getElementById('dec-btn').addEventListener('click', function() {
	if (betAmount < 10) return;
	betAmount -= 10;
	bankroll += 10;
	chip.play();
	render();
});
dealBtnEl.addEventListener('click', handleDeal);
hitBtnEl.addEventListener('click', handleHit);
standBtnEl.addEventListener('click', handleStand);
/*----- functions -----*/
function initialize() {
	handInProgress = false;
	winner = null;
	betAmount = 0;
	bankroll = 1000;
	render();
};

function handleUpdateScore(diff, disabled) {
	betAmount += diff;
	if (betAmount < 0) {
		betAmount = 0
	}
	if (disabled) {
		document.querySelector('.deal').disabled = false;
	}
	render();
};

function checkBlackJack() {
	if (playerSum === 21 && dealerSum === 21) {
		winner = 'T';
		betAmount = 0;
		handInProgress = false;
		pushSound.play();
	} else if (playerSum === 21) {
		blackjack = 'P';
		bankroll += ((betAmount * 1.5) + betAmount);
		betAmount = 0;
		handInProgress = false;
		blackjSound.play();
		messageEl.className = "blink_me";
	} else if (dealerSum === 21) {
		blackjack = 'D';
		handInProgress = false;
		betAmount = 0;
		dblackjSound.play();
	}
};

function buildMasterDeck() {
	var deck = [];
	suits.forEach(function(suit) {
		ranks.forEach(function(rank) {
			deck.push({
				face: `${suit}${rank}`,
				value: Number(rank) || (rank === 'A' ? 11 : 10)
			});
		});
	});
	return deck;
};

function shuffleDeck() {
	var tempDeck = masterDeck.slice();
	shuffledDeck = [];
	while (tempDeck.length) {
		var rndIdx = Math.floor(Math.random() * tempDeck.length);
		shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
	}
};

function handleDeal() {
	shuffleDeck();
	handInProgress = true;
	winner = blackjack = null;
	playerHand = [];
	dealerHand = [];
	deal(playerHand, 2);
	deal(dealerHand, 2);
	playerSum = computeHand(playerHand);
	dealerSum = computeHand(dealerHand);
	checkBlackJack();
	render();
};

function handleHit() {
	deal(playerHand, 1);
	playerSum = computeHand(playerHand);
	if (playerSum > 21) {
		winner = 'D';
		handInProgress = false;
		betAmount = 0;
	}
	render();
	hitSound.play();
};

function handleStand() {
	handInProgress = false;
	dealerPlay();
	playerSum = computeHand(playerHand);
	dealerSum = computeHand(dealerHand);
	if (playerSum === dealerSum) {
		winner = 'T';
		bankroll += betAmount;
		pushSound.play();
	} else if (dealerSum > playerSum && dealerSum < 22) {
		winner = 'D';
		loseSound.play();
	} else {
		winner = 'P';
		bankroll += betAmount * 2;
		winSound.play();
	}
	betAmount = 0;
	render();
};

function dealerPlay() {
	while (computeHand(dealerHand) < 17) {
		deal(dealerHand, 1);
	}
};

function deal(hand, numCards) {
	hand.push(...shuffledDeck.splice(0, numCards));
};

function computeHand(hand) {
	var sum = 0;
	var aces = 0;
	for (var i = 0; i < hand.length; i++) {
		var card = hand[i];
		var ace = card.face.split('').includes('A')
		if (ace) {
			aces++;
		}
		sum += card.value;
	}
	while (sum > 21 && aces) {
		sum -= 10;
		aces--;
	}
	return sum;
};

function renderHands() {
	if (!playerHand) {
		return;
	}
	playerCardsEl.innerHTML = '';
	//building cards as string of HTML
	var cardsHtml = playerHand.reduce(function(html, card) {
		return html + `<div class = "card ${card.face}"></div>`;
	}, '');
	playerCardsEl.innerHTML = cardsHtml;
	dealerCardsEl.innerHTML = '';
	//building the cards as a string of HTML
	cardsHtml = dealerHand.reduce(function(html, card, idx) {
		var cardClass = handInProgress && idx === 0 ? 'back-blue' : card.face;
		return html + `<div class = "card ${cardClass}"></div>`;
	}, '');
	dealerCardsEl.innerHTML = cardsHtml;
};

function render() {
	betEl.textContent = betAmount;
	bankrollEl.textContent = bankroll;
	renderHands();
	betControlsEl.style.visibility = handInProgress ? 'hidden' : 'visible';
	gameControlsEl.style.visibility = handInProgress ? 'visible' : 'hidden';
	betAmount === 0 ? dealBtnEl.setAttribute('disabled', 'disabled') : dealBtnEl.removeAttribute('disabled');
	if (blackjack) {
		messageEl.textContent = `${nameLookup[blackjack]} Has Blackjack!`;
		messageEl.style.color = 'gold';
	} else if (winner) {
		if (winner === 'T') {
			messageEl.textContent = `Push!`;
			messageEl.style.color = 'white';
		} else {
			messageEl.textContent = `${nameLookup[winner]} Wins!`;
			messageEl.style.color = winner === 'P' ? 'gold' : 'red';
		}
	} else {
		messageEl.textContent = '';
		messageEl.className = '';
	}
};
initialize();