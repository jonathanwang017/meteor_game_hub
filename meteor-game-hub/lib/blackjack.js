// Back End Functions for Blackjack Module

Meteor.methods({
  // add a card to player hand
  addCard: function(card, player_id) {
    var card_value = card.number;
    if (card_value > 10) {
      card_value = 10;
    }

    var player = Players.findOne({ player: player_id });
    var contains_ace = card.number == 1 || player.ace;
    var new_sum = card_value;
    if (player.sum) {
      new_sum += player.sum;
    }

    // calculate score with ace as 1 or 11
    var new_score = new_sum;
    if (contains_ace && (new_sum + 10 <= 21)) {
      new_score += 10;
    }

    Players.update(
      { player: player_id }, 
      {
        $push: { cards: card }, 
        $set: { ace: contains_ace, sum: new_sum, score: new_score }
      }
    );
  },
  // increment room turn
  incrementTurn: function(room_id) {
    var room = Rooms.findOne({ room: room_id });

    // check if all players have game over
    if (!room.all_game_over) {
      var new_turn = room.turn + 1;
    
      // loop turns
      if (new_turn == room.players.length) {
        new_turn = 0;
      }

      // find next player still in game
      while (room.game_over[new_turn]) {
        new_turn++;
        if (new_turn == room.players.length) {
          new_turn = 0;
        }
      }

      Rooms.update(
        { room: room_id },
        { $set: { turn: new_turn } }
      );
    }
  },
  // deal two cards to player
  deal: function(player_id, room_id) {
    var deck = Rooms.findOne({ room: room_id }).cards;
    Meteor.call('addCard', deck.pop(), player_id);
    Meteor.call('addCard', deck.pop(), player_id);

    Players.update(
      { player: player_id },
      { $inc: { chips: -1 } }
    );

    Rooms.update(
      { room: room_id },
      { 
        $set: { cards: deck },
        $inc: { pool: 1 }
      }
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
  // set winner in room
  findWinner: function(room_id) {
    // handle ties
    var room = Rooms.findOne({ room: room_id });
    if (room) {
      var pool = room.pool;
      var new_winner = null;
      var new_winner_name = 'None';
      var players = room.players;
      var high_score = 0;
      for (i = 0; i < players.length; i++) {
        var player_id = players[i];
        var player = Players.findOne({ player: player_id });
        var winner_cards = 21;
        if (player.score <= 21) {
          if (player.score > high_score && player.cards.length < winner_cards) {
            new_winner = player;
            high_score = player.score;
            winner_cards = player.cards.length;
          }
        }
      }

      // add pool to winner
      if (new_winner) {
        new_winner_name = new_winner.name;
        Players.update(
          { player: new_winner.player },
          { $inc: { chips: pool } }
        );
      }

      // set winner and reset pool
      Rooms.update(
        { room: room_id },
        { $set: { winner: new_winner_name, pool: 0 } }
      );
    }
  },
  // reset player
  resetGame: function(player_id) {
    Players.update(
      { player: player_id },
      { $set: { cards: [], sum: 0, ace: false, score: 0 } }
    );
  }
});

// initialize hand on page load
Players = new Mongo.Collection('Players');
