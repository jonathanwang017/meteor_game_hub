Meteor.methods({
  createRoom: function(room_id, game) {
    Rooms.update(
      { room: room_id }, 
      { room: room_id, game: game, players: [], game_over: [], active: false }, 
      { upsert: true }
    );
  },
  addPlayer: function(room_id, player_id) {
    Rooms.update(
      { room: room_id },
      { $push: { players: player_id, game_over: false } }
    );
  },
  startRoom: function(room_id) {
    Meteor.call('resetDeck', room_id);
    Rooms.update(
      { room: room_id }, 
      { $set: { active: true, turn: 0 } }
    );
  },
  createPlayer: function(player_id, room_id, player_name) {
    Players.update(
      { player: player_id },
      { player: player_id, room: room_id, name: player_name },
      { upsert: true }
    );
  }
});