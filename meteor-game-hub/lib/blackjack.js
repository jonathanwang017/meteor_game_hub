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
  addCard: function(card) {
    var card_value = card.number;
    if (card_value > 10) {
      card_value = 10;
    }

    Hand.update(
      { _id: 1 }, 
      {
        $push: { cards: card }, 
        $inc: { sum: card_value },
        $set: { ace: card.number == 1 }
      },
      { upsert: true }
    );
  },
  // consider updating deck in addCard
  deal: function() {
    var deck = Deck.findOne().cards;
    Meteor.call('addCard', deck.pop());
    Meteor.call('addCard', deck.pop());

    Deck.update(
      { _id: 1 },
      { cards: deck }
    );
  },
  hit: function() {
    var deck = Deck.findOne().cards;
    Meteor.call('addCard', deck.pop());

    Deck.update(
      { _id: 1 },
      { cards: deck }
    );
  },
  resetGame: function() {
    Hand.update(
      { _id: 1 },
      { cards: [], sum: 0, ace: false },
      { upsert: true }
    );

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

Hand = new Mongo.Collection('Hand');
Deck = new Mongo.Collection('Deck');
Meteor.call('resetGame');
