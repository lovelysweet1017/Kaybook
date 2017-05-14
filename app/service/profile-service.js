'use strict';

module.exports = ['$q', '$log', '$http', '$window', 'authService', profileService];

function profileService($q, $log, $http, $window, authService) {
  $log.debug('profileService');

  let service = {};
  service.profiles = [];

  service.createProfile = function(profile) {
    $log.debug('profileService.createProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      return $http.post(url, profile, config);
    })
    .then( res => {
      $log.log('profile created');
      let profile = res.data;
      service.profiles.unshift(profile);
      return profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchProfile = function(userID) {
    $log.debug('profileService.fetchProfile');

    let url = `${__API_URL__}/api/profile/${userID}`;
    let config = {
      headers: {
        Accept: 'application/json'
      }
    };

    return $http.get(url, config)
    .then( res => {
      $log.log('Profile Retrieved', res);
      $window.localStorage.setItem('profilePic', res.data.profilePicURI);
      service.profile = res.data;
      return service.profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchProfile2 = function(profileID) {
    $log.debug('profileService.fetchProfile2');

    let url = `${__API_URL__}/api/profile2/${profileID}`;
    let config = {
      headers: {
        Accept: 'application/json'
      }
    };

    return $http.get(url, config)
    .then( res => {
      $log.log('Profile Retrieved', res);
      service.profile = res.data;
      return service.profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchProfiles = function() {
    $log.debug('profileService.fetchProfiles');

    let url = `${__API_URL__}/api/allprofiles`;
    let config = {
      headers: {
        Accept: 'application/json'
      }
    };

    return $http.get(url, config)
    .then( res => {
      $log.log('All profiles retrieved.');
      service.profiles = res.data;
      return service.profiles;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.editProfile = function(profileID, profileData) {
    $log.debug('profileService.editProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile/${profileID}`;
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      return $http.put(url, profileData, config);
    })
    .then( res => {
      $log.log('Profile edited successfully.');
      service.profile = res.data;
      return service.profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.deleteProfile = function() {
    $log.debug('profileService.deleteProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/profile/${userID}`;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      };

      return $http.delete(url, config);
    })
    .then( res => {
      $log.log('Profile deleted.');
      service.profile = res.data;
      return service.profile;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.joinProfile = function(joinedUID){
    $log.debug('profileService.joinProfile');

    return authService.getToken()
    .then( token => {
      console.log(token);
      let url = `${__API_URL__}/api/join/${joinedUID}`;
      let config = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      return $http.get(url, config);
    })
    .then( res => {
      $log.log('joined the page');
      service.profile = res.data;
      return service.profile;
    })
    .catch( err => {
      $log.error('Didnt join the page',err);
      return $q.reject(err);
    });
  };

  service.leaveProfile = function(joinedUID){
    $log.debug('profileService.joinProfile');

    return authService.getToken()
    .then( token => {
      console.log(token);
      let url = `${__API_URL__}/api/leave/${joinedUID}`;
      let config = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      return $http.get(url, config);
    })
    .then( res => {
      $log.log('left the page');
      service.profile = res.data;
      return service.profile;
    })
    .catch( err => {
      $log.error('Didnt leave the page',err);
      return $q.reject(err);
    });
  };

  service.joinProfile2 = function(joinedID){
    $log.debug('profileService.joinProfile');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/join2/${joinedID}`;
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      return $http.put(url, config);
    })
    .then( res => {
      $log.log('joined the page');
      service.profile = res.data;
      return service.profile;
    })
    .catch( err => {
      $log.error('Didnt join the page',err.message);
      return $q.reject(err);
    });
  };


  return service;
}
