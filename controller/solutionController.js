const db = require("../model/db.js");
const multer = require("multer");
const COLLECTION_NAME = "solution";
const { BlobServiceClient } = require("@azure/storage-blob");
var path = require("path");
var fs = require("fs");

exports.getSolutionByStudentId = async (req, res, next) => {
  const connection = db.getConnection();
  try {
    let StudentId = req.params.StudentId;

    var solutions = await connection
      .collection(COLLECTION_NAME)
      .find({ studentId: StudentId })
      .sort({ deadline: -1 })
      .toArray();

    console.log(solutions);
    res.status(200).json({ status: "success", solutions });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
};

exports.getSolutionByAssignmentId = async (req, res, next) => {
  const connection = db.getConnection();

  try {
    let assignmentId = req.params.assignmentId;
    console.log(assignmentId);

    var solutions = await connection
      .collection(COLLECTION_NAME)
      .find({ assignmentId: assignmentId })
      .toArray();

    console.log(solutions);
    res.status(200).json({ status: "success", solutions });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
};

const getfileDetailsUsingStudentIdAndAssignmentId = async (
  assignmentId,
  studentId
) => {
  const connection = db.getConnection();

  var solutions = await connection
    .collection(COLLECTION_NAME)
    .find({ assignmentId: assignmentId, studentId: studentId })
    .toArray();

  return solutions;
};

// getSolutionByAssignmentIdAndStudentId
exports.getSolutionByAssignmentIdAndStudentId = async (req, res, next) => {
  try {
    let assignmentId = req.params.AssignmentId;
    let studentId = req.params.StudentId;
    console.log(assignmentId, studentId);

    var solutions = await getfileDetailsUsingStudentIdAndAssignmentId(
      assignmentId,
      studentId
    );

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
      var blobName = solutions[0].link;
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
};

exports.insertSolution = async (req, res, next) => {
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

    console.log(req.body.solution);

    const solution = JSON.parse(req.body.solution);
    solution["link"] = req.file.filename;
    console.log(solution);

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
    var Solution = solution;

    // console.log(Solution);

    var insertedSolution = await connection
      .collection(COLLECTION_NAME)
      .insertOne(Solution);

    console.log(insertedSolution);

    return res.status(200).json({ status: "success", insertedSolution });
  });
};

updateSolution = async (req) => {
  const connection = db.getConnection();
  console.log(req)
  try {
    let { _id } = req.body.solution;
    console.log(req.body.solution)
    let solutionId = _id;

    var newMarks,  newObj, newLink;

    if(req.body.solution.marks) {
      newMarks = req.body.solution.marks;
      newObj = {
        marks: newMarks
      };
    }else {
      newLink = req.body.solution
      newObj = {
        link: newLink,
        dateOfSubmission: Date.now()
      }
    }

    console.log('updating ' + solutionId + ' with link ' + newLink + ' with marks ' + newMarks)
    //   console.log(studentId, assignmentId, link, date, deadline, _id);
    
    var updatedSolution = await connection
      .collection(COLLECTION_NAME)
      .findOneAndUpdate({_id: solutionId}, 
        { $set: newObj},
        {returnDocument: 'after',returnNewDocument: true}
      );
    console.log(updatedSolution);
    return updatedSolution.value;

  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.marksForSolution = async(req,res,next) => {
  try{
    console.log(req.body.solution)
    var updatedSolution = await updateSolution(req);

    res.status(200).json({ status: "success", updatedSolution });
  }catch (error) {
    res.status(500).send({ message: "Failed" });
  }
}

exports.deleteSolution = async (req, res, next) => {
  const connection = db.getConnection();

  try {
    console.log(req.body);
    const { AssignmentId, StudentId } = req.body;

    var solution = await getfileDetailsUsingStudentIdAndAssignmentId(
      AssignmentId,
      StudentId
    );

    console.log(solution[0]);
    let { _id, studentId, assignmentId, link } = solution[0];

    // console.log(_id, studentId, assignmentId, link);

    var solutionId = _id;

    console.log(studentId);
    console.log(assignmentId);

    var deletedSolution = await connection
      .collection(COLLECTION_NAME)
      .deleteMany({ _id: solutionId });

    console.log(deletedSolution);

    // azure functionality to delete the blob.

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
      // const blockBlobClient = containerClient.getBlobBatchClient(link);
      // blockBlobClient.deleteBlobs();

      // const blobDeleteResponse = blockBlobClient.delete();
      const blobDeleteResponse = containerClient.deleteBlob(link);

      console.log(
        "Blob was Deleted successfully. requestId: ",
        (await blobDeleteResponse).clientRequestId
      );
    }
    await main()
      .then(() => console.log("Done"))
      .catch((ex) => console.log(ex.message));

    res.status(200).json({ status: "success", deletedSolution });
  } catch (error) {
    res.status(500).send({ message: "Failed" });
  }
  // res.status(200);
};
