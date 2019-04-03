var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazonCustomer_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});


  

function start() {
  connection.query("SELECT * FROM product", function(err, res) {
    if (err) throw err;
    console.log(res);
   questions();
  });

  

}

function questions() {

connection.query("SELECT * FROM product", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "What item would you like to buy?"
        },
        {
          name: "amount",
          type: "input",
          message: "How many would you like to buy?"
        }
      ])
      .then(function(answer) {
     
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        console.log(chosenItem);
        if (chosenItem.stock_quantity > parseInt(answer.amount)) {

        var newQuantity = chosenItem.stock_quantity - parseInt(answer.amount);

       console.log(newQuantity);

       console.log(chosenItem.id);

 connection.query(
            "UPDATE product SET ? WHERE ?",
            [
              {
                stock_quantity: newQuantity
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              //console.log("it works")
              var totalPrice = chosenItem.price * parseInt(answer.amount);
              console.log("Total price: $" + totalPrice);
            }
          );
        // updateQuantity();

        }	

        else {

        console.log("Insufficient quantity!!!")

    	start();

        }
    });
  });
}

//function updateQuantity() {



//}
 