const express = require('express');

const mysql = require('mysql');

const body_parser = require('body-parser');

const session = require('express-session');

const app = express();

app.use(body_parser.urlencoded({ extended : false }));

app.use(body_parser.json());

//middleware for serving static file
app.use(express.static('public'));

//Set up EJS as template engine
app.set('view engine', 'ejs');

//Make MySQL Database Connection
const connection = mysql.createConnection({
	host : 'localhost',
	database : 'testing',
	user : 'root',
	password : ''
});

//Check MySQL Database Connection
connection.connect((error) => {
	console.log('MySQL Database is connected Successfully');
});

//Set up Session Middleware
app.use(session({
	secret : '1234567890abcdefghijklmnopqrstuvwxyz',
	resave : false,
	saveUninitialized : true,
	cookie : { secure : false }
}));

//Create Route for Load Product Data
app.get("/", (request, response) => {

	const query = `SELECT * FROM product LIMIT 3`;

	//Execute Query
	connection.query(query, (error, result) => {

		if(!request.session.cart)
		{
			request.session.cart = [];
		}

		response.render('product', { products : result, cart : request.session.cart });

	});

});

//Create Route for Add Item into Cart
app.post('/add_cart', (request, response) => {

	const product_id = request.body.product_id;

	const product_name = request.body.product_name;

	const product_price = request.body.product_price;

	let count = 0;

	for(let i = 0; i < request.session.cart.length; i++)
	{

		if(request.session.cart[i].product_id === product_id)
		{
			request.session.cart[i].quantity += 1;

			count++;
		}

	}

	if(count === 0)
	{
		const cart_data = {
			product_id : product_id,
			product_name : product_name,
			product_price : parseFloat(product_price),
			quantity : 1
		};

		request.session.cart.push(cart_data);
	}

	response.redirect("/");

});

//Create Route for Remove Item from Shopping Cart
app.get('/remove_item', (request, response) => {

	const product_id = request.query.id;

	for(let i = 0; i < request.session.cart.length; i++)
	{
		if(request.session.cart[i].product_id === product_id)
		{
			request.session.cart.splice(i, 1);
		}
	}

	response.redirect("/");

});

app.listen(3000, () => {

	console.log('Server has started on port number 3000');

});
