const express = require("express");
const AWS = require("aws-sdk");

const router = express.Router();

const creds = require("../Compute-Storage/creds.js");

const bucketName = "cloud-compute-storage-assignment";
const fileName = "sample.txt";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

router.post("/storedata", (req, res) => {
  var fileData = req.body.data;
  const s3 = new AWS.S3({
    accessKeyId: creds.awsAccessKeyId,
    secretAccessKey: creds.awsSecretAccessKey,
    sessionToken: creds.awsSessionToken,
  });

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileData,
  };

  const publicURL = "https://" + bucketName + ".s3.amazonaws.com/" + fileName;

  s3.upload(params, (err, fileData) => {
    console.log("Uploading the file to the bucket.........");
    if (err) {
      console.log("Error in uploading the file!!");
      return res.status(500).json({
        message: "Error in uploading the file",
        success: false,
      });
    } else {
      console.log(fileData);
      return res.status(200).json({
        s3uri: publicURL,
        message: "Successfully uploaded the file",
        success: true,
      });
    }
  });
});

router.post("/appenddata", (req, res) => {
  var fileAppendData = req.body.data;

  const s3 = new AWS.S3({
    accessKeyId: creds.awsAccessKeyId,
    secretAccessKey: creds.awsSecretAccessKey,
    sessionToken: creds.awsSessionToken,
  });

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  var readFileData = "";

  s3.getObject(params, function (err, data_of_file) {
    if (err) {
      console.log("Error in retrieving the data of file");
    } else {
      readFileData = readFileData + data_of_file.Body.toString("utf-8");
    }
  });
  delay(500).then(() => {
    console.log("The file data is: " + readFileData);
    console.log(
      "The total appended data is: " + readFileData + "\n" + fileAppendData
    );

    params["Body"] = readFileData + "\n\n" + fileAppendData;

    const publicURL = "https://" + bucketName + ".s3.amazonaws.com/" + fileName;

    s3.upload(params, (err, data) => {
      console.log("Uploading the file to the bucket.........");
      if (err) {
        console.log("Error in uploading the file!!");
        return res.status(500).json({
          message: "Error in uploading the file",
          success: false,
        });
      } else {
        console.log(data);
        return res.status(200).json({
          s3uri: publicURL,
          message: "Successfully appended data and uploaded the file",
          success: true,
        });
      }
    });
  });
});

router.post("/deletefile", (req, res) => {
  const s3uri = req.body.s3uri;
  const getFilename = s3uri.split("/").pop();

  const s3 = new AWS.S3({
    accessKeyId: creds.awsAccessKeyId,
    secretAccessKey: creds.awsSecretAccessKey,
    sessionToken: creds.awsSessionToken,
  });

  const params = {
    Bucket: bucketName,
    Key: getFilename,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log("File not Found");
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "File deleted successfully!!",
        success: true,
      });
    }
  });
});

module.exports = router;
