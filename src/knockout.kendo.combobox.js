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

		var configuration = $.extend({
			animation: false,
			css: {},
			dataSource: [],
			dataTextField: null,
			dataValueField: null,
			enable: true,
			event: {
				change: null,
				close: null,
				open: null,
				select: null
			},
			filter: "startswith",
			height: 500,
			highLightFirst: true,
			ignoreCase: true,
			minLength: 1,
			placeholder: "",
			separator: "",
			suggest: false,
			value: null
		}, valueAccessor());

		var accessDataItemText = configuration.dataTextField == null ? function (dataItem) { return dataItem; } : function (dataItem) { return dataItem[configuration.dataTextField]; };
		var accessDataItemValue = configuration.dataValueField == null ? function (dataItem) { return dataItem; } : function (dataItem) { return dataItem[configuration.dataValueField]; };
		var control = null;
		var controlDataSource = null;
		var setValue = function (value) {
			var count = controlDataSource.total();
			for (var index = 0; index < count; index++) {
				if (accessDataItemValue(controlDataSource.at(index)) == value) {
					control.value(ko.utils.unwrapObservable(accessDataItemText(controlDataSource.at(index))));
					break;
				}
			}
		};
		var valueToSet = configuration.value;

		if (valueToSet != null) {
			if (ko.isObservable(valueToSet)) {
				valueToSet.subscribe(function (value) {
					setValue(value);
				});
				valueToSet = valueToSet();
			}
		}
		var enable = configuration.enable;
		if (ko.isObservable(enable)) {
			enable.subscribe(function (newValue) {
				control.enable(newValue);
			});
			enable = configuration.enable();
		}

		if (ko.isObservable(configuration.dataSource)) {
			controlDataSource = new kendo.data.DataSource({ data: configuration.dataSource().map(function(val){
					if(ko.isObservable(accessDataItemText(val)))
					{
						var text = accessDataItemText(val)();
						if(configuration.dataTextField == null){
							return text;
						}else{
							var obj = {};
							obj[configuration.dataTextField] = text;
							return $.extend({},val,obj);
						}
					}
				}) 
			});
			configuration.dataSource.subscribe(function (value) {
				controlDataSource.cancelChanges();
				for (var index = 0; index < value.length; index++) {
					controlDataSource.add(value[index]);
				}
				setValue(valueToSet);
			});
		} else if ($.isArray(configuration.dataSource)) {
			controlDataSource = new kendo.data.DataSource({ data: configuration.dataSource });
		} else {
			// Assuming that this data source is native kendo data source.
			controlDataSource = configuration.dataSource;
		}

		control = $(element).kendoComboBox({
			animation: configuration.animation,
			dataSource: controlDataSource,
			dataTextField: configuration.dataTextField,
			enable: enable,
			filter: configuration.filter,
			height: configuration.height,
			highlightFirst: configuration.highlightFirst,
			ignoreCase: configuration.ignoreCase,
			minLength: configuration.minLength,
			placeholder: configuration.placeholder,
			separator: configuration.separator,
			suggest: configuration.suggest
		}).data("kendoComboBox");

		setValue(valueToSet);

		if (configuration.value != null && ko.isObservable(configuration.value)) {
			control.bind("select", function (e) {
				if (!e) {
					configuration.value(null);
				}

				var currentItem = e.item[0];
				var itemsCollection = control.ul[0].children;
				var itemsCount = itemsCollection.length;
				for (var index = 0; index < itemsCount; index++) {
					if (currentItem == itemsCollection[index]) {
						configuration.value(accessDataItemValue(control._data()[index]));
						break;
					}
				}
			});
		}

		if (configuration.event.change != null) {
			control.bind("change", configuration.event.change);
		}
		if (configuration.event.close != null) {
			control.bind("close", configuration.event.close);
		}
		if (configuration.event.open != null) {
			control.bind("open", configuration.event.open);
		}
		if (configuration.event.select != null) {
			control.bind("select", configuration.event.select);
		}

		var controlElement = $(control.element).parent();

		for (var className in configuration.css) {
			var classValue = configuration.css[className];
			if (ko.isObservable(classValue)) {
				classValue() ? controlElement.addClass(className) : controlElement.removeClass(className);
				classValue.subscribe(function (value) {
					value ? controlElement.addClass(className) : controlElement.removeClass(className);
				});
			} else {
				classValue ? controlElement.addClass(className) : controlElement.removeClass(className);
			}
		}
	}
};