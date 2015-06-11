angular.module('negawattClientApp')
  .filter('toPieChartDataset', function (Chart, ChartOptions) {

    /**
     * From a collection object create a Google Chart data for a Pie object
     *
     * @param collection
     *  The collection to format.
     *
     * @returns {*}
     *  The dataset collection filtered.
     */
    return function (collection){
      // Recreate collection object.
      collection = {
        type: 'PieChart';,
        data: getDataset(collection),
        options: getOptions(chartFrequencyActive)
      }
      return collection;
    }

    /**
     * Return the options of the selected chart.
     *
     * @param chartFrequencyActive
     *  The specific chart options of the seleted frequency.
     * @returns {*}
     *  Chart options object.
     */
    function getOptions(chartFrequencyActive) {
      return {};
    }

    /**
     * Return the object with the dataset based on the collection object.
     *
     * @param collection
     *  The collection to format.
     */
    function getDataset(collection) {
      var dataset = {
        'cols': [
          {id: 't', label: 'Categories', type: 'string'},
          {id: 's', label: 'Slices', type: 'number'}
        ],
        'rows': getRows(collection.values, collection.type)
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
                {v: 'row.label'},
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
