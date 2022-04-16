const req = require('express/lib/request');
const db = require('../model/db')

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
    response.status(201).json(assignment)
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