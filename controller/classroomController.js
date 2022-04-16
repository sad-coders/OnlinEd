const db = require("../model/db.js");
const COLLECTION_NAME = "classrooms";

exports.getAllClassrooms = async (req, res, next) => {
  const connection = db.getConnection();
  var classrooms = await connection
    .collection(COLLECTION_NAME)
    .find({})
    .toArray();

  console.log(classrooms);
  res.status(200).json({
    status: "success",
    classrooms,
  });
};
exports.getClassroomsOfPerson = async(req,res,next)=>{
  //console.log(req.query.email)
  const connection = db.getConnection();
  var person = await connection.collection('person').find({email : req.query.email}).toArray();
  person = person[0];
  //console.log(person)
  res.status(200).json(person.classrooms)
}
exports.insertClassroom = async (req, res, next) => {
  const connection = db.getConnection();
  var classroom = req.body.classroom;
  console.log(classroom);
  var op = await connection.collection(COLLECTION_NAME).insertOne(classroom);
  console.log(op);

  res.status(200).json({
    status: "success",
  });
};

exports.updateClassroom = async (req, res, next) => {
  const connection = db.getConnection();
  var classroom = req.body.classroom;
  console.log(classroom);
  var op = await connection
    .collection(COLLECTION_NAME)
    .updateOne({ _id: req.params.classroomId }, { $set: classroom });
  console.log(op);

  res.status(200).json({
    status: "success",
  });
};
