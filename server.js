 var BoxSDK = require('box-node-sdk');
 var Box = require('node-box-api');
var jwt = require('jsonwebtoken');
var pg = require('pg');
var Sequelize=require ('sequelize');
var app  = require('express')();// Express App include
var path = require('path');
var http = require('http').Server(app); // http server
var env = app.get('env') == 'development' ? 'dev' : app.get('env');
pg.defaults.ssl = process.env.DATABASE_URL != undefined;
var port = process.env.PORT || 8000;
var bodyParser = require("body-parser");// Body parser for fetch posted data
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var multiparty = require('connect-multiparty');
var   path = require('path'),
  fs = require('fs'),
  util = require('util');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); // Body parser use JSON data
app.use(cookieParser());

var express = require('express');
var router = express.Router();

var sequelize = new Sequelize('postgres', 'postgres', 'Divya123', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
var sdk = new BoxSDK({
  clientID: '3vn9adcubavmvcgj3jlye7psglozo99k',
  clientSecret: 'Ef4yDegeR26lT1cNCvbFuSKN64YARBLX'
});
 
//Create a basic API client
var client = sdk.getBasicClient('fKxQPGxsIZGoIeOvFxDBuYnLp2Nm5n1L');
 
// Get some of that sweet, sweet data!
client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
  if(err) throw err;
  console.log('Hello, ' + currentUser.name + '!');
});


 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//   next();
// });
//  server.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


  app.get('/Get',function(req,res){
    
   var data = {
        "Data":""
    };
     sequelize.query("SELECT * FROM persondetails", { type: sequelize.QueryTypes.SELECT})
  .then(function(persondetails,err,rows,fields) {
    
    if(persondetails){
    
           data["Data"] = persondetails;
            
            res.json({"err" : false, "message" : "success",data});
          
        }else 
        if(err)
          throw err;
  });
});

app.post('/Post',function(req,res){
 console.log('Hi');
  console.log(req.body);

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var pwd = req.body.pwd;
    var confirmpwd = req.body.confirmpwd;
    var email =req.body.email;
    var phone =req.body.phone;
   

    var data = {
        "Data":""
    };
   
   
  if(!!firstname && !!lastname && !!pwd && !!confirmpwd && !!email && !!phone) 
    {
//sequelize.query("INSERT INTO persondetails(firstName,lastname,pwd,confirmPwd) VALUES('" + firstName+ "','" + lastname+ "','" + pwd + "','" + confirmPwd+ "')",[firstName,lastname,pwd,confirmPwd],{type: sequelize.QueryTypes.INSERT}).then(function(persondetails,err) {
  sequelize.query("INSERT INTO persondetails (firstname,lastname,pwd,confirmpwd,email,phone) VALUES('" + firstname+ "','" + lastname+ "','" + pwd + "','" + confirmpwd+ "','" + email+ "','" + phone+ "')",[firstname,lastname,pwd,confirmpwd,email,phone],{type: sequelize.QueryTypes.INSERT}).then(function(persondetails,err) {
    
 if(!!err){ 
 
                data.Data = "Error Adding data";
            }else{
               
                data["Data"] = "Bird Added Successfully";
            }
            res.json(data);
        });
   }
    else{
        data["Data"] = "Please provide all required data of bird";
        
res.status(400).json(data);
    }
});


app.post('/login',function(req,res){
    console.log('hi');
    var emailFE = req.body.email;
    var pwdFE = req.body.pwd;
    console.log(emailFE);
    console.log(pwdFE);
    sequelize.query("SELECT * FROM persondetails",{type: sequelize.QueryTypes.SELECT}).then(function(persondetails,err) {
    
for (var i=0;i<=((persondetails.length)-1);i++){
     if((emailFE == persondetails[i].email)&& (pwdFE == persondetails[i].pwd)){
     // req.session.persondetails = persondetails;
     var token = jwt.sign({
             email: persondetails[i].email,
           pwd: persondetails[i].pwd
           }, superSecret, {
           expiresIn: 1 // expires in 24 hours
           // exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1hour expiration
           });
   
           // return the information including token as JSON
         
      
      break;
     }
    else{
      console.log(err);
    
       res.status(400).send({message:"your email is not verified"});
    }
    }

    });
    
       
  });

app.post('/logout',function(req,res){
     console.log(req.session);
  res.redirect('/index.html');

});
app.post('/upload',multiparty(),function(req,res){
  client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
  
  var stream = fs.createReadStream(req.files.theFile.path);
  client.files.uploadFile('42705020628', req.files.theFile.name, stream, function(error,response){
  if (error) throw error;
  var path='app.box.com/files/';
    var username = currentUser.name;
    var box_file_path = path+response.entries[0].id;
    var file_created_at= response.entries[0].created_at;
    var data = {
        "Data":""
    };
   if(!!username&& !!box_file_path&& !!file_created_at) {
sequelize.query("INSERT INTO box_table (username,box_file_path,file_created_at) VALUES('" + username+ "','" + box_file_path+ "','" + file_created_at+ "')",[username,box_file_path,file_created_at],{type: sequelize.QueryTypes.INSERT}).then(function() {
    
 if(!!err){
                data.Data = "Error Adding data";
            }else{
                //data["Data"] = 0;
                data["Data"] = "Details Added Successfully";
                console.log('details added successfully');
            }
          // res.status(200).json(data);
           res.status(400).send({message:"File uploaded successfully"});
          //res.send('hello');
        });
    }else{
        data["Data"] = "Please provide all required data of file";
        //res.json(404).data);
res.status(400).json(data);

    }
});
});
});
app.get('/show',function(req,res){
    
   var data = {
        "Data":""
    };
     sequelize.query("SELECT * FROM box_table", { type: sequelize.QueryTypes.SELECT})
  .then(function(results,err) {
  //       sequelize.query("SELECT username FROM box_table", { type: sequelize.QueryTypes.SELECT})
  // .then(function(err,results,res) {
    // We don't need spread here, since only the results will be returned for select queries
    //if(rows.length!=0){
    if(results){
    
           data["Data"] = results;
           res.json(data);
           // console.log(results[0].username);
           // console.log(data);
        }
    // if (err) {
    //        console.log(err);
    //    } else {
    //        // console.log(results);
    //        // res.send(results);
    //        // res.json(results);
    //        res.json('hello');
    //    }
  });
});

app.post('/download',function(req,res)
{
   console.log('hi');
   console.log(req.body);
  
   // for(int i=0;i<=arrays.length;i++)
  console.log(req.body[0]);
  var id=req.body[0];

console.log(id);
client.files.getReadStream(id, null, function(error, stream) {


  if (error) {
    // handle error
    console.log(error);
    throw error;
  }

  // write the file to disk
console.log('hiiiiiii');
  // var output = fs.createWriteStream('/download');
  // stream.pipe(output);
  var output = fs.createWriteStream('./download/'+id+".jpg"); //I know for sure there will only be zip files
    stream.pipe(output);
    //res.send('hello');
});

});
  
   app.listen(port);
console.log('Magic happens on port ' + port);

 app.use(express.static(__dirname + '/'));
  app.get('*', function(req, res) {
     res.sendFile(path.join(__dirname + '/public/views/index.html'));
 });
 

  module.exports = app;
