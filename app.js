const express = require('express')
const hbs = require('hbs')
const session = require('express-session');

var app = express();

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'abcc##$$0911233$%%%32222', 
    cookie: { maxAge: 60000 }}));

app.set('view engine','hbs')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://bomaygalc123:Minhlc12345@cluster0.0wvgj.mongodb.net/test";

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

const dbHandler = require('./databaseHandler')

var dsNotToDelete = ['ao','quan','bep','my goi'];

///
app.post('/search', async (req,res)=>{
    const searchText = req.body.txtName;
    const results =  await dbHandler.searchSanPham(searchText,"SanPham");
    res.render('allProduct',{model:results})
})
// app.post('/search',async (req,res)=>{
//     const searchText = req.body.txtName;
//     var client = await MongoClient.connect(url);
//     var dbo = client.db("MinhNhayy");
//     const searchCondition = new RegExp(searchText, 'i')
//     var result = await dbo.collection("SanPham").find({name: searchCondition}).toArray();
//     res.render('allProduct',{model:result})
// })
///
app.post('/login',async (req,res)=>{
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPassword;
    const found = await dbHandler.checkUser(nameInput,passInput);
    if(found){
        req.session.username = nameInput;
        res.render('index',{loginName:nameInput})       
    }else{
        res.render('index',{errorMsg:"Login failed!"})
    }
})
///
app.post('/doRegister',async (req,res)=>{
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPassword;
    const newUser = {username:nameInput,password:passInput};
    await dbHandler.insertOneIntoCollection(newUser,"users");
    res.redirect('/');
})
///
app.get('/delete',async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};

    const client= await MongoClient.connect(url);
    const dbo = client.db("MinhNhayy");
    const productToDelete = await dbo.collection("SanPham").findOne(condition);
    const index = dsNotToDelete.findIndex((e)=>e==productToDelete.name);
    if (index !=-1) {
        res.end('khong the xoa vi sp dac biet: ' + dsNotToDelete[index])
    }else{
        await dbo.collection("SanPham").deleteOne(condition);
        res.redirect('/view');
    }   
})
///
app.post('/update',async (req,res)=>{
    const id = req.body.id;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const newValues ={$set : {name: nameInput,price:priceInput}};
    const ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};
    
    const client= await MongoClient.connect(url);
    const dbo = client.db("MinhNhayy");
    await dbo.collection("SanPham").updateOne(condition,newValues);
    res.redirect('/view');
})
///
app.get('/edit',async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};

    const client= await MongoClient.connect(url);
    const dbo = client.db("MinhNhayy");
    const productToEdit = await dbo.collection("SanPham").findOne(condition);
    res.render('edit',{product:productToEdit})
})
///
app.get('/view', async (req, res)=>{
    //var client = await MongoClient.connect(url);
    //var dbo = client.db("MinhNhayy");

    //const results =  await dbHandler.searchSanPham(searchText,"SanPham");
    const results =  await dbHandler.searchSanPham('',"SanPham");
    var userName ='Not logged In';
    if(req.session.username){
        userName = req.session.username;
    }
    res.render('allProduct',{model:results,username:userName})

})
// app.get('/view', async (req, res)=>{
//     var client = await MongoClient.connect(url);
//     var dbo = client.db("MinhNhayy");
//     var result = await dbo.collection("SanPham").find({}).toArray();
//     res.render('allProduct',{model:result})
// })
///
app.post('/doInsert', async (req, res)=>{
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const imgURLInput = req.body.imgURL;
    const newProduct = {name:nameInput, price:priceInput,imgUrl:imgURLInput, size : {dai:20, rong:40}}
    await dbHandler.insertOneIntoCollection(newProduct, "SanPham");
    res.render('index')
})
// app.post('/doInsert', async (req, res)=>{
//     var nameInput = req.body.txtName;
//     var priceInput = req.body.txtPrice;
//     var heightInput = req.body.txtHeight;
//     var weightInput = req.body.txtWeight;
//     var newProduct = {name:nameInput, price: priceInput, size: {h: heightInput, w: weightInput}};
//     var client = await MongoClient.connect(url);
//     var dbo = client.db("MinhNhayy");
//     await dbo.collection("SanPham").insertOne(newProduct);
//     res.render('index')
// })

app.get('/insert',(req,res)=>{
    res.render('insert')
})

app.get('/',(req,res)=>{
    var userName ='ADMIN';
    if(req.session.username){
        userName = req.session.username;
    }
    res.render('index',{loginName:userName})
})

app.get('/register',(req,res)=>{
    res.render('register')
})

var PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('Server is running at: '+ PORT);