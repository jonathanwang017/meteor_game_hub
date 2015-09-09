// ------------------------------------------------
// Framework Interaction
// ------------------------------------------------

// gets game status from framework
function retrieveState() {

}

// returns game status to framework
function returnState() {

}

// class representing a blackjack hand
// replace this with a database reference/request
function Hand() {
  this.cards = [];
  this.sum = 0;
  this.ace = false;
}


// ------------------------------------------------
// Class Functions
// ------------------------------------------------

Hand.prototype.toString = function() {
  return this.cards.toString();
}

// get number of cards in hand
Hand.prototype.length = function() {
  return this.cards.length;
}

// function to add a card to hand
Hand.prototype.addCard = function(card) {
  if (card.number == 1) {
    this.ace = true;
  }

  this.cards.push(card);
  var card_value = card.number;
  if (card_value > 10) {
    card_value = 10;
  }
  console.log(this.sum);
  this.sum += card_value;

  $('#card' + this.length()).attr('src', 'classic-cards/' + card.toString() + '.png');
  $('#card_score').html(getScore(this));
}


// ------------------------------------------------
// Game Functions
// ------------------------------------------------

// deal 2 cards to hand
function deal(deck, hand) {
  hand.addCard(deck.pop());
  hand.addCard(deck.pop());

  $('#deal_button').prop('disabled', true);
  $('#hit_button').prop('disabled', false);
  $('#stay_button').prop('disabled', false);
}

// get max score (ace as 1 or 11)
function getScore(hand) {
  var score = hand.sum;
  if (hand.ace && (hand.sum + 10 <= 21)) {
    score = hand.sum + 10;
  }
  return score;
}

// check for bust
function checkBust(hand) {
  if (getScore(hand) > 21) {
    console.log('Bust!');
    $('#hand_status').html('Bust!');
    endGame();
  }
}

// check if blackjack exists in hand
function checkBlackjack(hand) {
  if (getScore(hand) == 21) {
    console.log('Blackjack!');
    $('#hand_status').html('Blackjack!');
    endGame();
  }
}

// disable game buttons (ui)
function endGame() {
  $('#hit_button').prop('disabled', true);
  $('#stay_button').prop('disabled', true);
  $('#reset_button').prop('disabled', false);
}

// remove all cards from table (ui)
function clearCards(hand) {
  for (i = 1; i < hand.length() + 1; i++) {
    $('#card' + i).attr('src', '');
  }
}

// resets game (ui)
function resetGame() {
  $('#deal_button').prop('disabled', false);
  $('#reset_button').prop('disabled', true);
  $('#card_score').html('0');
  $('#hand_status').html('');
}


// ------------------------------------------------
// Game Loop
// ------------------------------------------------

// event listeners to run game
$(document).ready(function() {
  var deck = (new Deck()).cards;
  shuffle(deck);
  var hand = new Hand();
  
  $('#deal_button').click(function() {
    deal(deck, hand);
  });

  $('#hit_button').click(function() {
    hand.addCard(deck.pop());
    checkBust(hand);
    checkBlackjack(hand);
  });

  $('#stay_button').click(function() {
    console.log('Final score: ' + getScore(hand));
    endGame();
  });

  $('#reset_button').click(function() {
    clearCards(hand);

    deck = (new Deck()).cards;
    shuffle(deck);
    hand = new Hand();

    resetGame();    
  });
});
