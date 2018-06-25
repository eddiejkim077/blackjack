// /*----- constants -----*/
var suits = ['s', 'c', 'd', 'h'];
var ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

var masterDeck = buildMasterDeck();

// /*----- app's state (variables) -----*/
var shuffledDeck, playerHand, dealerHand;
var bankroll, bet;
var handInProgress;

// /*----- cached element references -----*/
var playerCardsEl = document.querySelector('#player-section div.cards');
var playerScoreEl = document.querySelector('#player-section h3');
var bankrollEl = document.querySelector('#player-section p');
var dealerCardsEl = document.querySelector('#dealer-section div.cards');
var dealerScoreEl = document.querySelector('#dealer-section h3');

var betControlEl = document.querySelector('#bet-deal-controls');
var dealBtnEl = document.querySelector('.deal');
var hitControlEl = document.querySelector('#hit-stand-controls');

// /*----- event listeners -----*/
dealBtnEl.addEventListener('click', handleDeal);



// /*----- functions -----*/
function initialize() {
  handInProgress = false;
  bankroll = 1000;
  bet = 0;
  render();
}

function render() {
  bankrollEl.textContent = bankroll;
  betControlEl.style.visibility = handInProgress ? 'hidden' : 'visibile';
  bet === 0 ? dealBtnEl.setAttribute('disabled', 'disabled') : dealBtnEl.removeAttribute('disabled');
  hitControlEl.style.visibility = handInProgress ? 'visible' : 'hidden';
  renderHands();
}

function handleDeal() {
  // set shuffle deck
  handInProgress = true;
  playerHand = masterDeck.splice(0, 2);
  dealerHand = masterDeck.splice(0, 2);
  render();
}

function renderHands() {
  if (!playerHand) return;
  playerCardsEl.innerHTML = '';
  // Let's build the cards as a string of HTML
  var cardsHtml = playerHand.reduce(function (html, card) {
    return html + `<div class="card ${card.face}"></div>`;
  }, '');
  playerCardsEl.innerHTML = cardsHtml;
  dealerCardsEl.innerHTML = '';
  // Let's build the cards as a string of HTML
  var cardsHtml = dealerHand.reduce(function (html, card, idx) {
    var cardClass = handInProgress && idx === 0 ? 'back-blue' : card.face;
    return html + `<div class="card ${cardClass}"></div>`;
  }, '');
  dealerCardsEl.innerHTML = cardsHtml;
}

function buildMasterDeck() {
  var deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        // the 'face' property maps to the CSS classes for cards
        face: `${suit}${rank}`,
        // the 'value' property is set for blackjack, not war
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

initialize();