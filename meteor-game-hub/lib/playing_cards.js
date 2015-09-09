// Deck = new Mongo.Collection('Deck');
// var cards = [];
// var suits = ['D', 'C', 'H', 'S'];
// for (s = 0; s < 4; s++) {
//   for (n = 1; n < 14; n++) {
//     cards.push({ suit: suits[s], number: n });
//   }
// }
// Deck.insert({ cards: cards }, function(err, doc) {
  
// });

// Meteor.methods({
//   'Card': function(suit, number) {
//     this.suit = suit;
//     this.number = number;
//   },
//   'CardtoString': function(card) {
//     return card.suit + card.number;
//   },
//   'shuffle': function(deck) {
//     var counter = deck.length, temp, index;
//     while (counter > 0) {
//       index = Math.floor(Math.random() * counter);
//       counter--;
//       temp = deck[counter];
//       deck[counter] = deck[index];
//       deck[index] = temp;
//     }
//   }
// });