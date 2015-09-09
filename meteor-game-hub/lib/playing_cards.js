// Back End Functions for Playing Cards

Meteor.methods({
  shuffle: function() {
    var deck = Deck.findOne().cards;
    var counter = deck.length, temp, index;
    while (counter > 0) {
      index = Math.floor(Math.random() * counter);
      counter--;
      temp = deck[counter];
      deck[counter] = deck[index];
      deck[index] = temp;
    }

    Deck.update(
      { _id: 1 },
      { cards: deck }
    );
  },
  resetDeck: function() {
    var cards = [];
    var suits = ['D', 'C', 'H', 'S'];
    for (s = 0; s < 4; s++) {
      for (n = 1; n < 14; n++) {
        cards.push({ suit: suits[s], number: n });
      }
    }
    Deck.update(
      { _id: 1 }, 
      { cards: cards }, 
      { upsert: true }
    );

    Meteor.call('shuffle');
  }
});

// initialize deck on page load
Deck = new Mongo.Collection('Deck');
Meteor.call('resetDeck');