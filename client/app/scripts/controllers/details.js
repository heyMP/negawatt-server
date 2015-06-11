'use strict';

angular.module('negawattClientApp')
  .controller('DetailsCtrl', function ($scope, $state, $stateParams, FilterFactory, ChartCategories, categoriesChart, meters) {
    var categoryId;
    // The initialization in a empty object is need it to avoid an error in the initial rendering.
    $scope.categoriesChart = categoriesChart;

    // Select category form the pie chart.
    $scope.onSelect = function(selectedItem, chartData) {
      categoryId = ChartCategories.getCategoryIdSelected(selectedItem, chartData);
      if (angular.isDefined(categoryId)) {
        $state.go('dashboard.withAccount.categories', {accountId: $stateParams.accountId, categoryId: categoryId, chartNextPeriod: undefined, chartPreviousPeriod: undefined});
      }
    };

    // Handle lazy-load of electricity data.
    // When cache expands, update the chart.
    $scope.$on("nwElectricityChanged", function(event, electricity) {
      var electricity = electricity[FilterFactory.get('activeElectricityHash')];

      if (angular.isUndefined(electricity)) {
        return;
      }
      // Update electricity object.
      // vm.electricity = angular.isDefined(electricity) && electricity;
      ChartCategories.get($stateParams.accountId, $stateParams.categoryId, electricity)
        .then(function(dataset) {
          $scope.categoriesChart = dataset;
          debugger
        }, function(error) {
          debugger;
          console.log(error);
        });


      event.preventDefault();
    });

    /**
     * Set the selected Meter.
     *
     * @param id int
     *   The Marker ID.
     */
    function setSelectedMarker(id) {
      // Use in the widget 'Details'.
      $scope.meterSelected = meters.list[id];
    }

    if ($stateParams.markerId) {
      setSelectedMarker($stateParams.markerId);
    }
  });
