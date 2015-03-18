'use strict';

angular.module('negawattClientApp')
  .controller('MapCtrlUpdate', function (account) {
    console.log('MapCtrlUpdate::', account);

    // Config map.
    $scope.defaults = Map.getConfig();
    $scope.center = Map.getCenter(account);

  });
