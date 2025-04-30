"use strict";

const database = require('@outlawdesigns/mysql-db');

class Record{
  constructor(databaseName,table,primaryKey,id){
    this.database = databaseName;
    this.table = table;
    this.primaryKey = primaryKey;
    this.id = id;
    if(!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASS){
      throw new Error('Cannot Initialize Record without required environmental variables: MYSQL_HOST, MYSQL_USER, MYSQL_PASS');
    }
    this.db = new database(
      process.env.MYSQL_HOST,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASS,
      this.database
    );
  }
  async init(){
    try{
      let data = await this.db.table(this.table).select('*').where(`${this.primaryKey} = ?`,[this.id]).execute();
      if (!data || data.length === 0) throw new Error(`No record found for ID: ${this.id}`);
      Object.assign(this,data[0]);
    }catch(err){
      throw err;
    }
    return this;
  }
  getPublicProperties(){
    let keys = this.publicKeys || Object.keys(this);
    return keys.reduce((obj,key)=>{
      if(this[key] !== undefined) obj[key] = this[key];
      return obj;
    },{});
  }
  static getDb(){
    return new database(
      process.env.MYSQL_HOST,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASS,
      this.database
    );
  }
  _buildDbObj(){
    let obj = {};
    this.publicKeys.forEach((key)=>{
      if(this[key] !== undefined){
        obj[key] = this[key];
      }
    });
    return obj;
  }
  async update(){
    let update = this._buildDbObj();
    try{
      let result = await this.db.table(this.table).update(update).where(`${this.primaryKey} = ?`,[this.id]).execute();
      return this.init();
    }catch(err){
      throw err;
    }
  }
  async create(){
    let insertion = this._buildDbObj();
    delete insertion[this.primaryKey];
    try{
      let result = this.db.table(this.table).insert(insertion).execute();
      let lastId = result.insertId;
      this.id = lastId;
      await this.init();
      return this;
    }catch(err){
      throw err;
    }
  }
  static truncate(){
    return this.getDb().table(this.table).truncate().execute();
  }
  static delete(targetId){
    return this.getDb().table(this.table).delete().where(`${obj.primaryKey} = ?`,[targetId]).execute();
  }
  static async getAll(){
    const allRows = await this.getDb().table(this.table).select('*').execute();
    return allRows.map((row)=>{
      const record = new this();
      record.id = row[this.primaryKey];
      record.table = this.table;
      record.database = this.database;
      record.db = this.db;
      for(let key in row){
        record[key] = row[key];
      }
      return record.getPublicProperties();
    });
  }
}

module.exports = Record;
