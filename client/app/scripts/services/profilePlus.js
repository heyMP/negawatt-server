'use strict';

angular.module('negawattClientApp')
  .service('ProfilePlus', function ($q, $http, $timeout, $filter, $state, $rootScope, Config, Restful) {
    angular.extend(this, Restful);
    var self = this;

    debugger;

    // A private cache key.
    var cache = {};

    // Update event broadcast name.
    var broadcastUpdateEventName = 'nwProfileChanged';

    // Save the account ID of the active account.
    var activeAccountId;

    /**
     * Return the promise with the account, from cache or the server.
     *
     * @returns {*}
     */
    this.get = function() {
      return $q.when(cache.data || getDataFromBackend());
    };

    /**
     * Return the account active
     *
     * @param accountId
     *  The account ID comming form the URL params.
     * @param profile
     *  The object profile
     *
     * @returns {*}
     *  The account object selected.
     */
    this.selectAccount = function(accountId, profile) {
      var active,
        position;

      // Get select the account as active.
      active = $filter('filter')(profile.account, {id: accountId});

      profile.account.map(function(item, index) {
        if (item.id === accountId) {
          // Remove the selection from the original array.
          profile.account.splice(index, 1);
          return;
        }
      });

      // Insert in the beginning of the Array.
      profile.account.unshift(active.pop());

      // Clear app cache, if new account was selected or there not define the active account.
      if (activeAccountId !== profile.account[0].id) {
        $rootScope.$broadcast('nwClearCache');
      }

      return profile.account[0];
    };

    /**
     * Return a promise of an profile object object from the server.
     *
     * The Profile object have the information of the account and the user session.
     *
     * @returns {$q.promise}
     */
    function getDataFromBackend() {
      var getProfile,
        deferred = $q.defer();

      getProfile = $q.all([getUserData(), getAccountData()]);
      getProfile.then(function(data) {
        setCache(data);
        deferred.resolve(cache.data);
      });

      return deferred.promise;
    }

    /**
     * Return account array from the server.
     *
     * @returns {$q.promise}
     */
    function getUserData() {
      var url = Config.backend + '/api/me';
      return $http({
        method: 'GET',
        url: url,
        transformResponse: prepareUserData,
        cache: true
      });
    }

    /**
     * Return account array from the server.
     *
     * @returns {$q.promise}
     */
    function getAccountData() {
      var url = Config.backend + '/api/accounts';
      return $http({
        method: 'GET',
        url: url,
        transformResponse: prepareAccountData,
        cache: true
      });

    }

    /**
     * Save account in cache, and broadcast en event to inform that the account data changed.
     *
     * @param data
     */
    function setCache(data) {
      // Cache account data.
      cache = {
        data: {
          user: data[0].data,
          account: data[1].data
        },
        timestamp: new Date()
      };
      // Clear cache in 60 seconds.
      $timeout(function() {
        cache.data = undefined;
      }, 60000);
      $rootScope.$broadcast(broadcastUpdateEventName);
    }


    /**
     * Prepare user session information.
     *
     * @param data - {string}
     *   User information.
     *
     * @returns {*}
     *   User object, extended with new methods.
     */
    function prepareUserData(data) {
      // Return  serialized to an object.
      return angular.fromJson(data).data;
    }

    /**
     * Prepare account information.
     *
     * @param data - {string}
     *   Account information.
     *
     * @returns {*}
     *   object with user information and methods.
     */
    function prepareAccountData(data) {
      if (!data) {
        return;
      }

      // Convert response serialized to an object.
      var accounts = angular.fromJson(data);

      if (!accounts) {
        // Response code was a 401.
        return;
      }

      angular.forEach(accounts.data, function(account, index) {
        // Convert center information for leafleat Map.
        account.center = {
          lat: parseFloat(account.location.lat),
          lng: parseFloat(account.location.lng),
          zoom: parseInt(account.zoom)
        };

        delete account.location;
        delete account.zoom;
      });


      return accounts.data;
    }

    $rootScope.$on('nwClearCache', function() {
      cache = {};
    });

  });
