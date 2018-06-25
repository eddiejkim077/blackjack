/*----- constants -----*/
var suits = ['s', 'c', 'd', 'h'];
var ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
var masterDeck = buildMasterDeck();

/*----- app's state (variables) -----*/
var bankroll, betAmount;
var handInProgress, shuffledDeck;
var dealerHand, playerHand;

/*----- cached element references -----*/
var betEl = document.querySelector('#bet-amt span');
var bankrollEl = document.querySelector('.bankroll span')
var dealBtnEl = document.querySelector('.bet-controls .deal');
var playerCardsEl = document.querySelector('.player-cards');
var dealerCardsEl = document.querySelector('.dealer-cards');
var betControlsEl = document.querySelector('.bet-controls');
var gameControlsEl = document.querySelector('.game-controls');

/*----- event listeners -----*/
document.getElementById('dec-btn').addEventListener('click', function(){
    if (betAmount < 5) return;
    betAmount -= 5;
    bankroll += 5;
    render();
});
document.getElementById('inc-btn').addEventListener('click', function(){
    if (bankroll < 5) return;
    betAmount += 5;
    bankroll -= 5;
    render();
});

dealBtnEl.addEventListener('click', handleDeal);

/*----- functions -----*/
function initialize(){
    handInProgress = false;
    betAmount = 0;
    bankroll = 1000;
    render();
}
//responsible for transfering all state to the DOM.
function render(){
    betEl.textContent = betAmount;
    bankrollEl.textContent = bankroll;
    renderHands();
    betControlsEl.style.visibility = handInProgress ? 'hidden' : 'visible';
    gameControlsEl.style.visibility = handInProgress ? 'visible' : 'hidden';
    betAmount === 0 ? dealBtnEl.setAttribute('disabled', 'disabled') : dealBtnEl.removeAttribute('disabled');
}

function handleUpdateScore(diff, disabled){
    console.log(betAmount);
    betAmount += diff;
    if (betAmount < 0){
        betAmount = 0
    }

    if (disabled) {
        document.querySelector('.deal').disabled = false; 
    }
    console.log('second', playerHand);
    render();
}
function handleDeal(){
    handInProgress = true; 
    playerHand = masterDeck.splice(0,2);
    dealerHand = masterDeck.splice(0,2);
    render();
}

function renderHands(){
    if (!playerHand) {
        console.log('here')
        return;
    }
    playerCardsEl.innerHTML = '';
    //building cards as string of HTML
    var cardsHtml = playerHand.reduce(function(html,card){
        return html + `<div class = "card ${card.face}"></div>`;
    }, '');
    playerCardsEl.innerHTML = cardsHtml;
    dealerCardsEl.innerHTML = '';
    //building the cards as a string of HTML
    cardsHtml = dealerHand.reduce(function(html,card,idx){
        var cardClass = handInProgress && idx === 0 ?'back-blue' : card.face;
        return html + `<div class = "card ${cardClass}"></div>`;
    }, '');
    dealerCardsEl.innerHTML = cardsHtml;
}

function buildMasterDeck(){
    var deck = [];
    suits.forEach(function (suit){
        ranks.forEach(function(rank){
            deck.push({
                face: `${suit}${rank}`,
                value: Number(rank) || (rank === 'A' ? 11: 10)
            });
        });
    });
    return deck; 
}

function shuffleDeck(){
    
}

//function computeHand(hand){
    //Loop through cards in hand
        //-Inside the loop add value of card to sum
        //-If card is an Ace,Increase Ace Count
    //While sum > 21 && Ace count.
        //-Sum -= 10, reduce ace count -- 
    //return sum 
// }

initialize();



