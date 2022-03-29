const db = require('../model/db')

const createAccount = async (request, response)=>{
    const connection = db.getConnection();
    const person = {
        name : request.body.name,
        email : request.body.email,
        profilePic : request.body.profile_picr,
        classrooms : [],
        isStudent : request.body.is_student
    }

    connection.collection('person').insertOne( person, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the families collection.");
    });
    response.status(200).json("created");
}
const getAllAccounts = async (request, response)=>{
    const connection = db.getConnection();

    var docs =await connection.collection('person').find({}).toArray();
    response.status(200).json(docs);
}

module.exports = {
    createAccount,
    getAllAccounts
}