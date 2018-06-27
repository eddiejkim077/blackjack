/*----- constants -----*/
var suits = ['s', 'c', 'd', 'h'];
var ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
var masterDeck = buildMasterDeck();
var nameLookup = {
    'P': 'Player',
    'D': 'Dealer'
};

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

document.getElementById('inc-btn').addEventListener('click', function () {
    if (bankroll < 5) return;
    betAmount += 5;
    bankroll -= 5;
    render();
});

document.getElementById('dec-btn').addEventListener('click', function () {
    if (betAmount < 5) return;
    betAmount -= 5;
    bankroll += 5;
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
function checkBlackJack(){
    if (playerSum === 21 && dealerSum === 21){
        winner = 'T';
        betAmount = 0;
        handInProgress = false;
    } else if (playerSum === 21) {
        blackjack = 'P';
        bankroll  += ((bet * 1.5) + bet);
        betAmount = 0;
        handInProgress = false;
    } else if (dealerSum === 21) {
        blackjack = 'D';
        handInProgress = false;
        betAmount = 0;
    }
};
function buildMasterDeck() {
    var deck = [];
    suits.forEach(function (suit) {
        ranks.forEach(function (rank) {
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
}
function handleDeal() {
    shuffleDeck();
    handInProgress = true;
    winner = blackjack = null;
    playerHand = shuffledDeck.splice(0, 2);
    dealerHand = shuffledDeck.splice(0, 2);
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
};
function handleStand() {
    handInProgress = false;
    dealerPlay();
    playerSum = computeHand(playerHand);
    dealerSum = computeHand(dealerHand);
    if (playerSum === dealerSum) {
        winner = 'T';
        bankroll += betAmount;
    } else if (dealerSum > playerSum && dealerSum < 22) {
        winner = 'D';
    } else {
        winner = 'P';
        bankroll += betAmount * 2;
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
    var cardsHtml = playerHand.reduce(function (html, card) {
        return html + `<div class = "card ${card.face}"></div>`;
    }, '');
    playerCardsEl.innerHTML = cardsHtml;
    dealerCardsEl.innerHTML = '';
    //building the cards as a string of HTML
    cardsHtml = dealerHand.reduce(function (html, card, idx) {
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
            messageEl.style.color = 'purple';
        } else {
            messageEl.textContent = `${nameLookup[winner]} Wins!`;
            messageEl.style.color = winner === 'P' ? 'yellow' : 'maroon';
        } 
    } else {
        messageEl.textContent = '';
    }
};
initialize();

        //stand function correctly, 
