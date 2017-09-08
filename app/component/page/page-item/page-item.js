'use strict';

require('./_page-item.scss');

module.exports = {
  template: require('./page-item.html'),
  controller: ['$log', '$rootScope', '$stateParams', '$window', '$location', '$uibModal', 'pageService', 'postService', 'merchService',PageItemController],
  controllerAs: 'pageItemCtrl',
  bindings: {
    page: '<' 
  }
};


function PageItemController ($log, $rootScope, $stateParams, $window, $location, $uibModal, pageService, postService, merchService){
  $log.debug('PageItemController');

  // $rootScope.$on('$locationChangeStart', (e) => {
  //   console.log('you know what it is', e);
  //   if(this.postsArr) this.call();
  // });


  this.$onInit = function(){
    $log.debug('pageItemCtrl.onInit');
    console.log('hapa',$stateParams);

    this.pageID = $stateParams.pageID;
    this.profileID = $window.localStorage.getItem('profileID');
    
    pageService.fetchPage(this.pageID)
    .then( page => {
      this.count = page.members.length;
      this.showLeaveBtn = page.members.some( PID => PID.toString() === this.profileID.toString());
      this.showEditBtn = this.profileID === page.profileID;
      this.page = page;
      return this.fetch();
    })
    .then( () => {
      if($stateParams.post) {
        postService.fetchPost($stateParams.post)
        .then( post => {
          console.log('here it is mate \n\n', post);
          this.postsArr = [post, ...this.postsArr];
          this.openPostModal(post);
        });
      }
      return;
    });
  };
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//               FETCH MAIN
  this.fetch = function(){
    $log.debug('pageItemCtrl.fetch()');

    this.postsArr = [];
    this.merchesArr = [];
    this.showPostBtn = true;

    switch($stateParams.section) {
    case 'posts':
      return this.fetchPagePosts();
    case 'feed':
      return this.fetchPageFeed();
    case 'merch':
      this.showPostBtn = false;
      return this.fetchPageMerch();
    default: 
      this.fetchPagePosts();
    }
  };


  this.pagePosts = () => {
    $location.url(`/page/${this.page._id}/posts`);
  };

  this.fetchPagePosts = function(){
    $log.debug('pageItemCtrl.fetchPagePosts()');

    postService.fetchPagePosts(this.page._id)
    .then( posts => {
      console.log(posts);
      return this.postsArr = posts;
    })
    .catch( err => console.log('Failed ', err));
  };



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//               FEED

  this.pageFeed = () => {
    $location.url(`/page/${this.page._id}/feed`);
  };

  this.fetchPageFeed = function(){
    $log.debug('pageItemCtrl.fetchPostsFeed()');

    postService.fetchPageFeed(this.page._id)
    .then( posts => this.postsArr = posts)
    .catch(err => console.log('Failed to fetch feed', err));
  };

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    MERCH

  this.pageMerch = () => {
    $location.url(`/page/${this.page._id}/merch`);
  };

  this.fetchPageMerch = function(){
    $log.debug('pageItemCtrl.fetchPageMerch');

    merchService.fetchPageMerch(this.page._id)
    .then( merches => this.merchesArr =  merches)
    .catch(err => console.log('Failed to fetch poll feed', err));
  };

  this.goToMerch = function(){
    $log.debug('pageItemCtrl.goToMerch()');

    $location.url(`/merch/${this.page._id}`);
  };

  this.goToCart = function(){
    $log.debug('pageItemCtrl.goToCart()');

    $location.url('/cart');
  };

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    PAGE 
  this.joinPage = function() {
    $log.debug('pageItemCtrl.joinPage()');

    this.showLeaveBtn = true;
    ++this.count;

    pageService.joinPage(this.page._id)
    .then( page => console.log('Successfully joinPage()', page))
    .catch( err => console.log('Failed joinPage()', err));
  };

  this.leavePage = function(){
    $log.debug('pageItemCtrl.leavePage()');

    this.showLeaveBtn = false;
    --this.count;

    pageService.leavePage(this.page._id)
    .then( page => console.log('Successfully leavePage()', page))
    .catch( err => console.log('Failed leavePage()', err));
  };


  this.openCreatePostModal = function () {
    let page = this.page;
    $uibModal.open({
      animation: this.animationsEnabled,
      component: 'createPost',
      resolve: {
        page: function () {
          return page;
        }
      }
    });
  };


  this.openCreateMerchModal = function () {
    let page = this.page;
    $uibModal.open({
      animation: this.animationsEnabled,
      component: 'createMerch',
      resolve: {
        page: function () {
          return page;
        }
      }
    });
  };

  this.openPostModal = function (post) {
    // let page = this.page;
    $uibModal.open({
      animation: this.animationsEnabled,
      component: 'postItem',
      resolve: {
        post: function () {
          return post;
        }
      }
    });
  };

  this.goToEditPage = () => {
    $location.url('settings/pages'); // change to 'seetings/pages/:pageID'
  };

  this.bark = () => {
    console.log($stateParams);
    // $stateParams.post = 'new';
    // $location.path('page/597e798bfd94ab787bb8f851/post/5983de077b678b66f4532dba').replace();
    $location.search('name', 'newname');
    // $location.path('page/597e798bfd94ab787bb8f851/post/5983de077b678b66f4532dba').replace();

  };

}

