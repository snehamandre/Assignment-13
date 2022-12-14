var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

var dbUrl = 'mongodb+srv://admin:admin123@cluster0.nqexwle.mongodb.net/productsDB?retryWrites=true&w=majority';

var Product = mongoose.model('product', {
    product: {
        productid: Number,
        category: String,
        price: String,
        name: String,
        instock: Boolean
    },
    id : Number
});
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true},  (err) => {
    console.log('MongoDB connected', err);
   });

app.post('/product/create/', async (req, res) => {
    try{
        var product = new Product(req.body);
        console.log(product);
        await product.save();
        console.log("Saved");
        res.sendStatus(200);

    }catch (error) {
        res.sendStatus(500);
    }
});
app.get('/product/get/', async (req, res) => {
    var products = {};
    var data = await Product.find({})
    data.forEach((value) => {
        products[value.id] = value.product;
    });
    res.send(products);
});

app.put('/product/update/:id', async (req, res) => {
    try{
        var reqestId = req.params.id;
        console.log(req.body)
        await Product.findOneAndUpdate({id: reqestId}, req.body);
        res.sendStatus(200);   
    }catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
app.delete('/product/delete/:id', async (req, res) => {
    var reqId = req.params.id;
    await Product.findOneAndDelete({id: reqId});
    res.sendStatus(200);
});

const server = app.listen(3001, () => {
  console.log('server is listening on port', server.address().port)
})

