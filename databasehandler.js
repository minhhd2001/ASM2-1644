const MongoClient = require('mongodb').MongoClient;
const url =  "mongodb+srv://bomaygalc123:Minhlc12345@cluster0.0wvgj.mongodb.net/test";
const dbName = "MinhNhayy";

async function  searchSanPham(condition,collectionName){  
    //const client = await MongoClient.connect(url); 
    //const dbo = client.db("MinhNhayy");
    const dbo = await getDbo();
    const searchCondition = new RegExp(condition,'i')
    var results = await dbo.collection(collectionName).
                            find({name:searchCondition}).toArray();
    return results;
}

async function insertOneIntoCollection(documentToInsert,collectionName){
    const dbo = await getDbo();
    await dbo.collection(collectionName).insertOne(documentToInsert);
}

async function getDbo() {
    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    return dbo;
}

async function checkUser(nameIn,passwordIn){
    const dbo = await getDbo();
    const results = await dbo.collection("users").
        findOne({$and:[{username:nameIn},{password:passwordIn}]});
    if(results !=null)
        return true;
    else
        return false;
}

module.exports = {searchSanPham,insertOneIntoCollection,checkUser}

