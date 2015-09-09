Template.blackjack.rendered = function() {

}

Template.blackjack.events({
  'click #deal_button': function() {
    Meteor.call('deal');

    var hand = Hand.findOne({ _id: 1 });
    for (i = 0; i < hand.cards.length; i++) {
      $('#card' + i).attr('src', 'classic-cards/' + hand.cards[i].suit + hand.cards[i].number + '.png');
    }

    var score = hand.sum;
    if (hand.ace && (hand.sum + 10 <= 21)) {
      score = hand.sum + 10;
    }

    $('#card_score').html(score);

    $('#deal_button').prop('disabled', true);
    $('#hit_button').prop('disabled', false);
    $('#stay_button').prop('disabled', false);
  },
  'click #hit_button': function() {
    Meteor.call('hit');

    var hand = Hand.findOne({ _id: 1 });
    
    for (i = 0; i < hand.cards.length; i++) {
      $('#card' + i).attr('src', 'classic-cards/' + hand.cards[i].suit + hand.cards[i].number + '.png');
    }

    var score = hand.sum;
    if (hand.ace && (hand.sum + 10 <= 21)) {
      score = hand.sum + 10;
    }

    $('#card_score').html(score);

    if (score > 21) {
      $('#hand_status').html('Bust!');
      $('#hit_button').prop('disabled', true);
      $('#stay_button').prop('disabled', true);
      $('#reset_button').prop('disabled', false);
    }

    if (score == 21) {
      $('#hand_status').html('Blackjack!');
      $('#hit_button').prop('disabled', true);
      $('#stay_button').prop('disabled', true);
      $('#reset_button').prop('disabled', false);
    }
  },
  'click #stay_button': function() {
    $('#hit_button').prop('disabled', true);
    $('#stay_button').prop('disabled', true);
    $('#reset_button').prop('disabled', false);
  },
  'click #reset_button': function() {
    var hand = Hand.findOne({ _id: 1 });
    for (i = 0; i < hand.cards.length; i++) {
      $('#card' + i).attr('src', '');
    }

    Meteor.call('resetGame');

    $('#deal_button').prop('disabled', false);
    $('#reset_button').prop('disabled', true);
    $('#card_score').html('0');
    $('#hand_status').html('');
  }
});
