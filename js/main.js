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
var dealerHand, playerHand, playerSum;

/*----- cached element references -----*/
var betEl = document.querySelector('#bet-amt span');
var bankrollEl = document.querySelector('.bankroll span')
var dealBtnEl = document.querySelector('.bet-controls .deal');
var playerCardsEl = document.querySelector('.player-cards');
var dealerCardsEl = document.querySelector('.dealer-cards');
var betControlsEl = document.querySelector('.bet-controls');
var gameControlsEl = document.querySelector('.game-controls');
var hitBtnEl = document.querySelector('.hit');


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


/*----- functions -----*/

function initialize() {
    handInProgress = false;
    betAmount = 0;
    bankroll = 1000;
    render();
};
function render() {
    betEl.textContent = betAmount;
    bankrollEl.textContent = bankroll;
    renderHands();
    betControlsEl.style.visibility = handInProgress ? 'hidden' : 'visible';
    gameControlsEl.style.visibility = handInProgress ? 'visible' : 'hidden';
    betAmount === 0 ? dealBtnEl.setAttribute('disabled', 'disabled') : dealBtnEl.removeAttribute('disabled');
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

function handleDeal() {
    var tempDeck = masterDeck.slice();
    shuffledDeck = [];
    while (tempDeck.length) {
        var rndIdx = Math.floor(Math.random() * tempDeck.length);
        shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    handInProgress = true;
    playerHand = shuffledDeck.splice(0, 2);
    dealerHand = shuffledDeck.splice(0, 2);
    // playerHand = []
    // dealerHand = []
    // var playerSum = computeHand(playerHand);
    // document.querySelector('.playerSum').innerHTML = playerSum;
    // var dealerSum = computeHand(dealerHand);
    // document.querySelector('.dealerSum').innerHTML = dealerSum;
    render();
};

function handleHit() {
    deal(playerHand, 1);
    playerSum =
        computeHand(playerHand);
    if (playerSum > 21) {
        winner = 'D';
        handInProgress = false;
        bet = 0;
    }
    render();
};

function deal(hand, numCards) {
    hand = hand.push(...shuffledDeck.splice(0, numCards));
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


//hand and get the number of cards general purpose function deal 
//and took in hand && num of cards. 
//


// function computeHand(){
//function computeHand(hand){
//Loop through cards in hand
//-Inside the loop add value of card to sum
//-If card is an Ace,Increase Ace Count
//While sum > 21 && Ace count.
//-Sum -= 10, reduce ace count -- 
//return sum 
// }


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



initialize();



