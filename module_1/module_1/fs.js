const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');

// fs.writeFile('example.txt', 'first file creation', err => {
//   if (err) {
//     console.log(err);
//   }

//   fs.readFile('example.txt', 'utf-8', (err, data) => {
//     console.log(data);

//     fs.appendFile('example.txt', 'second write', err => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   });
// });

// fsPromises
//   .writeFile('example.txt', 'second write')
//   .then(() => {
//     return fsPromises.readFile('example.txt', 'utf-8');
//   })
//   .then(() => {
//     return fsPromises.appendFile('example.txt', 'second write');
//   });

// async function main() {
//   await fsPromises.writeFile('example.txt', 'second write');

//   const data = await fsPromises.readFile('example.txt', 'utf-8');
//   console.log(data);

//   await fsPromises.appendFile('example.txt', 'second write');
// }

// main();

// fs.writeFileSync

async function secondMain() {
  const pathToHigherPackageJson = path.join(__dirname, '../package.json');

  console.log(pathToHigherPackageJson);

  console.log(await fsPromises.readFile(pathToHigherPackageJson, 'utf-8'));
}

secondMain();
