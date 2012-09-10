ko.bindingHandlers.kendoNumericTextBox = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		/// <summary>
		/// Method called right after binding ViewModel to element that has "kendoNumericTextBox" binding handler applied to it.
		/// </summary>
		/// <param name="element">The DOM element involved in this binding</param>
		/// <param name="valueAccessor">A JavaScript function that you can call to get the current model property that is involved in this binding. Call this without passing any parameters (i.e., call valueAccessor()) to get the current model property value.</param>
		/// <param name="allBindingsAccessor"> A JavaScript function that you can call to get all the model properties bound to this DOM element. Like valueAccessor, call it without any parameters to get the current bound model properties.</param>
		/// <param name="viewModel">The view model object that was passed to ko.applyBindings. Inside a nested binding context, this parameter will be set to the current data item (e.g., inside a with: person binding, viewModel will be set to person).</param>

		var configuration = valueAccessor();

		var control = null;
		var value = configuration.value;
		
		if (value != null) {
			if (ko.isObservable(value)) {
				value.subscribe(function (value) {
					control.value(value);
				});
				configuration.value = value();
			}
		}

		control = $(element).kendoNumericTextBox(configuration).data("kendoNumericTextBox");

		bindEnable(control, configuration);

		if (value != null && ko.isObservable(value)) {
			control.bind("change", function (e) {
				if (!e) {
					value(null);
				}
				value(this.value());
			});
		}

		bindEventHandlers(control, configuration.event);
		applyStyles($(control.element).parent().parent(), configuration.css);
	}
};