const req = require('express/lib/request');
const db = require('../model/db');

const classroomController = require('./classroomController');
const solutionController = require('./solutionController');


async function getAllAssignments(request,response){
    const connection = db.getConnection();
    var assignments = await connection.collection('assignment').find({}).toArray();
    response.status(200).json(assignments);
}    
async function getAssignment(request,response){
    const connection = db.getConnection();
    console.log(request.params.assignment_id)
    var assignment = await connection.collection('assignment').find({_id:request.params.assignment_id}).toArray();
    response.status(200).json(assignment[0]);
}
async function createAssignment(request,response){
    const connection = db.getConnection();
    var new_assignment = {
        dueDate :  request.body.due_date,
        postedOn : request.body.posted_on,
        postedBy : request.body.posted_by,
        authorName: request.body.authorName,
        assignmentTitle : request.body.assignmentTitle,
        classroomId : request.body.classroom_id,
        content : request.body.content,
        link : request.body.link
    }
    const assignment = await connection.collection('assignment').insertOne(new_assignment);
    console.log(assignment)
    var obj = {
        assignmentId: assignment.insertedId, 
        assignmentTitle: new_assignment.assignmentTitle, 
        dueDate: new_assignment.dueDate, 
        postedOn:new_assignment.postedOn,
        authorName: new_assignment.authorName
    }
    var classroom = await connection.collection('classrooms').findOneAndUpdate({_id:request.body.classroom_id}, 
        { $push: {assignments : obj} }, {returnDocument: 'after',returnNewDocument: true});
    classroom = classroom.value;
    console.log(classroom);
    var students = classroom.students;
    console.log(students);
    if(students)  {
        for(var x = 0; x < students.length; x++) {
            try{
                var res = await connection
                            .collection('solution')
                            .insertOne({
                                studentId: students[x].studentId,
                                assignmentId: assignment.insertedId.toString(),
                                link: '',
                                dateOfSubmission: '',
                                deadline: request.body.due_date,
                                marks: null
                            });
            }catch(e) {
                console.log(e);
                response.status(404).json("assignment could not be added")
            }
        } 
    }
    
    response.status(201).json({
        "status" : "success"
    })
}
async function updateAssignment(request,response){
    const connection = db.getConnection();
    try{
        const assignment = await connection.collection('assignment').updateOne({
            _id : request.params.assignment_id,
        },{$set:{
            dueDate :  request.body.due_date,
            postedOn : request.body.posted_on,
            postedBy : request.body.posted_by,
            classroomId : request.body.classroom_id,
            content : request.body.content,
            link : request.body.link
        }})
        response.status(200).json(assignment)
    }catch(error){
        console.log(error);
        response.status(404).json("update failed")
    }
}
async function deleteAssignment(request,response){
    const connection = db.getConnection()
    const assignment = await connection.collection('assignment').deleteMany({_id:request.params.assignment_id})
    response.status(200).json("assignment deleted successfully")
}
module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}