var SAMURAIPRINCIPLE = SAMURAIPRINCIPLE || {};

SAMURAIPRINCIPLE.eventDispatcher = function (base) {

	base.listenerMap = [];

	base.addEventListener = function(typeToRegister, listenerToRegister, priority) {
		if (!listenerToRegister) {
			listenerToRegister = typeToRegister;
			typeToRegister = 'default';
		}

		if (!priority) {
			priority = 1;
		}

		var result = base.listenerMap.filter(function(item) {
			return item.type === typeToRegister;
		});
		var priorityListener = {fn: listenerToRegister, priority : priority};
		if (result.length === 0) {
			var listenerList = [priorityListener];
			var listenerObject = {type: typeToRegister, listeners : listenerList};
			base.listenerMap.push( listenerObject );
		} else {
			result[0].listeners.push(priorityListener);
			//sort the listeners in priority order
			result[0].listeners.sort(function(first, second) {
				return second.priority - first.priority;
			});
		}
		

		
	};
	// base.listener = function(){
	//  	return base.listenerMap[0].listeners;
	// };

	base.dispatchEvent = function(type, arg){
		if (!arg) {
			arg = type;
			type = 'default';
		}

		for (var i =0 ; i < base.listenerMap.length ; i++){
			var listenerObject = base.listenerMap[ i ];
			if (listenerObject.type === type) {
				base.fireListeners( listenerObject, arg );
			}

			
		}
		
	};

	base.fireListeners = function( listenerObject, arg ){
		for ( var funcCnt = 0 ; funcCnt < listenerObject.listeners.length ; funcCnt ++){
			try{
				var continueFiring = listenerObject.listeners[ funcCnt ].fn.apply({},[arg]);	
				if (continueFiring===false) {
					break;
				}
			}catch(e){
				console.log("Error calling listener");
			}			
		}
	};

	base.createObservableProperty = function(name) {
		var value;
		base['on' + name + 'Changed'] = function(listener) {
			base.addEventListener('onBalanceChanged', listener);
		}

		base['set' + name] = function(bal) {
			value = bal;
			base.dispatchEvent('on' + name + 'Changed',bal )

		}

		base['get' + name] = function() {
			return value;
		}
	};
	// // host.runEvent(event) {
	// // 	notifyObervers(event);
	// // }
	// //method iterators over list of callback functions
	return base;


}