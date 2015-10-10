Template.body.helpers({
  // return if room is active
  gameStarted: function() {
    if (Session.get('room_id')) {
      var room = Rooms.findOne({ room: Session.get('room_id') });
      if (room) {
        return room.active;
      }
    }
    return false;
  },
  // return room id if in a room
  joinedRoom: function() {
    return Session.get('room_id');
  },
  // return role as host or player
  role: function() {
    return Session.get('role');
  },
  // return room game
  game: function() {
    return Session.get('game');
  },
  // return if host
  host: function() {
    return Session.get('role') == 'host';
  },
  // return if player
  player: function() {
    return Session.get('role') == 'player';
  },
  // return if spectator
  spectator: function() {
    return Session.get('role') == 'spectator';
  },
  // return if rendered or player turn for initial deal
  rendered: function() {
    var turn = false;
    var room_id = Session.get('room_id');
    if (room_id) {
      var room = Rooms.findOne({ room: room_id });
      if (room) {
        turn = room.players[room.turn] == Session.get('player_id');
      }
    }
    return Session.get('rendered') || turn;
  }
});