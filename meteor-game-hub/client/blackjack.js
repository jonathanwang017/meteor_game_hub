Template.blackjack.rendered = function() {
  
}

Template.blackjack.events({
  'click #deal_button': function() {
    Meteor.call('deal');

    var hand = Hand.findOne({ _id: 1});
    for (i = 0; i < hand.cards.length; i++) {
      $('#card' + i).attr('src', 'classic-cards/' + hand.cards[i].suit + hand.cards[i].number + '.png');
    }

    $('#deal_button').prop('disabled', true);
    $('#hit_button').prop('disabled', false);
    $('#stay_button').prop('disabled', false);
  },
  'click #hit_button': function() {
    Meteor.call('hit');

    var hand = Hand.findOne({ _id: 1});
    for (i = 0; i < hand.cards.length; i++) {
      $('#card' + i).attr('src', 'classic-cards/' + hand.cards[i].suit + hand.cards[i].number + '.png');
    }
  },
  'click #stay_button': function() {
    // Meteor.call('endGame');
    console.log('stay');
  },
  'click #reset_button': function() {
    // Meteor.call('clearCards', hand);

    // Meteor.call('resetGame');
    console.log('reset');
  }
});
