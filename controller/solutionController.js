const db = require("../model/db.js");
const COLLECTION_NAME = "solution";

exports.getSolutionByStudentId = async (req, res, next) => {
  const connection = db.getConnection();

  let StudentId = req.params.StudentId;

  var solutions = await connection
    .collection(COLLECTION_NAME)
    .find({ studentId: StudentId })
    .sort({ deadline: -1 })
    .toArray();

  console.log(solutions);
  res.status(200).json({ status: "success", solutions });
};

exports.getSolutionByAssignmentId = async (req, res, next) => {
  const connection = db.getConnection();

  let assignmentId = req.params.AssignmentId;
  console.log(assignmentId);

  var solutions = await connection
    .collection(COLLECTION_NAME)
    .find({ assignmentId: assignmentId })
    .toArray();

  console.log(solutions);
  res.status(200).json({ status: "success", solutions });
};

exports.insertSolution = async (req, res, next) => {
  const connection = db.getConnection();
  var Solution = req.body.solution;

  console.log(Solution);

  var insertedSolution = await connection
    .collection(COLLECTION_NAME)
    .insertOne(Solution);

  console.log(insertedSolution);
  res.status(200).json({ status: "success", insertedSolution });
};

exports.updateSolution = async (req, res, next) => {
  const connection = db.getConnection();
  let { studentId, assignmentId, link, date, deadline, _id } =
    req.body.solution;

  let solutionId = _id;

  //   console.log(studentId, assignmentId, link, date, deadline, _id);

  var updatedSolution = await connection.collection(COLLECTION_NAME).updateOne(
    { _id: solutionId },
    {
      $set: {
        studentId: studentId,
        assignmentId: assignmentId,
        link: link,
        date: date,
        deadline: deadline,
      },
    }
  );
  console.log(updatedSolution);

  res.status(200).json({ status: "success", updatedSolution });
};

exports.deleteSolution = async (req, res, next) => {
  const connection = db.getConnection();
  var solution = req.body.solution;
  let { _id, studentId, assignmentId } = solution;

  var solutionId = _id;

  console.log(studentId);
  console.log(assignmentId);

  var deletedSolution = await connection
    .collection(COLLECTION_NAME)
    .deleteMany({ _id: solutionId });

  console.log(deletedSolution);

  res.status(200).json({ status: "success", deletedSolution });
};
