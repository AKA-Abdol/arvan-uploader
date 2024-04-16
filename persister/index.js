import * as fs from "fs";

function getFileIdByUrl(url) {
  return url.split("/").at(-1);
}

function persistFail(filename, fileId) {
  try {
    fs.appendFileSync(
      "./persister/fail.db.txt",
      `${getFileIdByUrl(filename)},${fileId}~`
    );
    console.log("fail added to db");
  } catch (e) {
    console.error("cannot find db to persist fails");
  }
}

function persistSuccess(filename, fileId, videoId) {
  try {
    fs.appendFileSync(
      "./persister/success.db.txt",
      `${getFileIdByUrl(filename)},${fileId},${videoId}~`
    );
    console.log("success added to db");
  } catch (e) {
    console.error("cannot find db to persist successes");
  }
}

export { persistFail, persistSuccess };
