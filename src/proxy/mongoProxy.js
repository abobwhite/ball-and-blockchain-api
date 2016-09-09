/**
* Proxy used to connect and perform operations in the Mongo configuration database
*/
import mongodb from "mongodb";

let __url = "";
export default class MongoProxy {

   constructor(url) {
       __url = url;
   }

   get url() {
       return __url;
   }

   set url(url){
       __url = url;
   }

   getConnection() {
       const mongoClient = mongodb.MongoClient;

       return new Promise((resolve, reject) => {
           mongoClient.connect(this.url, (err, connection) => {
               if(err) {
                   reject(err);
               } else {
                   resolve(connection);
               }
           });

       });
   }

   insert(collectionName, collectionObjects) {
       return new Promise((resolve, reject) => {
           this.getConnection().then((result) => {
               const db = result;
               const targetCollection = db.collection(collectionName);
               targetCollection.insertMany(collectionObjects).then((result) => {
                   db.close();
                   resolve(result);
               }).catch((error) => {
                   db.close();
                   reject(error);
               });
           }).catch((error) => {
               reject(error);
           });
       });
   }

   find(collectionName, params={}) {
       return new Promise((resolve, reject) => {
           this.getConnection().then((db) => {
               const targetCollection = db.collection(collectionName);
               const data = targetCollection.find(params);

               let docs = [];
               data.each((err, doc) => {
                   if(err !== null) {
                       reject(err);
                       return;
                   }
                   if (doc !== null) {
                       docs.push(doc);
                   } else {
                       resolve(docs);
                   }
              });
           }).catch((error) => {
               reject(error);
           });
       });
   }

   createIndex(collectionName, indexObj) {
       return new Promise((resolve, reject)=> {
           this.getConnection().then((db) => {
               const targetCollection = db.collection(collectionName);
               targetCollection.createIndex(
                   indexObj,
                   null,
                   (err, results) => {
                       if(err !== null) {
                           reject(err);
                       }
                       resolve(results);
                   }
               );
           });
       });
   }

   deleteMany(collectionName, params={}) {
       return new Promise((resolve, reject) => {
           this.getConnection().then((db) => {
               const targetCollection = db.collection(collectionName);

               targetCollection.deleteMany(params, (err, results) => {
                   if(err !== null) {
                       reject(err);
                   }
                   resolve(results);
               });

           }).catch((error) => {
               reject(error);
           });
       });
   }

   deleteThenInsert(collectionName, deleteParams, insertObjects, rollback=true) {
       return new Promise((resolve, reject)=>{

           // don't do anything if the data is empty
           if(insertObjects.length == 0) {
               resolve({result: {n:0}});
               return;
           }

           const action = () =>{
               this.deleteMany(collectionName, deleteParams).then((result)=> {
                   this.insert(collectionName, insertObjects).then((result)=> {
                       resolve(result);
                   }).catch((err)=> {
                       if (rollback) {
                           // insert the deleted items back into the db
                           this.insert(collectionName, dataBeforeDelete).then((result)=> {
                               reject(err);
                           }).catch((err2)=> {
                               reject(err, err2);
                           });
                           return;
                       }
                       reject(err);
                   });
               }).catch((err)=> {
                   reject(err);
               });
           };


           let dataBeforeDelete = [];
           if(rollback) {
               this.find(collectionName).then((result)=>{
                   dataBeforeDelete = result;
                   action();
               }).catch((err)=>{
                   reject(err);
               });
               return;
           }

           action();
       });
   }
};

