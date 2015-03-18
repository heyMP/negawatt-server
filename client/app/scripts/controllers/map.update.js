'use strict';

angular.module('negawattClientApp')
  .controller('MapCtrlUpdate', function ($rootScope, meters) {
    console.log('MapCtrlUpdate', meters);
    $rootScope.$broadcast('nwMetersChanged', meters);
  });
