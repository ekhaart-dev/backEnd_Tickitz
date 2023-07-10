const { uploader } = require("cloudinary").v2;

async function upload(pathFile) {
  try {
    let result = await uploader.upload(pathFile, {
      folder: "assets",
      use_filename: true,
    });
    return result.url;
  } catch (error) {
    return error;
  }
}

module.exports = upload;
