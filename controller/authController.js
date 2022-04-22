const db = require("../model/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mailController = require('./mailController')
const personController = require('./personController')

const saltRounds = 10

const signup = async function(request, response) {
    
    const connection = db.getConnection();
    const hashedPassword = bcrypt.hashSync(request.body.password,saltRounds);
    const user = {
      email : request.body.email,
      password : hashedPassword,
      isFaculty : request.body.isFaculty,
      isVerified: false
    }
    try{
      const dbResponse = await connection.collection("authentication").insertOne(user)
      const token = jwt.sign({
           email : request.body.email,
        }, 
        process.env.secret,
        {
        expiresIn: 86400 // expires in 24 hours
      });

      // console.log(dbResponse);

      mailController.sendConfirmationMail(request.body.email, dbResponse.insertedId);
      var person = {
            name : request.body.name,
            email : request.body.email,
            profilePic : request.body.profile_pic,
            classrooms : [],
            isStudent : !request.body.isFaculty
      }
      personController.addnewPerson(person);
      
      response.status(200).send({ auth: true, token: token });
    }catch(error){
      console.log(error);
      response.status(500).send({ message : "Failed to authenticate"})
    }
}

const verify = async function(request, response) {
  try{
    console.log(request.params.userid);
    const connection = db.getConnection();
    const dbResponse = await connection.collection("authentication").updateOne({ _id: request.params.userid }, { $set: {"isVerified" : true} });

    console.log(dbResponse);
    
    response.status(200).send({ auth: true, verificationStatus: 'verified' });
  }catch(error){
    console.log(error);
    response.status(500).send({ message : "Failed to authenticate", verificationStatus: 'failed'})
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
  
  if (_user.length===0) return response.status(404).send('user not found');
  _user = _user[0];
  const passwordIsValid = bcrypt.compareSync(user.password,_user.password);
  //console.log(passwordIsValid)
  if (!passwordIsValid) return response.status(401).send({ auth: false, token: null,message : "incorrect password" });
  
  const token = jwt.sign({ email : _user.email }, process.env.secret, {
    expiresIn: 86400 // expires in 24 hours
  });

  var person = await connection.collection('person').find({email: user.email}).toArray();
  person = person[0];
  response.status(200).send({ auth: true, token, person});
}
module.exports = {
  signup,
  login,
  getProtectedResource,
  verifyToken,
  verify
}
