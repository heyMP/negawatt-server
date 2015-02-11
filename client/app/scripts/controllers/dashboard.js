'use strict';

angular.module('negawattClientApp')
  .controller('DashboardCtrl', function ($state, $stateParams, profile) {
    console.log('DashboardCtrl' );
    var defaultAccountId;
    if (profile) {
      console.log(!(Object.keys($stateParams).length), $state.is('home') );
      // Apply only on the login wotkflow.
      if (!(Object.keys($stateParams).length) && $state.is('home')  ) {
        // Get active account after login.
        defaultAccountId = profile.account[0].id;
        $state.go('dashboard.account', {accountId: defaultAccountId});
      }
    }
    else {
      // Redirect to login.
      $state.go('login');
    }

  });
