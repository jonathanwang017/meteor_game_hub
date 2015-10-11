// Back End Functions for Framework

Meteor.methods({
  // create empty room with game
  createRoom: function(room_id, game) {
    Rooms.update(
      { room: room_id }, 
      { room: room_id, game: game, players: [], active: false }, 
      { upsert: true }
    );
  },
  // create a player
  createPlayer: function(player_id, room_id, player_name) {
    Players.update(
      { player: player_id },
      { player: player_id, room: room_id, name: player_name, eliminated: false, chips: 5 },
      { upsert: true }
    );
  },
  // add player to room
  addPlayer: function(room_id, player_id) {
    Rooms.update(
      { room: room_id },
      { $push: { players: player_id, game_over: false } }
    );
  },
  // set room to active
  startRoom: function(room_id) {
    Meteor.call('resetDeck', room_id);
    Rooms.update(
      { room: room_id }, 
      { $set: { active: true, turn: 0, game_over: [], all_game_over: false, winner: 'None', pool: 0 } }
    );
  },
  // reset hands for all players in room
  resetPlayers: function(room_id) {
    var room = Rooms.findOne({ room: room_id });
    if (room) {
      var players = room.players;
      for (i = 0; i < players.length; i++) {
        var player = Players.findOne({ player: players[i] });
        if (player.chips <= 0) {
          Meteor.call('removePlayer', room_id, players[i]);
        } else {
          Meteor.call('resetGame', players[i]);
        }
      }
    }
  },
  // remove player from room and set to eliminated
  removePlayer: function(room_id, player_id) {
    var room = Rooms.findOne({ room: room_id });
    if (room) {
      var new_players = room.players;
      var new_game_over = room.game_over;
      var player_index = new_players.indexOf(player_id);
      new_players.splice(player_index, 1);
      new_game_over.splice(player_index, 1);

      Rooms.update(
        { room: room_id },
        { $set: { players: new_players, game_over: new_game_over } }
      );
    }

    Players.update(
      { player: player_id },
      { $set: { eliminated: true } }
    );

  },
  // reset all game overs and redeal to all players
  resetRoom: function(room_id) {
    Meteor.call('resetDeck', room_id);
    var room = Rooms.findOne({ room: room_id });
    if (room) {
      var players = room.players;
      var gameOver = []
      for (i = 0; i < players.length; i++) {
        gameOver.push(false);
      }
      Rooms.update(
        { room: room_id },
        { $set: { game_over: gameOver, turn: 0, all_game_over: false, winner: 'None' } }
      );
      // move to blackjack module
      for (i = 0; i < players.length; i++) {
        Meteor.call('deal', players[i], room_id);
      }
    }
  },
  // remove room and players from database
  clearRoom: function(room_id) {
    var room = Rooms.findOne({ room: room_id });
    if (room) {
      var players = room.players;
      for (i = 0; i < players.length; i++) {
        Players.remove({ player: player_id });
      }
    }
    Rooms.remove({ room: room_id });
  }
});