// Front End Function for Blackjack Module

Template.blackjack.rendered = function() {

}

Template.blackjack.events({
  'click #deal_button': function() {
    Meteor.call('deal');

    var hand = Hand.findOne({ _id: 1 });
    updateGui(hand);
    startGame();
  },
  'click #hit_button': function() {
    Meteor.call('hit');

    var hand = Hand.findOne({ _id: 1 });
    updateGui(hand)
    checkBust(hand);
    checkBlackjack(hand);
  },
  'click #stay_button': function() {
    endGame();
  },
  'click #reset_button': function() {
    Meteor.call('resetGame');

    clearCards();
    resetGame();
  }
});

function updateGui(hand) {
  // update hand in gui
  for (i = 0; i < hand.cards.length; i++) {
    $('#card' + i).attr('src', 'classic-cards/' + hand.cards[i].suit + hand.cards[i].number + '.png');
  }

  // update score in gui
  $('#card_score').html(getScore(hand));
}

function startGame() {
  $('#deal_button').prop('disabled', true);
  $('#hit_button').prop('disabled', false);
  $('#stay_button').prop('disabled', false);
}

function getScore(hand) {
  // calculate max score (ace as 1 or 11)
  var score = hand.sum;
  if (hand.ace && (hand.sum + 10 <= 21)) {
    score = hand.sum + 10;
  }
  return score;
}

function checkBust(hand) {
  if (getScore(hand) > 21) {
    $('#hand_status').html('Bust!');
    endGame();
  }
}

function checkBlackjack(hand) {
  if (getScore(hand) == 21) {
    $('#hand_status').html('Blackjack!');
    endGame();
  }
}

function clearCards(hand) {
  for (i = 0; i < 10; i++) {
    $('#card' + i).attr('src', '');
  }
}

function endGame() {
  $('#hit_button').prop('disabled', true);
  $('#stay_button').prop('disabled', true);
  $('#reset_button').prop('disabled', false);
}

function resetGame() {
  $('#deal_button').prop('disabled', false);
  $('#reset_button').prop('disabled', true);
  $('#card_score').html('0');
  $('#hand_status').html('');
}
