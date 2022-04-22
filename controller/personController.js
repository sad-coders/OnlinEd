const db = require('../model/db')

const addnewPerson = async(person) => {
    const connection = db.getConnection();
    // const person = 

    const res = await connection.collection('person').insertOne(person);
    console.log(res.insertedId)
    return res;
}

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
        const person = await connection.collection('person').updateOne(
            {_id : request.params.person_id,},
            {
                $set:{
                    name : request.body.name,
                    email : request.body.email,
                    profilePic : request.body.profile_pic,
                    classrooms : request.body.classrooms,
                    isStudent : request.body.is_student
        }       }
        );
        response.status(200).json(person)
    }catch(error){
        console.log(error);
        response.status(404).json("update failed")
    }
}

async function addPersonToClassroom (req,res) {
    const connection = db.getConnection();
    var personId = req.params.personId;
    console.log('personId',personId);
    var classcode = req.body.classcode;
    var name = req.body.name;
    var email = req.body.email;
    try{
        var newClassroom = await connection.collection('classrooms')
                                    .findOneAndUpdate(
                                        {classcode: classcode}, 
                                        { $push: {students: {
                                            studentId : personId,
                                            name,
                                            email
                                        }}}, 
                                        {returnDocument: 'after',returnNewDocument: true}
                                    );

        console.log(newClassroom);
        newClassroom = newClassroom.value;

        var classroom = {};
        classroom.classroomId =  newClassroom._id.toString();
        classroom.className =  newClassroom.className;
        classroom.createdBy =  newClassroom.createdBy;
        console.log(newClassroom);
        
        console.log(classroom);
        var updatedPerson = await connection.collection('person')
                                .findOneAndUpdate(
                                    {_id: personId}, { $push: {classrooms: classroom}},
                                    {returnDocument: 'after',returnNewDocument: true}
                                );

        updatedPerson = updatedPerson.value;

        console.log(updatedPerson);

        res.status(200).json({"status" : "success", person: updatedPerson});

    }catch (e){
        console.log(e)
        res.status(404).json("Couldn't add student to classroom")
    }
}

module.exports = {
    addnewPerson,
    createAccount,
    getAllAccounts,
    getPerson,
    updatePerson,
    addPersonToClassroom
}