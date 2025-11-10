# NodeRecord

**NodeRecord** is a lightweight ORM-style data layer built on top of [`@outlawdesigns/mysql-db`](https://www.npmjs.com/package/@outlawdesigns/mysql-db).  
It provides an abstract `Record` class that can be extended to represent database entities as JavaScript classes, with built-in CRUD methods and automatic MySQL connection management.

---

## 🚀 Features

- 🗄️ Simple, class-based abstraction over raw MySQL queries  
- ⚙️ Automatic database connection setup using environment variables  
- 💾 Built-in CRUD helpers: create, update, delete, truncate, and getAll  
- 🔑 Extendable model pattern for defining your own records  
- 🔍 Converts database rows to public-safe objects easily

---

## 📦 Installation

```bash
npm install @outlawdesigns/db-record
```

---

## ⚙️ Requirements

`Record` requires the following **environment variables** to initialize database connections:

| Variable | Description |
|-----------|-------------|
| `MYSQL_HOST` | MySQL server host |
| `MYSQL_USER` | MySQL username |
| `MYSQL_PASS` | MySQL password |

If any of these are missing, the constructor will throw an error.

---

## 🧠 Concept

The `Record` class is designed to be **extended** for each database table.  
Each subclass defines its database, table, and primary key.

### Example

```js
"use strict";

const Record = require('@outlawdesigns/db-record');

class Person extends Record {
  constructor(id) {
    const database = 'example';
    const table = 'people';
    const primaryKey = 'id';
    super(database, table, primaryKey, id);
    this.publicKeys = [
      'firstName',
      'lastName',
      'favorite_color',
      'isAlive'
    ];
  }
}
```

### Notes
- `publicKeys` defines which properties will be exposed when calling `getPublicProperties()`.
- Always call `super()` inside the constructor with the proper arguments.

---

## 🧩 Constructor

```js
new Record(database, table, primaryKey, id)
```

| Parameter | Description |
|------------|-------------|
| `database` | Name of the database |
| `table` | Table name |
| `primaryKey` | Primary key column name |
| `id` | Optional record identifier |

---

## 🧱 Methods

### `async init()`
Loads record data from the database using the supplied `id`.  
Throws an error if no record is found.

### `getPublicProperties()`
Returns a filtered object containing only the keys listed in `publicKeys` (or all keys if none are defined).

### `async create()`
Inserts a new record into the table using the current property values.  
Automatically sets the new `id` and re-initializes the instance.

### `async update()`
Updates the existing database record corresponding to `this.id` with the current property values.

### `static truncate()`
Truncates (clears) the table defined by the subclass.

### `static delete(targetId)`
Deletes a record by its primary key value.

### `static async getAll()`
Retrieves all rows from the table and returns an array of public objects.

### `static getDb()`
Creates and returns a new instance of the underlying database connection.

### `_buildDbObj()`
Builds a plain object containing only the `publicKeys` and their current values.

---

## 💡 Example Usage

```js
(async () => {
  const person = new Person(1);
  await person.init();
  console.log(person.getPublicProperties());

  person.favorite_color = 'blue';
  await person.update();

  const newPerson = new Person();
  newPerson.firstName = 'Ada';
  newPerson.lastName = 'Lovelace';
  newPerson.isAlive = false;
  await newPerson.create();
})();
```

---

## 🧾 License

This project is licensed under the [ISC License](./LICENSE).

---

## 👤 Author

Maintained by **Outlaw Designs**  
[https://github.com/outlawdesigns-io](https://github.com/outlawdesigns-io)
