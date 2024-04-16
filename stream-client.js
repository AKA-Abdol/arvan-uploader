import * as tus from "tus-js-client";
import http from "./http-client.js";
import { persistFail, persistSuccess } from "./persister/index.js";

async function createVideo(fileId, title) {
  return http.post(`/channels/${process.env.ARVAN_CHANNEL_ID}/videos`, {
    title,
    file_id: fileId,
    convert_mode: "auto",
  });
}

function getFileIdByUrl(url) {
  return url.split("/").at(-1);
}

export function upload(fileBuffer, filename, filetype) {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(fileBuffer, {
      endpoint: `${process.env.ARVAN_BASE_URL}/channels/${process.env.ARVAN_CHANNEL_ID}/files`,
      headers: {
        Authorization: process.env.ARVAN_API_KEY,
      },
      retryDelays: [0, 3_000, 5_000, 10_000, 20_000],
      metadata: {
        filename,
        filetype,
      },
      onError: function (error) {
        console.log("Failed because: " + error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(
          bytesUploaded,
          bytesTotal,
          percentage + "%",
          `for ${filename}`
        );
      },
      onSuccess: async function () {
        try {
          const res = await createVideo(getFileIdByUrl(upload.url), filename);
          persistSuccess(
            filename,
            getFileIdByUrl(upload.url),
            res.data.data.id
          );
          resolve();
        } catch (e) {
          persistFail(filename, getFileIdByUrl(upload.url));
          reject();
        }
      },
    });

    upload.findPreviousUploads().then(function (previousUploads) {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
    });

    upload.start();
  });
}
