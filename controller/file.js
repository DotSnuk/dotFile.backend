const multer = require('multer')
const prisma = require('./prismaClient')
const fs = require('node:fs')
const dateParser = require('../utils/dateParser');
const defaultPath = 'uploads/';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
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

const readDir =  (req, res, next) => {
  try {
    const folderStructure = `${defaultPath}${req.user.id}${req.body.path}`;
    if (fs.existsSync(folderStructure)) {
      console.log(folderStructure)
      const dir = fs.readdirSync(folderStructure)
      const folders = [];
      const items = [];
      dir.map(file => {
        if (file.lastIndexOf('.') === 0) return
        if (fs.statSync(`${folderStructure}${file}`).isDirectory()) return folders.push(file)
        const stats = fs.statSync(`${folderStructure}/${file}`)
        items.push({filename: file, size: stats.size, dateCreated: stats.birthtime})
      })
      res.status(200).send({success: true, data: {folders, items}});
    };
  } catch (err) {
    console.error(err);
  }
}

const makeDir = (req, res, next) => {
  try {
    if (fs.existsSync(`${defaultPath}${req.user.id}`)) {
      fs.mkdirSync(`${defaultPath}${req.user.id}/${req.body.newFolder}`);
      } 
    } catch (err) {
      console.log(err)
  } 
}

module.exports = {
  singleFile,
  readDir,
  makeDir
}