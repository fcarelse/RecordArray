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
		data.section = section;
		page.params = page.params || [];
		data.title = 'RecordArray' + (data.page.type == 'classmethod'?
			`.${data.page.tag}(${data.page.params.join(', ')})`:
			data.page.type == 'method'?
				`.prototype.${data.page.tag}(${data.page.params.join(', ')})`:
				''
		) + ' - ' + data.page.name;
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
		{tag: 'reading', name: 'Reading'},
		{tag: 'changing', name: 'Changing'},
		{tag: 'CRUD', name: 'CRUD'},
		{tag: 'schema', name: 'Schemata'},
		{tag: 'filter', name: 'Filtering'},
	];

	data.pages = {};

	data.pages.class = [
		{tag: 'intro', name: 'Introduction', notMethod: true},
		{tag: 'constructor', name: 'Constructor'},
		{tag: 'compare', name: 'Compare', type: 'classmethod',
			params: ['record1', 'record2', 'options']},
		{tag: 'compareRecords', name: 'Compare Records', type: 'classmethod',
			params: ['recordArray1', 'recordArray2', 'options']},
	];

	data.pages.reading = [
		{tag: 'findBy', name: 'Find By Field', type: 'method',
			params: ['field', 'value', '[options]']},
		{tag: 'findByID', name: 'Find By ID', type: 'method',
			params: ['value', '[options]']},
		{tag: 'findByTag', name: ' Find By Tag', type: 'method',
			params: ['value', '[options]']},
		{tag: 'findOne', name: 'Find One By Field', type: 'method',
			params: ['field', 'value', '[options]']},
		{tag: 'findOneByID', name: 'Find One By ID', type: 'method',
			params: ['value', '[options]']},
		{tag: 'findOneByTag', name: 'Find One By Tag', type: 'method',
			params: ['value', '[options]']},
		{tag: 'matchBy', name: 'Match By Field', type: 'method',
			params: ['field', 'values']},
		{tag: 'matchByID', name: 'Match By ID', type: 'method',
			params: ['values']},
		{tag: 'matchByTag', name: 'Match By Tag', type: 'method',
			params: ['values']},
		{tag: 'indexBy', name: 'Index By Field', type: 'method',
			params: ['field', 'values']},
		{tag: 'indexByID', name: 'Index By ID', type: 'method',
			params: ['values']},
		{tag: 'indexByTag', name: 'Index By Tag', type: 'method',
			params: ['values']},
	];

	data.pages.changing = [
		{tag: 'sortBy', name: 'Sort By Field', type: 'method',
			params: ['[field [order]]+']},
		{tag: 'sortASC', name: 'Sort Ascending', type: 'method',
			params: ['field', '[options]']},
		{tag: 'sortDESC', name: 'Sort Descending', type: 'method',
			params: ['field', '[options]']},
		{tag: 'extend', name: 'Extend RecordArray with another updating fields in records with matching IDs', type: 'method',
			params: ['recordArray', '[options]']},
		{tag: 'merge', name: 'Merge RecordArrays replacing records with a field marked as unique or ID', type: 'method',
			params: ['recordArray1', 'recordArray2,...', 'recordArrayN']},
	];

	sys.goto(data.pages.class[0], data.sections[0])

}]);