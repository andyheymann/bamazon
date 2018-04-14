var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//make the connection

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

//check for connection errors

connection.connect(function(err) {
  if (err) throw err;
  start();
});

//build the table with cli-table pulling the res.'s from my db

function showTable(res) {
  var table = new Table({
    head: ["Item ID", "Product Name", "Department", "Cost", "Stock"],
    colWidths: [10, 20, 20, 10, 10]
  });
  for (var i = 0; i < res.length; i++) {
    table.push([
      res[i].id,
      res[i].product_name,
      res[i].department_name,
      res[i].price,
      res[i].stock_quantity
    ]);
  }
  console.log(table.toString());
}

// make the magic

var start = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    showTable(res);
    var choiceArray = [];
    for (var i = 0; i < res.length; i++) {
      choiceArray.push(res[i].product_name);
    }

    // start inquirer and ask question

    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "what would you like to buy? (Enter the Item ID)"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many would you like to buy"
        }
      ])

      //handle the results of the questions with answer!

      .then(function(answer) {
        var itemID = answer.item;
        var chosenItem = res[itemID - 1];
        var newQuantity = chosenItem.stock_quantity - answer.quantity;

        // check the stock and give a result

        if (newQuantity >= 0) {
          //update quantity
          connection.query("UPDATE products SET ? WHERE id = ?", [
            { stock_quantity: newQuantity },
            itemID
          ]);

          //give result
          console.log(
            "\n\nYou have purchased " +
              answer.quantity +
              " " +
              chosenItem.product_name +
              " for $" +
              chosenItem.price * answer.quantity +
              ".  What a deal!\n\n"
          );
          start();

          //show failure
        } else {
          console.log(
            "\n\n\nThere are not enough in stock for you to purchase that many.\n\n\n"
          );
          start();
        }
      });
  });
};
