'use strict';

/**
 * @ngdoc overview
 * @name negawattClientApp
 * @description
 * # negawattClientApp
 *
 * Main module of the application.
 */
angular
  .module('negawattClientApp', [
    'angularMoment',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive',
    'config',
    'LocalStorageModule',
    'ui.router',
    'googlechart',
    'angular-md5',
    'angular-loading-bar',
    'ui.bootstrap.tabs',
    'template/tabs/tab.html',
    'template/tabs/tabset.html',
    'angularMoment',
    'ngAnimate-animate.css'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider, $urlMatcherFactoryProvider) {

    /**
     * Reload from main state the site.
     *
     * @param $state
     *  The state service
     */
    function goMainState($state) {
      $state.transitionTo('main', {}, {reload: true});
    }

    // Route paths not defined in the $stateProvider.
    $urlRouterProvider.when('/login/', '/login');
    $urlRouterProvider.when('/logout/', '/logout');
    //$urlRouterProvider.when('/dashboard/{accountId:[0-9]{1,}}', '/dashboard/{accountId:[0-9]{1,}}/');
    //$urlRouterProvider.when('/dashboard/{accountId:[0-9]{1,}}/category/{categoryId:[0-9]{1,}}', '/dashboard/{accountId:[0-9]{1,}}/category/{categoryId:[0-9]{1,}}/');
    $urlRouterProvider.when('/dashboard', goMainState);
    $urlRouterProvider.when('/dashboard/', goMainState);
    $urlRouterProvider.when('', '/');

    // For any unmatched url, redirect to '/'.
    $urlRouterProvider.otherwise('/');

    // Define common data type form params.
    var numberType = {
      type: {
        decode: function(val) { return parseInt(val, 10); },
        encode: function(val) { return val && val.toString(); },
        equals: function(a, b) { return this.is(a) && a === b; },
        is: function(val) { return angular.isNumber(val) && isFinite(val) && val % 1 === 0; },
        name: 'number',
          pattern: /\d+/
      }
    };


    // Setup the states.
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html'
      })
      .state('logout', {
        url: '/logout',
        template: '<ui-view/>',
        controller: function(Auth, $state) {
          Auth.logout();
          $state.go('login');
        }
      })
      .state('main', {
        // path: /#/
        url: '/',
        template: '<ui-view/>',
        resolve: {
          profile: function(Profile) {
            return Profile.get();
          }
        },
        // If the pofile is defined the controller redirect to dashboard.account
        // otherwise to login.
        controller: 'DashboardCtrl'
      })
      // This state is created to load the common principal view views/dashboard/main.html.
      .state('main.dashboard', {
        abstract: true,
        // path: '/#/dashboard'
        url: 'dashboard',
        templateUrl: 'views/dashboard/main.html',
      })
      .state('main.dashboard.map', {
        abstract: true,
        // path: '/#/dashboard/'
        url: '/',
        template: '<ui-view/>',
        // With params property is possible define data type and and catch child params in a parent state.
        params: {
          accountId: numberType,
          categoryId: numberType
        },
        resolve: {
          account: function($stateParams, Profile, profile, $state) {
            console.log('accountId: ', this.params.accountId.type.name, typeof $stateParams.accountId, $stateParams.accountId, this);
            console.log('categoryId: ', this.params.categoryId.type.name, typeof $stateParams.categoryId, $stateParams.categoryId, this);
            return Profile.selectAccount($stateParams.accountId, profile);
          },
          meters: function(Meter, account, $stateParams, Category) {
            console.log('meters resolve', account.id);
            // Get first 100 records.
            return Meter.get(account.id);
          },
          categories: function(Category, account) {
            return Category.get(account.id);
          },
          messages: function(Message) {
            return Message.get();
          }
        },
        views: {
          'map': {
            templateUrl: 'views/dashboard/main.map.html',
            controller: 'MapCtrl',
            controllerAs: 'map'
          }
        }
      })
      .state('main.dashboard.map.account', {
        // path: '/#/dashboard/[0-9]/' || '/#/dashboard/[0-9]?chartFreq=2'
        url: '{accountId:int}?{chartFreq:int}',
        params: {
          chartFreq: {
            // Keep monthly chart type by default.
            value: 2
          }
        },
        views: {
          'menu@main.dashboard': {
            templateUrl: 'views/dashboard/main.menu.html',
            controller: 'MenuCtrl'
          },
          'categories@main.dashboard': {
            templateUrl: 'views/dashboard/main.categories.html',
            controller: 'CategoryCtrl'
          },
          'messages@main.dashboard': {
            templateUrl: 'views/dashboard/main.messages.html',
            controller: 'MessageCtrl'
          }
          //'details@dashboard': {
          //  templateUrl: 'views/dashboard/main.details.html',
          //  resolve: {
          //    categoriesChart: function(ChartCategories, account, categories, $stateParams) {
          //      return ChartCategories.get(account.id, $stateParams.categoryId, categories.collection);
          //    }
          //  },
          //  controller: 'DetailsCtrl'
          //},
          //'usage@dashboard': {
          //  templateUrl: 'views/dashboard/main.usage.html',
          //  resolve: {
          //    // Get electricity data and transform it into chart format.
          //    usage: function(ChartUsage, $state, $stateParams, account) {
          //      // Perform the GET only if we're in the proper (parent) state.
          //      if ($state.current.name == 'dashboard.withAccount') {
          //        return ChartUsage.get(account.id, $stateParams);
          //      } else {
          //        return {};
          //      }
          //    }
          //  },
          //  controller: 'UsageCtrl'
          //}
        }
      })
      .state('main.dashboard.map.account.categories', {
        // path: '/#/dashboard/[0-9]/category/[0-9]/' || '/#/dashboard/[0-9]/category/[0-9]/?chartFreq=2'
        url: '/category/:categoryId',
        //resolve: {
        //  account: function(account, profile) {
        //    console.log('account profile: ', account, profile);
        //    return account;
        //  }
        //}
        //views: {
        //  // Replace `meters` data previous resolved, with the cached data
        //  // filtered by the selected category.
        //  '@main.dashboard': {
        //    controller: function($rootScope) {
        //      console.log('**** ENTER');
        //      var meters = {};
        //      $rootScope.$broadcast('nwMetersChanged', meters);
        //    }
        //  }
          //'map@main.dashboard': {
          //  resolve: {
          //    meters: function(Meter, $rootScope, $stateParams, account) {
          //      // Update
          //      Meter.get(account.id, $stateParams.categoryId).then(function(meters) {
          //        $rootScope.$broadcast('nwMetersChanged', meters);
          //
          //      });
          //    },
          //    account: function(account) {
          //      return account;
          //    }
          //  },
          //  controller: function() {
          //    console.log('ENTER main.dashboard.map.account.categories ***** ');
          //  },
          //  templateUrl: 'views/dashboard/main.map.html'
          //}
          // Update usage-chart to show category summary.
          //'usage@dashboard': {
          //  templateUrl: 'views/dashboard/main.usage.html',
          //  resolve: {
          //    // Get electricity data and transform it into chart format.
          //    usage: function(ChartUsage, $stateParams, account) {
          //      return ChartUsage.get(account.id, $stateParams);
          //    }
          //  },
          //  controller: 'UsageCtrl'
          //},
          //'categories@dashboard': {
          //  templateUrl: 'views/dashboard/main.categories.html',
          //  controller: 'CategoryCtrl'
          //},
          //// Update details (pie) chart for categories.
          //'details@dashboard': {
          //  templateUrl: 'views/dashboard/main.details.html',
          //  resolve: {
          //    categoriesChart: function(ChartCategories, $stateParams, account, categories) {
          //      return ChartCategories.get(account.id, $stateParams.categoryId, categories.collection);
          //    }
          //  },
          //  controller: 'DetailsCtrl'
          //}
        //}
      });
      //.state('dashboard.account.markers', {
      //  url: '/marker/:markerId?categoryId',
      //  views: {
      //    // Replace `meters` data previous resolved, with the cached data
      //    // if is the case filtered by the selected category.
      //    'map@dashboard': {
      //      templateUrl: 'views/dashboard/main.map.html',
      //      resolve: {
      //        meters: function(Meter, $stateParams, account) {
      //          // Necessary to resolve again to apply the filter, of category id.
      //          return Meter.get(account.id, $stateParams.categoryId);
      //        }
      //      },
      //      controller: 'MapCtrl'
      //    },
      //    'categories@dashboard': {
      //      templateUrl: 'views/dashboard/main.categories.html',
      //      controller: 'CategoryCtrl'
      //    },
      //    // Update the meter detailed data.
      //    'details@dashboard': {
      //      templateUrl: 'views/dashboard/main.details.html',
      //      resolve: {
      //        // Keep angular.noop because need to resolve with an empty function 'function(){}',
      //        // null or {} doesn't works.
      //        categoriesChart: angular.noop
      //      },
      //      controller: 'DetailsCtrl'
      //    },
      //    // Update electricity-usage chart in 'usage' sub view.
      //    'usage@dashboard': {
      //      templateUrl: 'views/dashboard/main.usage.html',
      //      resolve: {
      //        // Get electricity data and transform it into chart format.
      //        usage: function(ChartUsage, $stateParams, account) {
      //          return ChartUsage.get(account.id, $stateParams);
      //        }
      //      },
      //      controller: 'UsageCtrl'
      //    }
      //  }
      //});

    // Define interceptors.
    $httpProvider.interceptors.push(function ($q, Auth, $location, localStorageService) {
      return {
        'request': function (config) {
          if (!config.url.match(/login-token/)) {
            config.headers = {
              'access-token': localStorageService.get('access_token')
            };
          }
          return config;
        },

        'response': function(result) {
          if (result.data.access_token) {
            localStorageService.set('access_token', result.data.access_token);
          }
          return result;
        },

        'responseError': function (response) {
          if (response.status === 401) {
            Auth.authFailed();
          }
          return $q.reject(response);
        }
      };
    });

    // Configuration of the loading bar.
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 1000;

  })
  .run(function ($rootScope, $state, $stateParams, $log, Config, amMoment) {
    // MomentJS internationalization.
    amMoment.changeLocale('he');

    // It's very handy to add references to $state and $stateParams to the
    // $rootScope so that you can access them from any scope within your
    // applications.For example:
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    if (!!Config.debugUiRouter) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $log.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
      });

      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
        $log.log('$stateChangeError - fired when an error occurs during transition.');
        $log.log(arguments);
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $log.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
      });
      //
      //$rootScope.$on('$viewContentLoaded', function (event) {
      //  $log.log('$viewContentLoaded - fired after dom rendered', event);
      //});

      $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        $log.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
        $log.log(unfoundState, fromState, fromParams);
      });
    }

  });

