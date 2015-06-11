'use strict';

angular.module('negawattClientApp')
  .controller('DetailsCtrl', function ($scope, $state, $stateParams, FilterFactory, ChartCategories, meters, $filter, categories) {
    var categoryId;

    $scope.categories = categories;
    // The initialization in a empty object is need it to avoid an error in the initial rendering.
    //$scope.categoriesChart = categoriesChart;
    $scope.categoriesChart = {};

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
      var summary = $filter('summary')(electricity[FilterFactory.get('activeElectricityHash')]);

      if (angular.isUndefined(summary)) {
        return;
      }
      // Update electricity object.
      $scope.categoriesChart = $filter('toPieChartDataset')(summary, (summary.type === 'category') ? $scope.categories.collection : {});

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
