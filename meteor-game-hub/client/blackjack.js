// Front End Function for Blackjack Module

Template.blackjack_host.rendered = function() {

}

Template.blackjack_host.helpers({
  cardCount: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      if (room.cards) {
        return room.cards.length;
      }
    }
  },
  playerTurn: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      var turn = room.turn;
      var player_id = room.players[turn];
      var player = Players.findOne({ player: player_id });
      if (player) {
        return player.name;
      }
    }
  }
});

Template.blackjack_player.rendered = function() {
  Session.set('game_over', false);
  Session.set('rendered', true);

  Meteor.call('deal', Session.get('player_id'), Session.get('room_id'));
  Meteor.call('incrementTurn', Session.get('room_id'));
  var player = Players.findOne({ player: Session.get('player_id') });
  if (getScore(player) == 21) {
    Session.set('game_over', true);
    Meteor.call('endGame', Session.get('room_id'));
  }
}

Template.blackjack_player.helpers({
  cardScore: function() {
    var player = Players.findOne({ player: Session.get('player_id') });
    score = getScore(player);
    if (score > 21) {
      return 'Bust!';
    }
    else if (score == 21) {
      return 'Blackjack!';
    }
    return score;
  },
  handCards: function() {
    var player = Players.findOne({ player: Session.get('player_id') });
      if (player.cards) {
      hand = [];
      for (i = 0; i < player.cards.length; i++) {
        hand.push({ card: 'classic-cards/' + player.cards[i].suit + player.cards[i].number + '.png' });
      }
      return hand;
    }
  },
  playerName: function() {
    var player = Players.findOne({ player: Session.get('player_id') });
    return player.name;
  },
  playerTurn: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      var turn = room.turn;
      var player_id = room.players[turn];
      var player = Players.findOne({ player: player_id });
      if (player) {
        if (player_id == Session.get('player_id')) {
          if (Session.get('game_over')) {
            Meteor.call('incrementTurn', Session.get('room_id'));
          }
          Session.set('your_turn', true);
          return 'Your';
        } else {
          Session.set('your_turn', false);
          return player.name + '\'s';
        }
      }
    }
  },
  disableAction: function() {
    return Session.get('game_over') || !Session.get('your_turn');
  }
});

Template.blackjack_player.events({
  'click #hit_button': function() {
    Meteor.call('hit', Session.get('player_id'), Session.get('room_id'));

    var player = Players.findOne({ player: Session.get('player_id') });
    if (getScore(player) >= 21) {
      Session.set('game_over', true);
      Meteor.call('endGame', Session.get('room_id'));
    }
    Meteor.call('incrementTurn', Session.get('room_id'));
  },
  'click #stay_button': function() {
    Session.set('game_over', true);
    Meteor.call('endGame', Session.get('room_id'));
    Meteor.call('incrementTurn', Session.get('room_id'));
  },
});

function getScore(player) {
  // calculate max score (ace as 1 or 11)
  var score = player.sum;
  if (player.ace && (player.sum + 10 <= 21)) {
    score = player.sum + 10;
  }
  return score;
}
