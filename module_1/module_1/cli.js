const [operation, ...numbers] = process.argv.slice(2);

console.log(numbers);

switch (operation) {
  case "sum":
    console.log(numbers.reduce((acc, number) => acc + parseFloat(number), 0));
    break;

  case "deduct":
    console.log(
      numbers.reduce((acc, number) => parseFloat(acc) - parseFloat(number))
    );
    break;

  default:
    throw new Error("unsupported operation");
}
