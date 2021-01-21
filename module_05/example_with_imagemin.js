const express = require('express');
const multer = require('multer');
const path = require('path');
const { promises: fsPromises } = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const storage = multer.diskStorage({
  destination: 'draft',
  filename: (req, file, cd) => {
    const { originalname } = file;
    const ext = path.parse(originalname).ext;
    const filename = path.parse(originalname).name;
    cd(null, filename + '-' + Date.now() + ext);
  },
});

const upload = multer({ storage });

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.static('static'));

app.post(
  '/form-data',
  upload.single('file_example'),
  minifyImage,
  (req, res, next) => {
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    res.status(200).send();
  }
);

app.listen(PORT, () => console.log('Server started listening on port:', PORT));

async function minifyImage(req, res, next) {
  try {
    const { path: filePath, filename } = req.file;
    const MINIFIED_DIR = 'static';

    await imagemin([filePath.replace(/\\/g, '/')], {
      destination: MINIFIED_DIR,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });

    await fsPromises.unlink(filePath);

    req.file = {
      ...req.file,
      path: path.join(MINIFIED_DIR, filename),
      destination: MINIFIED_DIR,
    };

    next();
  } catch (err) {
    next(err);
  }
}
