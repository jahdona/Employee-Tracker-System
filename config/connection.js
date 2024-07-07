const {Pool}=require('pg');

const connection=new Pool({
    user:'postgres',
    password:'p@ssw0rd',
    host:'localhost',
    database:'company'
});
module.exports=connection;