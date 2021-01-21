const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'static',
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

app.post('/form-data', upload.single('file_example'), (req, res, next) => {
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);

  res.status(200).send();
});

app.listen(PORT, () => console.log('Server started listening on port:', PORT));
