const { app, remote } = require("electron");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const rp = require("request-promise");
const { STATUSES } = require("./constants");

const configDir = (app || remote.app).getPath("userData");

module.exports.uploadSignature = ({ fileName, uri }) => {
  const filePath = path.join(configDir, "uploads", fileName);
  const base64Data = uri.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(filePath, base64Data, "base64", function (err) {
    if (err) {
      console.log(err);
    }
  });
  return {
    fileName: fileName,
    filePath: filePath,
  };
};

module.exports.checkServerStatus = () => {
  return new Promise((resolve) => {
    rp({
      uri: process.env.VUE_APP_SERVER_URL,
      resolveWithFullResponse: true,
    })
      .then((response) => {
        if (response.statusCode === 200) {
          console.log("Server is running");
          resolve({ status: STATUSES.SUCCESS, statusCode: 200 });
        } else {
          console.log("Server is not running");
          resolve(false);
          resolve({ status: STATUSES.ERROR, statusCode: 404 });
        }
      })
      .catch((error) => {
        console.log("Server is not running yet");
        resolve({ status: STATUSES.ERROR, statusCode: 404 });
      });
  });
};
