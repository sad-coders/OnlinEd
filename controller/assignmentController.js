const req = require("express/lib/request");
const db = require("../model/db");

const classroomController = require("./classroomController");
const solutionController = require("./solutionController");

const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
var path = require("path");
var fs = require("fs");

async function getAllAssignments(request, response) {
  const connection = db.getConnection();
  var assignments = await connection
    .collection("assignment")
    .find({})
    .toArray();
  response.status(200).json(assignments);
}
async function getAssignment(request, response) {
  const connection = db.getConnection();
  console.log(request.params.assignment_id);
  var assignment = await connection
    .collection("assignment")
    .find({ _id: request.params.assignment_id })
    .toArray();
  response.status(200).json(assignment[0]);
}

async function createAssignment(req, res) {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "controller");
    },
    filename: function (req, file, cb) {
      var fileName = Date.now() + "-" + file.originalname;
      cb(null, fileName);
    },
  });

  var upload = multer({ storage: storage }).single("file");

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    // azure upload req.file
    async function main() {
      console.log("Azure Blob storage v12 - JavaScript quickstart sample");
      const AZURE_STORAGE_CONNECTION_STRING =
        "DefaultEndpointsProtocol=https;AccountName=onlined;AccountKey=ECb9Iz47sQuroDKd6SL6FWk6eebl8wSDozTu/G/1STWn40yDjxLrK4CaY7c869BQK8gaGEOjI2HXjW4eCESD0g==;EndpointSuffix=core.windows.net";
      if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error("Azure Storage Connection string not found");
      }

      // Create the BlobServiceClient object which will be used to create a container client
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      );

      // Get a reference to a container
      const containerName = "solutionpdf";
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Create a unique name for the blob
      const blobName = req.file.filename;

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      console.log("\nUploading to Azure storage as blob:", blobName);

      // Upload data to the blob
      console.log(req.file.filename);
      // var mystring =;
      var fileName = path.join(__dirname, req.file.filename);
      console.log(fileName + " from here ");
      // const filePath = `G:\\CLoud COmputing Project\\OnlinEd\\public\\${req.file.filename}`;
      // console.log(filePath);
      const uploadBlobResponse = await blockBlobClient.uploadFile(fileName);
      console.log(
        "Blob was uploaded successfully. requestId: ",
        uploadBlobResponse.requestId
      );
    }

    await main()
      .then(() => console.log("Done"))
      .catch((ex) => console.log(ex.message));

    // console.log(req.file.filename);

    var filePath = path.join(__dirname, req.file.filename); //`G:\\CLoud COmputing Project\\OnlinEd\\public\\${req.file.filename}`;
    fs.unlinkSync(filePath);

    // storing filename and details to the database.
    const connection = db.getConnection();

    console.log(req.body.assignment);

    var newAssignment = JSON.parse(req.body.assignment);
    console.log(req.file.filename);
    newAssignment.link = req.file.filename;

    //   var new_assignment = {
    //       dueDate :  req.body.dueDate,
    //       postedOn : req.body.posted_on,
    //       postedBy : request.body.posted_by,
    //       authorName: req.body.authorName,
    //       assignmentTitle : request.body.assignmentTitle,
    //       classroomId : request.body.classroom_id,
    //       content : request.body.content,
    //       link : req.file.fileName
    //   }
    const assignment = await connection
      .collection("assignment")
      .insertOne(newAssignment);
    console.log(assignment);
    var obj = {
      assignmentId: assignment.insertedId,
      assignmentTitle: newAssignment.assignmentTitle,
      dueDate: newAssignment.dueDate,
      postedOn: newAssignment.postedOn,
      authorName: newAssignment.authorName,
    };
    var classroom = await connection
      .collection("classrooms")
      .findOneAndUpdate(
        { _id: newAssignment.classroomId },
        { $push: { assignments: obj } },
        { returnDocument: "after", returnNewDocument: true }
      );
    classroom = classroom.value;
    console.log(classroom);
    var students = classroom.students;
    console.log(students);
    if (students) {
      for (var x = 0; x < students.length; x++) {
        try {
          var res1 = await connection.collection("solution").insertOne({
            studentId: students[x].studentId,
            assignmentId: assignment.insertedId.toString(),
            link: "",
            dateOfSubmission: "",
            deadline: newAssignment.dueDate,
            marks: null,
            studentName: students[x].name,
          });
        } catch (e) {
          console.log(e);
          res.status(404).json("assignment could not be added");
        }
      }
    }

    return res.status(201).json({
      status: "success",
    });

    //   return res.status(200).json({ status: "success", insertedSolution });
  });
}
async function updateAssignment(request, response) {
  const connection = db.getConnection();
  try {
    const assignment = await connection.collection("assignment").updateOne(
      {
        _id: request.params.assignment_id,
      },
      {
        $set: {
          dueDate: request.body.due_date,
          postedOn: request.body.posted_on,
          postedBy: request.body.posted_by,
          classroomId: request.body.classroom_id,
          content: request.body.content,
          link: request.body.link,
        },
      }
    );
    response.status(200).json(assignment);
  } catch (error) {
    console.log(error);
    response.status(404).json("update failed");
  }
}
async function deleteAssignment(request, response) {
  const connection = db.getConnection();
  const assignment = await connection
    .collection("assignment")
    .deleteMany({ _id: request.params.assignment_id });
  response.status(200).json("assignment deleted successfully");
}

async function getAssignmentFile(req, res, next) {
  try {
    // let assignmentId = req.params.AssignmentId;
    // let studentId = req.params.StudentId;
    // console.log(assignmentId, studentId);

    // var solutions = await getfileDetailsUsingStudentIdAndAssignmentId(
    //   assignmentId,
    //   studentId
    // );

    var dataResponse = "";
    var mbuffer;

    async function streamToString(readableStream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
          chunks.push(data.toString());
        });
        readableStream.on("end", () => {
          resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
      });
    }

    // Convert stream to text
    async function streamToText(readable) {
      readable.setEncoding("utf8");
      let data = "";
      for await (const chunk of readable) {
        data += chunk;
      }
      return data;
    }

    async function main() {
      console.log("Azure Blob storage v12 - JavaScript quickstart sample");
      const AZURE_STORAGE_CONNECTION_STRING =
        "DefaultEndpointsProtocol=https;AccountName=onlined;AccountKey=ECb9Iz47sQuroDKd6SL6FWk6eebl8wSDozTu/G/1STWn40yDjxLrK4CaY7c869BQK8gaGEOjI2HXjW4eCESD0g==;EndpointSuffix=core.windows.net";
      if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error("Azure Storage Connection string not found");
      }

      // Create the BlobServiceClient object which will be used to create a container client
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      );

      // Get a reference to a container
      const containerName = "solutionpdf";
      const containerClient = await blobServiceClient.getContainerClient(
        containerName
      );

      // blob name
      var blobName = req.params.link;
      console.log(blobName);

      //downloading the file
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      mbuffer = await blockBlobClient.downloadToFile("./controller/temp.pdf");

      // console.log(dataResponse);

      console.log(
        "Blob was Downloaded successfully. requestId: ",
        (await downloadBlockBlobResponse).clientRequestId
      );
    }
    await main()
      .then(() => console.log("Done"))
      .catch((ex) => console.log(ex.message));

    var file = path.join(__dirname, "temp.pdf");
    console.log(file);

    console.log("here");
    fs.readFile(file, function (err, data) {
      console.log("sending");
      res.contentType("application/pdf");
      res.send(data);
    });
    // res.status(200).json(mbuffer);
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
}

module.exports = {
  getAllAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentFile,
};
