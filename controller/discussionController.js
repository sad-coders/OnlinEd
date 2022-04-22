const db = require("../model/db.js");
const COLLECTION_NAME = "discussion";

// new routes.
exports.getAllQuestionOfClassRoom = async (req, res, next) => {
  try {
    const connection = db.getConnection();

    let classRoomId = req.params.classRoomId;

    // find on the basis of type ="question " and on classRoomId. in decending order.
    // return array of objects.
    var allQuestions = await connection
      .collection(COLLECTION_NAME)
      .find({ classroomId: classRoomId, type: "question" })
      .sort({ date: -1 })
      .toArray();

    console.log(allQuestions);
    res.status(200).json({ status: "success", allQuestions });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
};

exports.addQuestion = async (req, res, next) => {
  try {
    const connection = db.getConnection();

    var question = req.body;

    console.log(question);

    var insertQuestion = await connection
      .collection(COLLECTION_NAME)
      .insertOne(question);
    console.log(insertQuestion);

    //insertQuestion will contain the _id. for the forntend
    res.status(200).json({ status: "success", insertQuestion });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
};

// question can only deleted by the id with the same autherid.
exports.deleteQuestion = async (req, res, next) => {
  try {
    const connection = db.getConnection();
    const { studentId, authorId, _id } = req.body.question;

    console.log(studentId, authorId);

    if (studentId === authorId) {
      //delete the question.
      var deletequestion = await connection
        .collection(COLLECTION_NAME)
        .deleteMany({ _id: _id });

      console.log(deletequestion);
      // delete the answer related to it.
      var deleteRelatedAnswer = await connection
        .collection(COLLECTION_NAME)
        .deleteMany({ parentId: _id });
      console.log(deleteRelatedAnswer);

      res.status(200).json({ status: "success", deletequestion });
    } else {
      res.status(400).send({ message: "Invalid User to Delete the Question" });
    }
    // res.status(200).json({ status: "success", deletequestion });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
};

// for answer.
exports.getAllAnswerOfQuestion = async (req, res, next) => {
  try {
    const connection = db.getConnection();

    let questionId = req.params.questionId;
    let classRoomId = req.params.classRoomId;

    console.log(questionId, classRoomId);
    var allAnswers = await connection
      .collection(COLLECTION_NAME)
      .find({ classroomId: classRoomId, parentId: questionId, type: "answer" })
      .sort({ date: -1 })
      .toArray();

    console.log(allAnswers);
    res.status(200).json({ status: "success", allAnswers });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
};

exports.addAnswer = async (req, res, next) => {
  try {
    const connection = db.getConnection();
    var answer = req.body.answer;

    console.log(answer);

    var insertAnswer = await connection
      .collection(COLLECTION_NAME)
      .insertOne(answer);

    console.log(insertAnswer);
    res.status(200).json({ status: "success", insertAnswer });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
};

exports.deleteAnswer = async (req, res, next) => {
  try {
    const connection = db.getConnection();
    const { _id, studentId, authorId } = req.body.answer;

    if (studentId === authorId) {
      var deleteanswer = await connection
        .collection(COLLECTION_NAME)
        .deleteMany({ _id: _id });

      res.status(200).json({ status: "success", deleteanswer });
    } else {
      res.status(400).send({ message: "Invalid User to Delete the Answer" });
    }

    // res.status(200).json({ status: "success", deleteanswer });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
};
