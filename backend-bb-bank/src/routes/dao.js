//const { MongoClient } = require('mongodb');
//const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    
    const {
      //MONGO_USERNAME,
      //MONGO_PASSWORD,
      MONGO_HOSTNAME,
      //MONGO_PORT,
      MONGO_DB
    } = process.env;

 
    //const client = new MongoClient(url);
    //const dbName = 'usersAccount';


/*const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500, 
  connectTimeoutMS: 10000,
};*/



/*mongoose.connect(url).then( function() {
  console.log('MongoDB is connected');
})
  .catch( function(err) {
  console.log(err);
});*/

//const capdb = new MongoClient(url);
//const dbName = 'usersAccount';
//const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`;
const URL = `${MONGO_HOSTNAME}`;
const mongoclient = new MongoClient(URL);

async function addUser(usrname, usremail, usrpwd) {
  //const balance = 100;
  
  let user={};
  try{
    const conn = await mongoclient.connect();
    const db = conn.db(MONGO_DB);
    const usrAddedDate = new Date(Date.now());

    const ucoll = db.collection('bb_users_account');
    const userscoll = await ucoll.find().toArray();
    const ui = userscoll.findIndex(idx => idx.email===usremail);
    if(ui>=0){
      user = {statusCode:400, statsMessage:"existing user", error:"user email ID alerady exists in the users table"};
      console.log("existing usere");
    } else{
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(usrpwd, salt);
      const insert = {name:usrname, email:usremail, password:secPass, usrAddedDate:usrAddedDate.toISOString()};
      const tmp = await  ucoll.insertOne(insert)
       .then(()=>{
         console.log('inserting',user);
         user={statusCode:200, statusMessage:"User added successfully"};
       }).catch((err)=>{
         console.log('error', err);
         user={statusCode:500, statusMessage:"Exception encountered", error:err};
       }).finally(()=>{
        conn.close();
        console.log('connection closed');
       });
    }
  }catch(err){
    user={statusCode:500, statusMessage:"Exception encountered", error:err};
  }
return user;
}
 
//login
async function userLogin(usremail, usrpwd) {
  //const conn = await capdb.connect();
  console.log('user service triggered');
  //const db = conn.db(dbName);
  //find a user email, pwd
    let user = {};
    try{
      const conn = await mongoclient.connect();
      const db = conn.db(MONGO_DB);
      const loginColl= db.collection('bb_users_account');
      const users = await loginColl.find().toArray();
      const uIdx = users.findIndex(idx => idx.email===usremail);
      console.log(uIdx);
      if (uIdx>=0){
        user = users[uIdx];
        const passwordCompare = await bcrypt.compare(usrpwd, user.password);
        if(passwordCompare){
          user.statusCode=200;
          user.statusMessage="success";
        } else{
          user = {statusCode:400, statsMessage:"user password didn't match", error:"user password mismatch"};
        }
      }else if(uIdx<0){
        user = {statusCode:404, statsMessage:"user not found", error:"user not found in the users table"};
        console.log("dao elese condition:user not found");
      }
      conn.close();
    }catch(err){
      console.log("error when searching a user", err);
       user={statusCode:500, statusMessage:"Exception encountered", error:"unexpected exception encountered, please reach help desk for support"};
    }
  return user;
}
///end login

///start deposit
async function deposit(amnt, uemail) {
  //const balance = 100;
  const depositDate = new Date(Date.now());
  //const conn = await capdb.connect();
  console.log('deposity inquiry triggered');
  let status={};
  try{
    const conn = await mongoclient.connect();
    const db = conn.db(MONGO_DB);
    const dpoColl = db.collection('bb_users_account');
    const usrcoll = await dpoColl.find().toArray();
    //console.log("user email", uemail);
    const ui = usrcoll.findIndex(idx => idx.email.trim().toString()===uemail.trim().toString());
    if(ui>=0){
       const udata = {d_name:uemail, d_amount:amnt, d_dateTime:depositDate.toISOString()};
       const tmp = await  dpoColl.insertOne(udata)
          .then(async (result)=>{
             console.log('deposit submission response');
             console.log(result);
             status={statusCode:200, statusMessage:"Deposit is successful", depositAmount:amnt};
          }).catch((err)=>{
            console.log('error', err);
            status={statusCode:500, statusMessage:"Exception encountered", error:"processing error encountered"};
          });
        const bcoll = db.collection("bb_users_balance");
        const bArr = await bcoll.find().toArray();
        const bIx = bArr.findIndex(bIdx => bIdx.o_name===uemail);
        if(bIx>=0){
          bcoll.updateOne({o_name:uemail}, {$inc:{o_balance:parseInt(amnt)}},{upsert:true,w:1}, function(err, doc){
            if(err){
             console.log(err);
             }
             //console.log(doc);
             conn.close();
          });
         } else{
          //inser new value:
          bcoll.insertOne({o_name:uemail, o_balance:parseInt(amnt)},function(err, result){
            if(err){
              console.log(err);
            } else{
              console.log("inserted to balance table");
              console.log(result);
            }
             db.close();
          });
         } 
       }
    else{
        status={statusCode:404, statusMessage:"user not found", error:"search query did not find user in the users list"};
        }
  }catch(err){
    console.log(err);
    status={statusCode:500, statusMessage:"Exception encountered", error:"try catch exception: unexpected exception encountered, please reach help desk for support"};
    
  }
  return status;
}

