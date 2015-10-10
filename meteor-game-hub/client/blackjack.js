// Front End Functions for Blackjack Module

Template.blackjack_host.helpers({
  // return number of cards in deck
  cardCount: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      if (room.cards) {
        return room.cards.length;
      }
    }
  },
  // return whose turn or game over for all players
  playerTurn: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      if (room.all_game_over) {
        return 'Game over';
      }
      var turn = room.turn;
      var player_id = room.players[turn];
      var player = Players.findOne({ player: player_id });
      if (player) {
        return player.name;
      }
    }
  },
  // return whether to disable reset button
  gameOver: function() {
    if (Session.get('room_id')) {
      var room = Rooms.findOne({ room: Session.get('room_id') });
      if (room) {
        if (room.all_game_over) {
          Meteor.call('findWinner', Session.get('room_id'));
          return false;
        }
      }
    }
    return true;
  },
  // return winner or none
  gameWinner: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      return room.winner;
    }
  }
});

Template.blackjack_host.events({
  'click #reset_button': function() {
    // reset player hands
    Meteor.call('resetPlayers', Session.get('room_id'));

    // reset deck and redeal
    Meteor.call('resetRoom', Session.get('room_id'));
  }
});

Template.blackjack_player.rendered = function() {
  // for initial deal - deal to one player at a time
  Session.set('rendered', true); 
  Meteor.call('deal', Session.get('player_id'), Session.get('room_id'));
  Meteor.call('incrementTurn', Session.get('room_id'));
}

Template.blackjack_player.helpers({
  // return score of player hand
  cardScore: function() {
    var player = Players.findOne({ player: Session.get('player_id') });
    var score = player.score;
    if (score > 21) {
      Meteor.call('endGame', Session.get('room_id'), Session.get('player_id'));
      return 'Bust!';
    }
    else if (score == 21) {
      Meteor.call('endGame', Session.get('room_id'), Session.get('player_id'));
      return 'Blackjack!';
    }
    return score;
  },
  // return list of cards in player hand
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
  // return player name
  playerName: function() {
    var player = Players.findOne({ player: Session.get('player_id') });
    return player.name;
  },
  // return whose turn or game over for player
  playerTurn: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      var players = room.players;
      var player_index = players.indexOf(Session.get('player_id'));
      var game_over = room.game_over[player_index];
      if (game_over) {
        return 'Game over';
      }
      var turn = room.turn;
      var player_id = room.players[turn];
      var player = Players.findOne({ player: player_id });
      if (player) {
        if (player_id == Session.get('player_id')) {
          return 'Your turn';
        } else {
          return player.name + '\'s turn';
        }
      }
    }
  },
  // disable actions if game over or not player turn
  disableAction: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      var players = room.players;
      var player_index = players.indexOf(Session.get('player_id'));
      var game_over = room.game_over[player_index];
      var your_turn = players[room.turn] == Session.get('player_id');
      return game_over || !your_turn;
    }
  }
});

Template.blackjack_player.events({
  'click #hit_button': function() {
    // add card and increment turn
    Meteor.call('hit', Session.get('player_id'), Session.get('room_id'));
    Meteor.call('incrementTurn', Session.get('room_id'));
  },
  'click #stay_button': function() {
    // end game and increment turn
    Meteor.call('endGame', Session.get('room_id'), Session.get('player_id'));
    Meteor.call('incrementTurn', Session.get('room_id'));
  },
});

Template.blackjack_spectator.helpers({
  // return number of cards in deck
  cardCount: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      if (room.cards) {
        return room.cards.length;
      }
    }
  },
  // return whose turn or game over for all players
  playerTurn: function() {
    var room = Rooms.findOne({ room: Session.get('room_id') });
    if (room) {
      if (room.all_game_over) {
        return 'Game over';
      }
      var turn = room.turn;
      var player_id = room.players[turn];
      var player = Players.findOne({ player: player_id });
      if (player) {
        return player.name;
      }
    }
  }
});
