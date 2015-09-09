// Back End Functions for Poker Module

Meteor.methods({
  addCard: function(card) {
    var card_value = card.number;
    if (card_value > 10) {
      card_value = 10;
    }

    var contains_ace = Hand.findOne({ _id: 1 }).ace;

    Hand.update(
      { _id: 1 }, 
      {
        $push: { cards: card }, 
        $inc: { sum: card_value },
        $set: { ace: card.number == 1 || contains_ace }
      },
      { upsert: true }
    );
  },
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
  }
});

// initialize hand on page load
Hand = new Mongo.Collection('Hand');
Meteor.call('resetGame');
