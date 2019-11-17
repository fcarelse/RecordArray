# RecordArray
Extension of Javascript Array class with record handling
> **Note:** Further information on https://recordarray.js.ie/

## **Usage:**
 ```javascript
const RecordArray = require('recordarray');

const users = RecordArray([
	{id: 1, name: 'Admin', type: 'admin'},
	{id: 2, name: 'Bob', type: 'guest'},
	{id: 3, name: 'Sam', type: 'guest'}
]);

console.log( 'User with ID 1 = ', users.findOneByID(1).name );
// Output: "Admin"

console.log( 'Guest Users Reverse Alphabetically = ', users
	.findBy('type', 'guest')
	.sortBy('name','DESC')
	.listValues('name')
	.join(', ') );
// Output: "Sam, Bob"

```


## class methods
- compare
- compareRecords

### compare
### compareRecords

## object methods
As this class extends the base Array class it inherits all methods from that class, but may need these alternatives to work with an array of records via their fields.

### Retrieval methods
#### Record Retrieval
- findBy
- findByID
- findByTag
- findOne
- findOneByID
- findOneByTag
- matchBy
- matchByID
- matchByTag
- unique
- uniqueBy
- clone
- toArray
- listValues
- getName
- getTag
- indexBy
- indexByID
- indexByTag

### Mutation methods
- sortBy
- sortASC
- sortDESC
- extend
- merge

### CRUD methods
- create
- read
- update
- delete
- list
