const db = require('../model/db')

const createAccount = async (request, response)=>{
    const connection = db.getConnection();
    const person = {
        name : request.body.name,
        email : request.body.email,
        profilePic : request.body.profile_pic,
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
async function getPerson(request,response){
    const connection = db.getConnection();
    console.log(request.params.person_id)
    var person = await connection.collection('person').find({_id:request.params.person_id}).toArray();
    response.status(200).json(person[0]);
}
async function updatePerson(request,response){
    const connection = db.getConnection();
    try{
        const person = await connection.collection('person').updateOne({
            _id : request.params.person_id,
        },{$set:{
            name : request.body.name,
            email : request.body.email,
            profilePic : request.body.profile_pic,
            classrooms : request.body.classrooms,
            isStudent : request.body.is_student
        }})
        response.status(200).json(person)
    }catch(error){
        console.log(error);
        response.status(404).json("update failed")
    }
}
module.exports = {
    createAccount,
    getAllAccounts,
    getPerson,
    updatePerson
}