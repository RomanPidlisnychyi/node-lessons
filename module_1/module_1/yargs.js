const { alias } = require('yargs');
const yargs = require('yargs');

const users = [
  {
    id: 1,
    name: 'Jane',
    surname: 'Doe',
  },
  {
    id: 2,
    name: 'Mango',
    surname: 'Lee',
  },
  {
    id: 3,
    name: 'Poly',
    surname: 'Few',
  },
];

const argv = yargs
  .number('id')
  .string('name')
  .string('surname')
  .alias('name', 'n')
  .alias('surname', 's').argv;

const usersFound = users.filter(user => {
  return (
    checkField('id', user) &&
    checkField('name', user) &&
    checkField('surname', user)
  );
});

function checkField(fieldName, user) {
  return !(argv[fieldName] && argv[fieldName] !== user[fieldName]);
}

// const { id, name, surname } = argv;

// const usersFound = users.filter(user => {
//   if (id && id !== user.id) {
//     return;
//   }
//   if (name && name !== user.name) {
//     return;
//   }
//   if (surname && surname !== user.surname) {
//     return;
//   }
//   return user;
// });

console.log(usersFound);
