
# NodeRecord

`Record` is an extension of <a href="https://github.com/outlawdesigns-io/NodeDb">NodeDb</a>.

`Db` builds and executes queries while Record provides an abstract class that can be extended to represent generic database records.

## Requirements

`Record` will attempt to automatically supply `host`,`username`, and `password` values to its underlying database connection by checking:
* `global.config[process.env.NODE_ENV].DBHOST`
* `global.config[process.env.NODE_ENV].DBUSER`
* `global.config[process.env.NODE_ENV].DBPASS`.

While `Record` is abstract, its constructor should be called in the constructor of all child classes. Its constructor accepts 3 required parameters and one optional parameter.
#### Example child constructor
```
constructor(db,table,primaryKey,id)

/*
db: Database Name
table: Database Table
primaryKey: The name of the record's primary key field.
id: The unique identifier of the specific record you would like to construct.
*/
```


## Usage

When extending Record, it is important to note that all values in the `publicKeys` array should correspond to their database column names.

```

"use strict";

const Record = require('outlawdesigns.io.noderecord');

class Person extends Record{
  constructor(id){
    const database = 'example';
    const table = 'people';
    const primaryKey = 'id';
    super(database,table,primaryKey,id);
    this.publicKeys = [
      'firstName',
      'lastName',
      'favorite_color',
      'isAlive'
    ];  
  }
}

```

## Methods

### _create()

Save object to database.

### _update()

Save changes made to the properties of an object instantiated with and Id.

### _build()

### _getId()

### _buildPublicObj()

### _buildPublicObj()

### _getTehDate()
