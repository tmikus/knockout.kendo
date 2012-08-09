function applyStyles(control, cssConfiguration) {
	/// <summary>
	/// Binds classes to control.
	/// </summary>
	/// <param name="control">Instance of jQuery pointer to control.</param>
	/// <param name="cssConfiguration">Css configuration.</param>
	
	for (var className in cssConfiguration) {
		var classValue = cssConfiguration[className];
		if (ko.isObservable(classValue)) {
			classValue() ? control.addClass(className) : control.removeClass(className);
			classValue.subscribe(function (value) {
				value ? control.addClass(className) : control.removeClass(className);
			});
		} else {
			classValue ? control.addClass(className) : control.removeClass(className);
		}
	}
}

function bindEventHandlers(control, events) {
	/// <summary>
	/// Binds all event handlers to specified control.
	/// </summary>
	/// <param name="control">Instance of control to which bind events.</param>
	/// <param name="events">Object containing map of events to bind.</param>
	
	for (var event in events) {
		control.bind(event, events[event])
	}
}

function bindEnable(control, configuration) {
	/// <summary>
	/// Binds handling of "enable" property to control.
	/// </summary>
	/// <param name="control">Instance of kendo control to which bind "enable" handling.</parma.
	/// <param name="configuration">Configuration used for control's creation.</param>
	
	var enable = configuration.enable;
	if (ko.isObservable(enable)) {
		enable.subscribe(function (newValue) {
			control.enable(newValue);
		});
		enable = configuration.enable();
	}
	
	control.enable(enable);
}

function bindIsBusy(control, configuration) {
	/// <summary>
	/// Binds handling of "isBusy" property to control.
	/// </summary>
	/// <param name="control">Instance of kendo control to which bind "is busy" handling.</parma.
	/// <param name="configuration">Configuration used for control's creation.</param>
	
	if (configuration.isBusy == null)
		return;
	
	if (!ko.isObservable(configuration.isBusy))
		throw "ComboBox'es IsBusy must be observable!";
	
	configuration.isBusy.subscribe(function (value) {
		if (value) {
			control.enable(false);
			control._busy = null;
			control._showBusy();
		}
		else {
			control._hideBusy();
			control.enable(true);
		}
	});
}