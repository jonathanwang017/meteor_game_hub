// Back End Functions for Playing Cards

Meteor.methods({
  shuffle: function(room_id) {
    var deck = Rooms.findOne({ room: room_id }).cards;
    var counter = deck.length, temp, index;
    while (counter > 0) {
      index = Math.floor(Math.random() * counter);
      counter--;
      temp = deck[counter];
      deck[counter] = deck[index];
      deck[index] = temp;
    }

    Rooms.update(
      { room: room_id },
      { $set: { cards: deck } }
    );
  },
  resetDeck: function(room_id) {
    var cards = [];
    var suits = ['D', 'C', 'H', 'S'];
    for (s = 0; s < 4; s++) {
      for (n = 1; n < 14; n++) {
        cards.push({ suit: suits[s], number: n });
      }
    }

    Rooms.update(
      { room: room_id }, 
      { $set: { cards: cards } }
    );

    Meteor.call('shuffle', room_id);
  }
});

// Deck = new Mongo.Collection('Deck');
Rooms = new Mongo.Collection('Rooms')
