'use strict';

angular.module('negawattClientApp')
  .controller('MenuCtrl', function($scope, $state, $stateParams, amMoment, Timedate, Category, account, profile) {
    $scope.account = account;
    $scope.user = profile.user;
    $scope.timedate = Timedate;
    $scope.accountId = $stateParams.accountId;

    /**
     * Reset category selection and back to the home.
     */
    $scope.reloadDashboard = function() {
      $scope.ngAnimationPulse=!$scope.ngAnimationPulse;
      Category.clearSelectedCategory();
      $state.go('main.dashboard.map.account', {accountId: $stateParams.accountId});
    };

  });
