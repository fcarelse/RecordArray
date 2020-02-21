app.controller('Main', ['$rootScope', '$scope', '$location', '$route', function ($rootScope, $scope, $location, $route) {

	// Passing global objects into angular's base scope.
	$rootScope.data = data;
	$rootScope.sys = sys;

	sys.pageDesc = {
		findBy: 'Find By Field',
		findByID: 'Find By ID',
		findByTag: 'Find By Tag',
	}

	$rootScope.$on('$routeUpdate',function(){
		console.log('Route update');
	})

	sys.goto = (page, section) => {
		// If only 1 string passed then break down like it is a path
		if(arguments.length == 1){
			[section, page] = page.match(/\/([^\/]+)\/([^\/]+)/);
			if(!page) return console.log('Bad path:', arguments[0]);
		}

		// If section argument is a string then find last match of tag within sections
		// Otherwise use section argument as the current secion record
		// Default to first section
		data.section = typeof section == 'string'?
			data.sections.reduce(
				(s, next)=>s.tag==section?s:next,
				data.sections[0]):
			section;

		// If page argument is a string then find last match of tag within section
		// Otherwise use page argument as the current page record
		// Default to first page in section
		data.page = typeof page == 'string'?
			data.pages[data.section.tag].reduce(
				(p, next)=>p.tag==page?p:next,
				data.pages[data.section.tag][0]):
			page;

		page.params = page.params || [];
		data.method = (data.page.tag=='intro'?
			'const RecordArray = require(\'recordarray\');':
			data.page.tag=='constructor'?
				'let recordArray = new RecordArray()':
				'RecordArray') + (data.page.type == 'classmethod'?
			`.${data.page.tag}(${data.page.params.join(', ')})`:
			data.page.type == 'method'?
				`.prototype.${data.page.tag}(${data.page.params.join(', ')})`:
				''
		);
		$location.path(`/${data.section.tag}/${data.page.tag}`);
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

	// Section Records
	data.sections = [
		{tag: 'class', name: 'Class'},
		{tag: 'reading', name: 'Reading'},
		{tag: 'changing', name: 'Changing'},
		{tag: 'CRUD', name: 'CRUD', hide: true},
		{tag: 'schema', name: 'Schemata', hide: true},
		{tag: 'filter', name: 'Filtering', hide: true},
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
			params: ['value', '[options]'], hide: true},
		{tag: 'findByTag', name: ' Find By Tag', type: 'method',
			params: ['value', '[options]'], hide: true},
		{tag: 'findOne', name: 'Find One By Field', type: 'method',
			params: ['field', 'value', '[options]']},
		{tag: 'findOneByID', name: 'Find One By ID', type: 'method',
			params: ['value', '[options]'], hide: true},
		{tag: 'findOneByTag', name: 'Find One By Tag', type: 'method',
			params: ['value', '[options]'], hide: true},
		{tag: 'matchBy', name: 'Match By Field', type: 'method',
			params: ['field', 'values']},
		{tag: 'matchByID', name: 'Match By ID', type: 'method',
			params: ['values'], hide: true},
		{tag: 'matchByTag', name: 'Match By Tag', type: 'method',
			params: ['values'], hide: true},
		{tag: 'indexBy', name: 'Index By Field', type: 'method',
			params: ['field', 'values']},
		{tag: 'indexByID', name: 'Index By ID', type: 'method',
			params: ['values'], hide: true},
		{tag: 'indexByTag', name: 'Index By Tag', type: 'method',
			params: ['values'], hide: true},
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

	// sys.goto(data.pages.class[0], data.sections[0])

	// $location.path('/class/constructor');
}]);