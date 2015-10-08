Template.role_select.rendered = function() {

}

Template.role_select.events({
  // select to host or join
  'click #host_button': function() {
    Session.set('role', 'host');
  },
  'click #player_button': function() {
    Session.set('role', 'player');
  }
});

Template.game_select.rendered = function() {

}

Template.game_select.events({
  // select game
  'click #blackjack_button': function() {
    Session.set('game', 'blackjack');
  },
  'click #game_cancel_button': function() {
    Session.set('role', undefined);
  }
});

Template.host_lobby.rendered = function() {
  // create room with random id
  Session.set('room_id', Random.id());
  Meteor.call('createRoom', Session.get('room_id'), Session.get('game'));
}

Template.host_lobby.helpers({
  room_id: function() {
    return Session.get('room_id');
  },
  player_list: function() {
    player_list = []
    room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      player_ids = room.players;
      for (i = 0; i < player_ids.length; i++) {
        player_list.push({ player_name: Players.findOne({ player: player_ids[i] }).name });
      }
    }
    return player_list;
  }
});

Template.host_lobby.events({
  // start room
  'click #start_button': function() {
    Meteor.call('startRoom', Session.get('room_id'));
  },
  'click #host_cancel_button': function() {
    Session.set('game', undefined);
  }
});


Template.player_lobby.rendered = function() {
  Session.set('player_id', Random.id());
}

Template.player_lobby.events({
  // create player if room exists
  'click #join_button': function() {
    var join_id = $('#room_id_text').val();
    var room = Rooms.findOne({ room: join_id });
    if (room) {
      if (!room.active) {
        Session.set('room_id', join_id);
      } else {
        console.log('Room already started');
      }
    } else {
      console.log('Room does not exist');
    }

    Session.set('player_name', $('#name_text').val());

    Meteor.call('createPlayer', Session.get('player_id'), Session.get('room_id'), Session.get('player_name'));
    Meteor.call('addPlayer', Session.get('room_id'), Session.get('player_id'));
  },
  'click #player_cancel_button': function() {
    Session.set('role', undefined);
  }
});
