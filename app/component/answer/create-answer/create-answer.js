'use strict';

require('./_create-answer.scss');

module.exports = {
  template: require('./create-answer.html'),
  controller: ['$log', '$window', 'answerService', CreateAnswerController],
  controllerAs: 'createAnswerCtrl',
  bindings: {
    forum: '<',
    answer: '<',
    poll: '<'
  }
};

function CreateAnswerController($log, $window, answerService) {
  $log.debug('CreateAnswerController');

  this.answerData = {};

  this.createAnswer = function(){
    $log.debug('createAnswerCtrl.createAnswer()');

    if(this.forum) {
      answerService.createAnswer(this.forum._id, this.answerData)
    .then( forum => console.log('Successfully created answer', forum))
    .catch( err => console.log('FAiled to createAnswer', err));
    }
    if(this.answer) {
      answerService.replyAnswer(this.answer._id, this.answerData)
    .then( forum => console.log('Successfully replied answer', forum))
    .catch( err => console.log('FAiled to reply to Answer', err));
    }
  
    if(this.poll) {
      answerService.createPollAnswer(this.poll._id, this.answerData)
    .then( forum => console.log('Successfully created poll answer', forum))
    .catch( err => console.log('FAiled to create poll Answer', err));
    }
  };

}