const db = require('../model/db')

async function getAllAssignments(request,response){
    const connection = db.getConnection();
    var assignments = await connection.collection('assignment').find({}).toArray();
    response.status(200).json(assignments);
}
async function createAssignment(request,response){
    const connection = db.getConnection();
    var new_assignment = {
        assignmentId : request.body.assignment_id,
        dueDate :  request.body.due_date,
        postedOn : request.body.posted_on,
        postedBy : request.body.posted_by,
        classroomId : request.body.classroom_id,
        content : request.body.content,
        link : request.body.link
    }
    await connection.collection('assignment').insertOne(new_assignment);
    response.status(201).json('created')
}

module.exports = {
    getAllAssignments,
    createAssignment
}