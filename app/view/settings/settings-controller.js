'use strict';

require('./_settings.scss');

module.exports = ['$log', '$rootScope', '$stateParams', 'profileService', 'postService', 'commentService', SettingsController];


function SettingsController($log, $rootScope, $stateParams, profileService, postService, commentService) {
  $log.debug('SettingsController');

  this.myUserID = $stateParams.userID;
  this.myProfile = [];

  this.fetchMyProfile = function(){
    $log.debug('SettingsController.fetchMyProfile()');


    profileService.fetchProfile(this.myUserID)
      .then( profile => {
        this.myProfile.push(profile);
        // console.log('HERE!!!',this.myProfile[0]._id);
      });

  };

  this.fetchMyProfile();

  this.fetchMyPosts = function() {
    $log.debug('SettingsController.fetchMyPosts()');

    this.myCommentsArray = [];
    this.myPostsArray = [];

    postService.fetchMyPosts(this.myProfile[0]._id)
    .then( profile => {
      for( var prop in profile.posts){
        console.log(profile.posts[prop]);
        let post = {};
        post.data = profile.posts[prop];
        this.myPostsArray.push(post);
      }
    });
  };

  this.fetchMyComments = function() {
    $log.debug('SettingsController.fetchMyComments');

    this.myPostsArray = [];

    this.myCommentsArray = [];
    console.log('JCKBDJCGJDGCKJDBCKJDBCJKHDC', this.myCommentsArray[0]);
    // for( var prop in this.myCommentsArray){
    //   console.log( prop);
    // }
    this.myCommentsArray.forEach( comment => {
      console.log('comment if ',comment._id)
    });


    commentService.fetchProfileComments(this.myProfile[0])
    .then( profile => {
      console.log('Settings profile ::::::::::::::::>', profile.comments[1]);
      profile.comments.forEach( comment => {
        this.myCommentsArray.push(comment);
        // console.log('comment pushed:::::::', comment._id);
      });
      //  console.log('JCKBDJCGJDGCKJDBCKJDBCJKHDC', this.myCommentsArray[1]._id);
    });

    
    // for( var prop in this.myCommentsArray[0]){
    //   console.log('BROB',prop);
    // }
  };

  // this.fetchMyComments();


}