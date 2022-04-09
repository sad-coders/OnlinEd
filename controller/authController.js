const db = require("../model/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const saltRounds = 10
const signup = async function(request, response) {
    
    const connection = db.getConnection();
    const hashedPassword = bcrypt.hashSync(request.body.password,saltRounds);
    const user = {
      email : request.body.email,
      password : hashedPassword,
      isFaculty : request.body.isFaculty
    }
    try{
      const _user = await connection.collection("authentication").insertOne(user)
      const token = jwt.sign({
           email : _user.email
        }, 
        process.env.secret,{
        expiresIn: 86400 // expires in 24 hours
      });
      response.status(200).send({ auth: true, token: token });
    }catch(error){
      response.status(500).send({ message : "Failed to authenticate"})
    }
}
const verifyToken = async (request,response,next)=>{
    const token = request.headers['x-access-token'];
    
    if (!token) return response.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.secret , function(err, decoded) {
      if (err) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      request.email = decoded.email
      next()
    });
}
const getProtectedResource = async (request,response,next)=>{
  response.status(200).send("protected resource")
}
const login = async function(request,response){
  const connection = db.getConnection();
  const user = {
    email : request.body.email,
    password : request.body.password
  }

  var _user = await connection.collection('authentication').find({ email : user.email }).toArray();
  
  if (_user.length===0) return res.status(404).send('user not found');
  _user = _user[0];
  const passwordIsValid = bcrypt.compareSync(user.password,_user.password);
  //console.log(passwordIsValid)
  if (!passwordIsValid) return response.status(401).send({ auth: false, token: null,message : "incorrect password" });
  
  const token = jwt.sign({ email : _user.email }, process.env.secret, {
    expiresIn: 86400 // expires in 24 hours
  });

  response.status(200).send({ auth: true, token: token });
}
module.exports = {
  signup,
  login,
  getProtectedResource,
  verifyToken
}