////////////////////end deposit

///////////////////start withdrawal
async function withdrwal(amnt, uemail) {
  //const balance = 100;
  const withDarwalDate = new Date(Date.now());
  //const conn = await capdb.connect();
  console.log('withdrawal endpoint triggered');
  let status={};
  let withData={};
  const handleWithdCall=(dbrsp)=>{
    console.log(dbrsp);

  }
  try{
        //const db = conn.db(dbName);
        const conn = await mongoclient.connect();
        const db = conn.db(MONGO_DB);
        const with_coll = db.collection('bb_users_withdrawal');
        //const wArr = await witt_coll.find().toArray();
        withData= {withdrwal_name:uemail, withdrwal_amount:amnt, withdreal_dateTime:withDarwalDate.toISOString()};
        with_coll.insertOne(withData)
        .then(async (result)=>{
            console.log('withdrwal submission response');
            console.log(result);
            status={statusCode:200, statusMessage:"withdrwal is successful", withdrwalAmount:amnt};
          })
          .catch((err)=>{
            console.log('error', err);
            status={statusCode:500, statusMessage:"Exception encountered", error:"processing error encountered"};
          });
        const bcoll=db.collection("bb_users_balance");
        const bArr = await bcoll.find().toArray();
        const bIx = bArr.findIndex(bIdx => bIdx.o_name===uemail);
        if(bIx>=0){
          if((bArr[bIx].o_balance>parseInt(amnt))){
            bcoll.updateOne({o_name:uemail}, {$inc:{o_balance:-parseInt(amnt)}},{upsert:true,w:1})
            .then(async (result)=>{
              console.log('balance updated');
              console.log(result);
              status={statusCode:200, statusMessage:"withdrwal is successful", remainingBalance:await bArr[bIx].o_balance};
              conn.close();
            })
            .catch((err)=>{
              console.log('error', err);
              status={statusCode:500, statusMessage:"Exception encountered", error:"processing error encountered"};
              conn.close();
            });
           } else {status={statusCode:400, statusMessage:"insufficient balance", error:"insufficient balance in the account"};}
         } else{
          status={statusCode:400, statusMessage:"balance not available", error:"balance not found in the balance table"};
         }
         conn.close();
  }catch(err){
    status={statusCode:500, statusMessage:"Exception encountered", error:"from try catch: exceptions encountered. please call to help desk"};
    
  }
  console.log("printing status");
  console.log(status);
  return status;
}
////////////////////end withdrawal
//account balance:
async function getAccountBalance(usremail) {
  //onst conn = await capdb.connect();
  console.log('account service triggered');
  //const db = conn.db(dbName);
  //find a user email, pwd
    let user = {};
    try{
      const conn = await mongoclient.connect();
      const db = conn.db(MONGO_DB);
      const users_b = await db.collection('bb_users_balance').find().toArray();
      const uIdx = users_b.findIndex(idx => idx.o_name===usremail);
      if (uIdx>=0){
        user.statusCode=200;
        user.statusMessage="success";
        user.accountOwner=users_b[uIdx].o_name;
        user.accountBalance=users_b[uIdx].o_balance;
      }else if(uIdx<0){
        user = {statusCode:404, statsMessage:"balance not found", error:"user not found in the balance table"};
        console.log("dao elese condition:user not found");
      }
    }catch(err){
      console.log("error when searching a user", err);
       user={statusCode:500, statusMessage:"Exception encountered", error:"unexpected exception encountered, please reach help desk for support"};
    }
  return user;
}

async function getAllData(uemail) {
  console.log("inside all data service");
   let alldata ={accountInfo:null,balance:null, deposit:[],withdrwal:[]};
   let status ={};
   let index;
   try{
    //const conn = await capdb.connect();
    //const db = conn.db(dbName);
    const conn = await mongoclient.connect();
    const db = conn.db(MONGO_DB);

    const acc_data = await db.collection('bb_users_account').find().toArray();
    const ui = acc_data.findIndex(idx => idx.email===uemail);
    index=ui;
    console.log("user table, user index", ui);
    if(ui>=0){
       alldata.accountInfo= acc_data[ui];
       const bal_data = await db.collection("bb_users_balance").find().toArray();
       bal_data.map((elm, i)=>{
         if(elm.o_name===uemail){alldata.balance=elm;}
        }); 
       const dpo_data = await db.collection('bb_users_deposit').find().toArray();
       dpo_data.map((item, i)=>{
        if(item.d_name===uemail){alldata.deposit.push(item);}
       });
       const wit_data = await  db.collection('bb_users_withdrawal').find().toArray();
       wit_data.map((itm, i)=>{
        if(itm.withdrwal_name===uemail){alldata.withdrwal.push(itm)};
       }); 
  
      }
    else{
        status={statusCode:404, statusMessage:"user not found", error:"search query did not find user in the users list"};
        }
  }catch(err){
       status={statusCode:500, statusMessage:"Exception encountered", error:"processing error encountered"};
    }
  if(index>=0){index=-1; return JSON.stringify(alldata)}else{return status;}
  
  }
  
  module.exports = {addUser,getAllData, userLogin, deposit, withdrwal, getAccountBalance};