// function ProfileViewController($log, $rootScope, $stateParams, $window, $uibModal, profileService, postService) {
//   $log.debug('ProfileViewController');

//   this.userID = $stateParams.userID;
//   this.showEditView = false;

//   let userID = $window.localStorage.getItem('userID');
  
//   this.showEditOption = userID === this.userID;

//   this.check = function(){
//     $log.debug('profileViewController.check()');

//     let userID = $window.localStorage.getItem('userID');
//     profileService.fetchProfile(userID)
//     .then( profile => {
//       let arr = profile.memberOf;
//       this.showLeaveBtn = arr.some( PID => PID.toString() === this.userID.toString());
//       // console.log('profile.memberOf  }-------->',arr);
//       // console.log('}------->', this.userID);
//     });
//   };
//   this.check();


//   this.deleteProfile = function(profile) {
//     if (this.profile._id === profile._id) {
//       this.profile = null;
//     }
//   };

//   this.updateProfileView = function() {
//     $log.debug('ProfileViewController.updateProfileView()');
//     console.log('this.postArray:::',this.postsArray);

//     this.postsArray = [];
    
//     profileService.fetchProfile(this.userID)
//     .then(profile => {
//       this.profile = profile;
//       this.showEditView = false;
//       if(profile.posts.length !== 0){
//         profile.posts.forEach( profileID => {
//           postService.fetchPost(profileID)
//           .then( postObj => this.postsArray.push(postObj));
//         });
//       }
//     })
//     .catch( err => $log.error(err.message));
//   };

//   this.join = function(){
//     $log.debug('ProfileViewController.join()');

//     profileService.joinProfile(this.userID)
//     .then( res => console.log('SUCCESS join()', res))
//     .catch( err => console.error('FAILED join()', err));
//     return this.updateProfileView();
//   };

//   this.leave = function(){
//     $log.debug('ProfileViewController.leave()');

//     profileService.leaveProfile(this.userID)
//     .then( profile => console.log(profile))
//     .catch( (err) => console.error('FAILED leave()', err));
//   };

//   // this.open = function (size, selectedPost) {
//   //   // var parentElem = parentSelector ? 
//   //   //   angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
//   //   var modalInstance = $uibModal.open({
//   //     animation: this.animationsEnabled,
//   //     // ariaLabelledBy: 'modal-title',
//   //     // ariaDescribedBy: 'modal-body',
//   //     templateUrl: 'create-post.html',
//   //     // controller: 'CreatePostController',
//   //     // controllerAs: 'this',
//   //     size: size,
//   //     // appendTo: parentElem,
//   //     resolve: {
//   //       items: function () {
//   //         return selectedPost;
//   //       }
//   //     }
//   //   });

//   //   // modalInstance.result.then(function (selectedItem) {
//   //   //   this.selected = selectedItem;
//   //   // }, function () {
//   //   //   $log.info('Modal dismissed at: ' + new Date());
//   //   // });
//   // };

  // this.openComponentModal = function ( profile) {

  //   var modalInstance = $uibModal.open({
  //     animation: this.animationsEnabled,
  //     component: 'createPost',
  //     resolve: {
  //       profile: function () {
  //         return profile;
  //       }
  //     }
  //   });
  // };


// }
