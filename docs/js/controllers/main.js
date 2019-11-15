app.controller('Main', ['$rootScope', '$scope', function ($rootScope, $scope) {

	// Passing global objects into angular's base scope.
	$rootScope.data = data;
	$rootScope.sys = sys;

	sys.pageDesc = {
		findBy: 'Find By Field',
		findByID: 'Find By ID',
		findByTag: 'Find By Tag',
	}

	sys.goto = (page, section) => {
		data.page = page;
		data.sectionName = section.name;
	}

	var applyQueued;
	$rootScope.safeApply = sys.safeApply = function(){
		if(!$rootScope.$$phase){
			$rootScope.$apply();
			applyQueued = false;
		}
		else {
			if(!applyQueued) setTimeout(sys.safeApply, 1000);
			applyQueued = true;
		}
	};

	data.sections = [
		{tag: 'class', name: 'Class'},
		{tag: 'finding', name: 'Retrieval'},
		{tag: 'ordering', name: 'Manipulation'},
		{tag: 'CRUD', name: 'CRUD'},
		{tag: 'schema', name: 'Schemata'},
		{tag: 'filter', name: 'Filtering'},
	];

	data.pages = {};

	data.pages.class = [
		{tag: 'intro', name: 'Introduction', notMethod: true},
		{tag: 'constructor', name: 'Constructor'},
	];

	data.pages.finding = [
		{tag: 'findBy', name: 'Find By Field'},
		{tag: 'findByID', name: 'Find By ID'},
		{tag: 'findByTag', name: ' Find By Tag'},
		{tag: 'findOne', name: 'Find One By Field'},
		{tag: 'findOneByID', name: 'Find One By ID'},
		{tag: 'findOneByTag', name: 'Find One By Tag'},
		{tag: 'matchBy', name: 'Match By Field'},
		{tag: 'matchByID', name: 'Match By ID'},
		{tag: 'matchByTag', name: 'Match By Tag'},
	];

	data.page = data.pages.class[0];

}]);