ko.bindingHandlers.kendoComboBox = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        /// <summary>
        /// Method called right after binding ViewModel to element that has "kendoComboBox" binding handler applied to it.
        /// Initializes instance of kendo AutoComplete and binds value to it.
        /// </summary>
        /// <param name="element">The DOM element involved in this binding</param>
        /// <param name="valueAccessor">A JavaScript function that you can call to get the current model property that is involved in this binding. Call this without passing any parameters (i.e., call valueAccessor()) to get the current model property value.</param>
        /// <param name="allBindingsAccessor"> A JavaScript function that you can call to get all the model properties bound to this DOM element. Like valueAccessor, call it without any parameters to get the current bound model properties.</param>
        /// <param name="viewModel">The view model object that was passed to ko.applyBindings. Inside a nested binding context, this parameter will be set to the current data item (e.g., inside a with: person binding, viewModel will be set to person).</param>

        var configuration = valueAccessor();

        var accessDataItemText = !configuration.dataTextField
                                 ? function (dataItem) { return dataItem; }
                                 : function (dataItem) { return dataItem[configuration.dataTextField]; };
        var accessDataItemValue = !configuration.dataValueField
                                  ? function (dataItem) { return dataItem; }
                                  : function (dataItem) { return dataItem[configuration.dataValueField]; };
        var control = null;
        var controlDataSource = null;
        var valueToSet = configuration.value;
        var rebindValue = function (value) {
            value = value ? value : valueToSet;
            var total = controlDataSource.total();
            for (var itemIndex = 0; itemIndex < total; itemIndex++) {
                if (accessDataItemValue(controlDataSource.at(itemIndex)) == value) {
                    control.value(controlDataSource.at(itemIndex));
                    control.text(accessDataItemText(controlDataSource.at(itemIndex)));
                    return;
                }
            }
            control.value(null);
        };

        if (valueToSet != null) {
            if (ko.isObservable(valueToSet)) {
                valueToSet.subscribe(function (value) {
                    valueToSet = value;
                    rebindValue();
                });
                valueToSet = valueToSet();
            }
        }

		var unwrapDataSource = function (dataSource) {
			var dataArray = [];
			if (configuration.dataTextField || configuration.dataValueField) {
				for (var index = 0; index < dataSource.length; index++) {
					var dataItem = $.extend({}, dataSource[index]);
					if (configuration.dataTextField && ko.isObservable(dataItem[configuration.dataTextField]))
						dataItem[configuration.dataTextField] = dataItem[configuration.dataTextField]();
					if (configuration.dataValueField && ko.isObservable(dataItem[configuration.dataValueField]))
						dataItem[configuration.dataValueField] = dataItem[configuration.dataValueField]();
					dataArray.push(dataItem);
				}
			}
            else {
				dataArray = dataSource;
			}
			return dataArray;
		};
		
        if (ko.isObservable(configuration.dataSource)) {
            controlDataSource = new kendo.data.DataSource({ data: unwrapDataSource(configuration.dataSource()) });
            configuration.dataSource.subscribe(function (value) {
                controlDataSource.cancelChanges();
                control.value(null)
                controlDataSource.data([]);
                var dataArray = unwrapDataSource(value);
				for (var index = 0; index < dataArray.length; index++) {
					controlDataSource.add(dataArray[index]);
				}
                rebindValue();
            });
        } else if ($.isArray(configuration.dataSource)) {
			controlDataSource = new kendo.data.DataSource({ data: unwrapDataSource(configuration.dataSource) });
        } else {
            // Assuming that this data source is native kendo data source.
            controlDataSource = configuration.dataSource;
        }

        configuration.dataSource = controlDataSource;

        if (configuration.enable != undefined && configuration.enable != null) {
            configuration.enable = ko.utils.unwrapObservable(configuration.enable);
        }

        control = $(element).kendoComboBox($.extend({}, configuration, {
            value: null
        })).data("kendoComboBox");

		//bindEnable(control, configuration);
		bindIsBusy(control, configuration);
		
        rebindValue();

        if (configuration.value != null && ko.isObservable(configuration.value)) {
            control.bind("select", function (e) {
                if (!e)
                    configuration.value(null);

                configuration.value(e.item.index() == -1 ? null : accessDataItemValue(this.dataItem(e.item.index())));
            });
            control.bind("change", function (e) {
                if (!e)
                    configuration.value(null);

                configuration.value(this.selectedIndex == -1 ? null : accessDataItemValue(this.dataItem(this.selectedIndex)));
            });
        }

        bindEventHandlers(control, configuration.event);
		applyStyles($(control.element).parent(), configuration.css);
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var configuration = valueAccessor();
        var control = $(element).data("kendoComboBox");

        if (configuration.enable != undefined && configuration.enable != null) {
            control.enable(ko.utils.unwrapObservable(configuration.enable));
        }
    }
};