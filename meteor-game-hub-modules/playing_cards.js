// class for a playing card
function Card(suit, number) {
  this.suit = suit;
  this.number = number;
}

Card.prototype.toString = function() {
  return this.suit + this.number;
}


// class for a deck of playing cards
function Deck() {
  this.cards = [];
  var suits = ['D', 'C', 'H', 'S'];
  for (s = 0; s < 4; s++) {
    for (n = 1; n < 14; n++) {
      this.cards.push(new Card(suits[s], n));
    }
  }
}

Deck.prototype.toString = function() {
  return this.cards.toString();
}

// in place deck shuffling
function shuffle(deck) {
  var counter = deck.length, temp, index;
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = deck[counter];
    deck[counter] = deck[index];
    deck[index] = temp;
  }
}