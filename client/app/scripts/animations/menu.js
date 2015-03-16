'use strict';

angular.module('negawattClientApp')
  // Add extra animation to the home button.
  .animation('.dn-fadeIn', function(animateCSSBuild) {
    return animateCSSBuild('dn-fadeIn','pulse','pulse');
  });
