Template.body.helpers({
  gameStarted: function() {
    if (Session.get('room_id')) {
      var room = Rooms.findOne({ room: Session.get('room_id') });
      if (room) {
        return room.active;
      }
    }
    return false;
  },
  joinedRoom: function() {
    return Session.get('room_id');
  },
  role: function() {
    return Session.get('role');
  },
  game: function() {
    return Session.get('game');
  },
  host: function() {
    return Session.get('role') == 'host';
  },
  player: function() {
    return Session.get('role') == 'player';
  },
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