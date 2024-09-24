"use strict";

class Record{

    constructor(db,table,primaryKey,id){
        const database = require('outlawdesigns.io.nodedb');
        // const config = require('./config');
        this.database = db;
        this.table = table;
        this.primaryKey = primaryKey;
        this.id = id;
        this.db = new database(
          global.config[process.env.NODE_ENV].DBHOST,
          global.config[process.env.NODE_ENV].DBUSER,
          global.config[process.env.NODE_ENV].DBPASS,
          this.database
        );
    }
    async init(){
      try{
        let data = await this.db.table(this.table).select('*').where(this.primaryKey + "= '" + this.id + "'").execute();
        let keys = Object.keys(data[0]);
        keys.forEach((key)=>{
          this[key] = data[0][key];
        });
      }catch(err){
        throw err;
      }
      return this;
    }
    getPublicProperties(){
      let obj = {};
      this.publicKeys.forEach((key)=>{
        obj[key] = this[key];
      });
      return obj;
    }
    async _getId(){
      try{
        return await this.db.table(this.table).select(this.primaryKey).orderBy(this.primaryKey + " desc limit 1").execute();
      }catch(err){
        throw err;
      }
    }
    async _getAll(){
      try{
        return await this.db.table(this.table).select(this.primaryKey).execute();
      }catch(err){
        throw err;
      }
    }
    static _getTehDate(){
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        if(month <= 9){
            month = '0' + month;
        }
        return year + "-" + month + "-" + day;
    }
    _buildDbObj(){
        let obj = {};
        this.publicKeys.forEach((key)=>{
          if(this[key] !== null && this[key] !== undefined){
            obj[key] = this[key];
          }
        });
        return obj;
    }
    async update(){
      let update = this._buildDbObj();
      try{
        let result = await this.db.table(this.table).update(update).where(this.primaryKey + "= '" + this.id + "'").execute();
        return this.init();
      }catch(err){
        throw err;
      }
    }
    async create(){
      let insertion = this._buildDbObj();
      delete insertion[this.primaryKey];
      try{
        await this.db.table(this.table).insert(insertion).execute();
        let lastId = await this._getId();
        this.id = lastId[0][this.primaryKey];
         await this.init();
         return this;
      }catch(err){
        throw err;
      }
    }
    static truncate(){
      let obj = new this();
      return obj.db.table(obj.table).truncate().execute();
    }
    static delete(targetId){
      let obj = new this();
      return obj.db.table(obj.table).delete().where(obj.primaryKey + ' = ' + targetId).execute();
    }
    static async getAll(){
      let currentObj = new this();
      let records = [];
      let ids = await currentObj._getAll();
      for(let id in ids){
        let obj = await new this(ids[id][currentObj.primaryKey]).init();
        records.push(obj.getPublicProperties());
      }
      return records;
    }    
}

module.exports = Record;
