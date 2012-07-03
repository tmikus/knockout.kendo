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