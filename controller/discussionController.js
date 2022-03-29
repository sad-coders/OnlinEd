const db = require("../model/db.js");
const COLLECTION_NAME = "discussion";

exports.getAlldiscussion = async (req, res, next) => {
  const connection = db.getConnection();
  var discussions = await connection
    .collection(COLLECTION_NAME)
    .find({})
    .toArray();

  console.log(discussions);
  res.status(200).json({ status: "success", discussions });
};

exports.getByAuthorId = async (req, res, next) => {
  const connection = db.getConnection();

  let authorId = req.params.AuthorId;

  var discussions = await connection
    .collection(COLLECTION_NAME)
    .find({ authorId: authorId })
    .sort({ date: -1 })
    .toArray();

  console.log(discussions);
  res.status(200).json({ status: "success", discussions });
};

exports.insertdiscussion = async (req, res, next) => {
  const connection = db.getConnection();
  var discussion = req.body.discussion;

  console.log(discussion);
  var insertDiscussion = await connection
    .collection(COLLECTION_NAME)
    .insertOne(discussion);

  console.log(insertDiscussion);
  res.status(200).json({ status: "success", insertDiscussion });
};

exports.updatediscussion = async (req, res, next) => {
  const connection = db.getConnection();

  let {
    _id,
    type,
    date,
    content,
    authorId,
    parentId,
    likecount,
    dislikecount,
  } = req.body.discussion;

  var updatedDiscussion = await connection
    .collection(COLLECTION_NAME)
    .updateOne(
      { _id: _id },
      {
        $set: {
          type: type,
          date: date,
          content: content,
          authorId: authorId,
          parentId: parentId,
          likecount: likecount,
          dislikecount: dislikecount,
        },
      }
    );

  console.log(updatedDiscussion);

  res.status(200).json({ status: "success", updatedDiscussion });
};

exports.deletedicussion = async (req, res, next) => {
  const connection = db.getConnection();
  var discussion = req.body.discussion;
  let { _id, authorId, parentId } = discussion;

  console.log(_id, authorId, parentId);

  var discussionId = _id;

  var deleteDiscussion = await connection
    .collection(COLLECTION_NAME)
    .deleteMany({ _id: discussionId });

  console.log(deleteDiscussion);

  res.status(200).json({ status: "success", deleteDiscussion });
};
