ko.bindingHandlers.kendoDatePicker = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		/// <summary>
		/// Method called right after binding ViewModel to element that has "kendoDatePicker" binding handler applied to it.
		/// </summary>
		/// <param name="element">The DOM element involved in this binding</param>
		/// <param name="valueAccessor">A JavaScript function that you can call to get the current model property that is involved in this binding. Call this without passing any parameters (i.e., call valueAccessor()) to get the current model property value.</param>
		/// <param name="allBindingsAccessor"> A JavaScript function that you can call to get all the model properties bound to this DOM element. Like valueAccessor, call it without any parameters to get the current bound model properties.</param>
		/// <param name="viewModel">The view model object that was passed to ko.applyBindings. Inside a nested binding context, this parameter will be set to the current data item (e.g., inside a with: person binding, viewModel will be set to person).</param>

		var configuration = $.extend({
			animation: false,
			css: {},
			depth: "month",
			enable: true,
			event: {
				change: null,
				close: null,
				open: null
			},
			format: "MM/dd/yyyy",
			max: new Date(2099, 11, 31),
			min: new Date(1900, 0, 1),
			start: "month",
			value: null
		}, valueAccessor());

		var control = null;
		var valueToSet = configuration.value;
		
		if (valueToSet != null) {
			if (ko.isObservable(valueToSet)) {
				valueToSet.subscribe(function (value) {
					control.value(value);
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

		control = $(element).kendoDatePicker({
			animation: configuration.animation,
			depth: configuration.depth,
			format: configuration.format,
			max: configuration.max,
			min: configuration.min,
			start: configuration.start,
			value: valueToSet
		}).data("kendoDatePicker");

		if (configuration.value != null && ko.isObservable(configuration.value)) {
			control.bind("change", function (e) {
				if (!e) {
					configuration.value(null);
				}

				configuration.value(this.value());
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