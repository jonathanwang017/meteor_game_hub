// Back End Functions for Blackjack Module

Meteor.methods({
  addCard: function(card, player_id) {
    var card_value = card.number;
    if (card_value > 10) {
      card_value = 10;
    }

    var contains_ace = Players.findOne({ player: player_id }).ace;

    Players.update(
      { player: player_id }, 
      {
        $push: { cards: card }, 
        $inc: { sum: card_value },
        $set: { ace: card.number == 1 || contains_ace }
      }
    );
  },
  incrementTurn: function(room_id) {
    var room = Rooms.findOne({ room: room_id });
    var newTurn = room.turn + 1;
    if (newTurn == room.players.length) {
      newTurn = 0;
    }

    Rooms.update(
      { room: room_id },
      { $set: { turn: newTurn } }
    );
  },
  deal: function(player_id, room_id) {
    var deck = Rooms.findOne({ room: room_id }).cards;
    Meteor.call('addCard', deck.pop(), player_id);
    Meteor.call('addCard', deck.pop(), player_id);

    Rooms.update(
      { room: room_id },
      { $set: { cards: deck } }
    );
  },
  hit: function(player_id, room_id) {
    var deck = Rooms.findOne({ room: room_id }).cards;
    Meteor.call('addCard', deck.pop(), player_id);

    Rooms.update(
      { room: room_id },
      { $set: { cards: deck } }
    );
  },
  endGame: function(room_id) {
    var room = Rooms.findOne({ room: room_id });
    if (room) {
      var turn = room.turn;
      var gameOver = room.game_over;
      gameOver[turn] = true;
      Rooms.update(
        { room: room_id },
        { $set: { game_over: gameOver } }
      );
    }
  },
  resetGame: function(player_id) {
    Players.update(
      { player: player_id },
      { $set: { cards: [], sum: 0, ace: false } }
    );
  }
});

// initialize hand on page load
Players = new Mongo.Collection('Players');
