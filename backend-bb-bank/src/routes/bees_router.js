const express = require('express')
const router = express.Router()
const dao = require('./dao.js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const bodyParser = require('body-parser');
const options = {
  definition:{
   openapi:"3.1.0",
   info:{
     title:"Bees Bank APIs",
     version:"0.0.1",
     description:"Bees Bank APIs Swagger", 
     license:{
       name:"MIT",
       url:"https://spdx.org/licenses/MIT.html"
      },
     contact:{
       name:"Fikru Bedeke",
       email:"fikrubedeke@gmail.com"
    }
  },
  servers:[
    {
      "url": "https://fikru-bedeke-bb-bank-3s24l.ondigitalocean.app/",
      "description": "Development server"
    }
  ]
},
apis: ["./src/swagger/*.js"]
 
};


const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)


const swager = swaggerJsDoc(options);
router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swager,{ explorer: true }));

//return api documentation:swagger file:
router.get('/', (req, res) => {
  res.send('Welcome to Bees Bank')
})

//create account
router.get('/account/create', bodyParser.urlencoded({extended:false}), (req, res) => {
  dao.addUser(req.body.name, req.body.email, req.body.password)
  .then((result)=>{
   console.log("result from account/add call",result);
   if(result==null || result ==undefined || result==""){
     const err = {statusCode:404, statsMessage:"user not found", error:"while searching a user with givnen identifier, it was not found in the users tabel"};
     console.log(err);
     res.send(err);
   }else{
     res.send(result);
   }
    console.log(result);
  });
})

//login
router.get('/account/login/:email/:password', (req, res) => {
  dao.userLogin(req.params.email, req.params.password)
  .then((result)=>{
    console.log(result);
    res.send(JSON.stringify(result));
  });
})

//deposit
router.get('/account/deposit/:amnt/:email', (req, res) => {
  dao.deposit(req.params.amnt, req.params.email)
  .then((result)=>{
   console.log("result from account/deposit call",result);
   if(result==null || result ==undefined || result==""){
     const err = {statusCode:404, statsMessage:"user not found", error:"while searching a user with givnen identifier, it was not found in the users tabel"};
     console.log(err);
     res.send(err);
   }else{
    console.log(result);
     res.send(result);
   }
    console.log(result);
  });
})

//withdrwal
router.get('/account/withdraw/:amnt/:email', (req, res) => {
  dao.withdrwal(req.params.amnt, req.params.email)
  .then((result)=>{
   console.log("result from account/deposit call",result);
   if(result==null || result ==undefined || result==""){
     const err = {statusCode:404, statsMessage:"user not found", error:"while searching a user with givnen identifier, it was not found in the users tabel"};
     console.log(err);
     res.send(err);
   }else{
    console.log(result);
     res.send(result);
   }
    console.log(result);
  });
})

//balance inquiry
router.get('/account/balance/:email',function(req, res){
  dao.getAccountBalance(req.params.email)
  .then((result)=>{
    res.send(JSON.stringify(result));
  });
});

//alldata service
router.get('/account/alldata/:email', (req, res) => {
  dao.getAllData(req.params.email)
  .then((docs)=>{
      console.log("req param",req.params.email);
      res.send(docs);
  }).catch((err)=>{
    console.log(err);
  });
})

module.exports = router