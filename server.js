var express = require('express');
const bodyParser = require('body-parser');

var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/products');

var app=express();
app.use(bodyParser.json())

var ProductSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength:[3, 'Enter a longer name']},
    quantity: { type: Number, required:[true, 'you need to have a quantity....'] },
    price: { type: Number, required: [true, "c'mon, nothing in life is free"]},
}, {timestamps: true });
mongoose.model('Product', ProductSchema);
var Product = mongoose.model('Product') 
//var session = require('express-session')
app.use(express.static( __dirname + '/public/dist/public' ));
app.get('/api/products', function(req, res){
    Product.find({}, function(err, products){
        if(err){
           console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error", error: err})
        }
        else {
            // respond with JSON
           res.json({message: "Success", products: products})
        }
     })
})
app.post('/api/products', function(req, res){
	var product = new Product(req.body);
	console.log(product);
	product.save(function(err){
		if(err){
			console.log("houston, we have a problem");
			console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error", error: err})
		}
		else{
			console.log("clear for launch");
		}
	})
})
app.post('/api/products/edit', function(req, res){
	Product.update({_id: req.body._id}, {$set:{name:req.body.name, quantity:req.body.quantity, price:req.body.price}}, function(err){
		if(err){
			console.log("error");
			res.json({message: "Error", error: err})
		}
		else{
			console.log("updated");
		}
	})
})
app.post('/api/delete', function(req, res){
	Product.remove({_id: req.body._id},function(err){
		if(err){
			console.log("error")
			res.json({message:"Error", error:err})
		}
		else{
			console.log("deleted");
		}
	})
});	
	
app.all("*", (req,res,next) => {
  res.sendfile("./public/dist/public/index.html")
});
app.listen(8000, function() {
    console.log("listening on port 8000");
})