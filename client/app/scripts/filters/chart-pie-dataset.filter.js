angular.module('negawattClientApp')
  .filter('toPieChartDataset', function (Utils, Chart, ChartOptions) {

    /**
     * From a collection object create a Google Chart data for a Pie object
     *
     * @param collections
     *  The collections to get data, label and generate the dataset.
     *
     * @returns {*}
     *  The dataset collection filtered.
     */
    return function (collections){
      var data = angular.isArray(collections[0]) || collections;
      var labels = angular.isArray(collections[1]) || {};

      // Recreate collection object.
      collection = {
        type: 'PieChart',
        data: getDataset(data, labels),
        options: getOptions()
      }
      return collection;
    }

    /**
     * Return the options of the selected chart.
     *
     * @returns {*}
     *  Chart options object.
     */
    function getOptions() {
      return {};
    }

    /**
     * Return the object with the dataset based on the collection object.
     *
     * @param collection
     *  The collection to format.
     */
    function getDataset(collection, labels) {
      var dataset = {
        'cols': [
          {id: 't', label: 'Categories', type: 'string'},
          {id: 's', label: 'Slices', type: 'number'}
        ],
        'rows': getRows(collection.values, collection.type, labels)
      };

      return dataset;
    };

    /**
     * Return the collection in dataset Pie chart google format. According to
     * the type.
     *
     * @param obj
     *  The collection to filter.
     * @param type
     *  The type of the data (category|meter).
     *
     * @returns {Array}
     *  An array of the data ordering as the type requested.
     */
    function getRows(obj, type) {
      var rows = [];

      switch (type) {
        case 'category':


          // Transform to Google Pie Chart compatible.
          angular.forEach(obj, function(value, key) {
            this.push({
              c: [
                {v: !Utils.isEmpty(labels) && labels[key].title || 'label' + key},
                {v: value},
                {id: key}
              ]
            });
          }, rows);
          break;
      }

      return rows;
    }

  });
