const ctrl = {}
const model = require('../model/movie')
const respone = require('../utils/respon')
const cloudinary = require('../utils/cloudinary')
const upload = require('../middleware/upload');


ctrl.fetchData = async (req, res) => {
    try {
        const result = await model.getBy();
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}

ctrl.fetchBy = async (req, res) => {
    try {
        const params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            orderBy: req.query.orderBy || 'created_at',
            search: req.query.search
        }
        const result = await model.getBy(params)
        
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.save = async (req, res) => {
    try {
      upload.single('banner')(req, res, async (error) => {
        if (error) {
          console.error(error);
          return respone(res, 500, 'Error uploading file');
        }
  
        if (req.file !== undefined) {
          const uploadResult = await cloudinary.uploader.upload(req.file.path);
          if (uploadResult.error) {
            console.error(uploadResult.error);
          }
          req.body.banner = uploadResult.secure_url;
        }
  
        const result = await model.save(req.body);
        return respone(res, 200, result);
      });
    } catch (error) {
      console.log(error);
      return respone(res, 500, error.message);
    }
  };

// ctrl.save = async (req, res) => {
//     try {
//       if (error) {
//         console.error(error);
//         return respone(res, 500, 'Error uploading file');
//       }

//         if (req.file !== undefined) {
//           const uploadResult = await cloudinary.uploader.upload(req.file.path);
//           req.body.banner = uploadResult.secure_url;
//         }

//         const result = await model.save(req.body)
//         return respone(res, 200, result)
//     } catch (error) {
//         console.log(error)
//         return respone(res, 500, error.message)
//     }
// }

ctrl.patch = async (req, res) => {
    try {
        const result = await model.update(req.body, req.params.id)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}
module.exports = ctrl
