// Back End Functions for Blackjack Module

Meteor.methods({
  // add a card to player hand
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
  // increment room turn
  incrementTurn: function(room_id) {
    var room = Rooms.findOne({ room: room_id });
    var new_turn = room.turn + 1;
    
    // loop turns
    if (new_turn == room.players.length) {
      new_turn = 0;
    }

    // check if all players have game over
    if (!room.all_game_over) {
      while (room.game_over[new_turn]) {
        new_turn++;
        if (new_turn == room.players.length) {
          new_turn = 0;
        }
      }
    }

    Rooms.update(
      { room: room_id },
      { $set: { turn: new_turn } }
    );
  },
  // deal two cards to player
  deal: function(player_id, room_id) {
    var deck = Rooms.findOne({ room: room_id }).cards;
    Meteor.call('addCard', deck.pop(), player_id);
    Meteor.call('addCard', deck.pop(), player_id);

    Rooms.update(
      { room: room_id },
      { $set: { cards: deck } }
    );
  },
  // remove a card from deck and add to player hand
  hit: function(player_id, room_id) {
    var deck = Rooms.findOne({ room: room_id }).cards;
    Meteor.call('addCard', deck.pop(), player_id);

    Rooms.update(
      { room: room_id },
      { $set: { cards: deck } }
    );
  },
  // set player game over in room
  endGame: function(room_id, player_id) {
    var room = Rooms.findOne({ room: room_id });
    if (room) {
      var player_index = room.players.indexOf(player_id);
      var new_game_over = room.game_over;
      new_game_over[player_index] = true;
      var new_all_game_over = false;
      if (new_game_over.indexOf(false) == -1) {
        new_all_game_over = true;
      }
      Rooms.update(
        { room: room_id },
        { $set: { game_over: new_game_over, all_game_over: new_all_game_over } }
      );
    }
  },
  // reset player
  resetGame: function(player_id) {
    Players.update(
      { player: player_id },
      { $set: { cards: [], sum: 0, ace: false } }
    );
  }
});

// initialize hand on page load
Players = new Mongo.Collection('Players');
