'use strict';

require('./_post-tile.scss');

module.exports = {
  template: require('./post-tile.html'),
  controller: ['$log', '$uibModal', '$window', 'postService' , 'picService','profileService', PostTileController],
  controllerAs: 'postTileCtrl',
  bindings: {
    post: '<'
  }
};


function PostTileController($log, $uibModal, $window, postService, picService, profileService){
  $log.debug('PostTileController');

  let profileID = $window.localStorage.getItem('profileID');

  this.$onInit = function(){
    $log.debug('postTileCtrl.$onInit()');

    this.isVid = (/\.mp4$/).test(this.post.postPicURI);
    this.isMyPost = this.post.posterPID.toString() === profileID.toString();

    profileService.fetchProfile2(this.post.posterPID)
    .then(profile => {
      console.log('PPPPPPPPP', profile);
      this.poster = profile;
    });
  };


  this.animationsEnabled = true;
  // console.log('WARI WARI WARI WARI!::',this.post);
  this.open = function (size, parentSelector) {
    // var parentElem = parentSelector ? 
    //   angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      // ariaLabelledBy: 'modal-title',
      // ariaDescribedBy: 'modal-body',
      // templateUrl: 'myModalContent.html',
      // controller: 'ModalInstanceCtrl',
      // controllerAs: 'this',
      size: size,
      // appendTo: parentElem,
      // resolve: {
      //   items: function () {
      //     return this.items;
      //   }
      // }
    });

    // modalInstance.result.then(function (selectedItem) {
    //   this.selected = selectedItem;
    // }, function () {
    //   $log.info('Modal dismissed at: ' + new Date());
    // });
  };

  // this.check = function(data){
  //   this.isVid = (/\.mp4$/).test(data.postPicURI);
  //   this.isMyPost = data.posterUID.toString() === userID.toString();
  //   this.posterf(data);
  //   // console.log('POST.DATA >>>>>>>>>>>>>>>', data._id);
  //   // for( var prop in data) {
  //   //   console.log(prop);
  //   // }
  //   console.log('boolean :::::::}}}}',data.posterUID.toString() === userID.toString());
  // };


  this.openComponentModal = function (post) {
    // console.log('WARI WARI WARI WARI!::',post);
    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      component: 'postItem',
      resolve: {
        post: function () {
          console.log('<><><><><><><><><><><><><>', post);
          return post; 
        }
      }
    });

  };

  this.openEditPostModal = function (post) {
    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      component: 'editPost',
      resolve: {
        post: function () {
          console.log('<><><><><><><><><><><><><>', post);
          return post; 
        }
      }
    });
  };

  this.deletePost = function(post){
    $log.debug('postTileController.deletePost()');
    //TODO => fix the delete pic route
    postService.deletePost(post._id)
    .then( () => {
      picService.deletePostPic(post);
    })
    .catch( (err) => $log.error('Did not delete the post', err));
  };


}