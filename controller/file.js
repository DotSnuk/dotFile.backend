const multer = require('multer')
const prisma = require('./prismaClient')
const fs = require('node:fs')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const defaultPath = 'uploads/';
    try {
      if (!fs.existsSync(`${defaultPath}${req.user.id}`)) fs.mkdirSync(`${defaultPath}${req.user.id}`)
      cb(null, `${defaultPath}${req.user.id}/`);
    } catch (err) {
      console.error(err)
    }
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const suffix = Date.now()
    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
    cb(null, file.fieldname + '-' + suffix + extension)
  }
})
const upload = multer({storage: storage});

const singleFile = [
  upload.single('inputfile'), (req, res, next) => {
    console.log(req.file)
    res.status(200).send({success: true})
  }
]

module.exports = {
  singleFile
}