import * as fs from "fs";
import * as fileType from "file-type";
import { upload } from "./stream-client.js";
import { globSync } from "glob";

function getFilename(path) {
  const parts = path.split("/");
  return parts[parts.length - 1];
}

async function processFile(fileDir) {
  const readStream = fs.createReadStream(fileDir, {
    highWaterMark: 1 * 1024 * 1024 * 1024,
  });
  const { mime } = await fileType.fileTypeFromStream(readStream);
  await upload(readStream, getFilename(fileDir), mime);
}

async function main(videoFiles) {
  for (const video of videoFiles) await processFile(video);
}

const videoFiles = globSync(`./videos/**/*.mp4`);
console.log(videoFiles);
main(videoFiles);
// fs.appendFileSync('./videos.txt', videoFiles.reduce((agg, video) => `${getFilename(video)}\n${agg}`));
