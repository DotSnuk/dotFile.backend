const multer = require('multer')
const prisma = require('./prismaClient')
const fs = require('node:fs')
const dateParser = require('../utils/dateParser');
const defaultPath = 'uploads/';
const supabase = require('./supabase');
const {decode} = require('base64-arraybuffer');
const { equal } = require('node:assert');

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const singleFile = [
  upload.single('inputfile'), async (req, res, next) => {
    // console.log(req.file)
    // res.status(200).send({success: true})
    try {
      const file = req.file;
      console.log(file)
      const userId = req.user.id
      const {folderId} = req.body
      const {data, error} = await supabase
        .storage
        .from('users')
        .upload(`${userId}/${folderId}/${file.originalname}`, file)
      if (error) throw new Error(error);
      next()
    } catch (err) {
      console.error(err)
    }
  },
  async (req, res, next) => {
    await prisma.file.create({data: {
      ownerId: parseInt(req.user.id),
      name: req.file.originalname,
      sizeBytes: parseInt(req.file.size),
      folderId: parseInt(req.body.folderId)
    }})
    console.log('bla')
    res.status(200);

  }
]

const readDir =  async (req, res, next) => {
  try {
    // could perhaps implenent something to check if logged in user
    // is the same as the first part of req.body.path
    const files = await prisma.file.findMany({where: {
      ownerId: req.user.id,
      folderId: req.body.folderId
    }})
    console.log(files)
    res.status(200).send(files)
  } catch (err) {
    console.error(err);
  }
}

const getHomeDir = async (req, res, next) => {
  try {
    const homeDir = await prisma.folder.findFirst({
      where: {
        ownerId: {
          equals: req.user.id
        },
        parentId: {
          equals: null
        }
      }
      
    })
    return res.status(200).send(homeDir)
  } catch (err) {
    console.error(err)
  }
}

const getFolderStructure = async (req, res, next) => {
  try {
    const folders = await prisma.folder.findFirst({
      where: {
        ownerId: {
          equals: req.user.id
        },
        id: {
          equals: req.body.folderId
        }
      },
      include: {
        parent: true
      }
    })
    console.log(folders)
    res.status(200).send(folders)
  } catch(err) {
    console.error(err)
  }
}

const getChildFolders = async (req, res, next) => {
  try {
    const childFolders = await prisma.folder.findMany({
      where: {
        ownerId: {
          equals: req.user.id
        },
      parentId: {
        equals: req.body.currentFolderId
      }
      }
    })
    res.status(200).send(childFolders)
  } catch(err) {
    console.error(err)
  }
}

const makeDir = async (req, res, next) => {
  try {
    // if (fs.existsSync(`${defaultPath}${req.user.id}`)) {
    //   fs.mkdirSync(`${defaultPath}${req.user.id}/${req.body.newFolder}`);
    //   } 
    const folder = await prisma.folder.create({
      data: {
        name: req.body.folderName,
        ownerId: req.user.id,
        parentId: req.body.currentFolderId
      }
    })
    res.status(200).send(folder)
    } catch (err) {
      console.log(err)
  } 
}

module.exports = {
  singleFile,
  readDir,
  getHomeDir,
  getFolderStructure,
  makeDir,
  getChildFolders
}