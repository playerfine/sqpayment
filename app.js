const express = require("express");
const axios = require("axios");

const app = express();
const cors = require('cors');

app.use(express.static(__dirname + '/public'));
app.use(cors());
var bodyParser = require('body-parser');


app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(bodyParser.urlencoded({ extended: false }));

var merchantID = 112339;
var signatureKey = "Melt10Chest15File";
var string = `${merchantID}:${signatureKey}`;

var buffer = Buffer.from(string, "utf8");

let base64 = buffer.toString("base64");

let config = {
    headers: {
        Authorization: `Basic ${base64}`,
        'Content-Type': 'application/json'
    }
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.post("/createpayment", async (req, res) => {
    try {

        let id = (Math.floor(Math.random() * 10000) + 10000).toString();

        let json = {
            "mode": "production", // test or production
            "action": "SALE",
            "type": 1,
            "transactionUnique": "", // optional
            "amount": 40.00,
            "orderRef": id,
            "customerName": "test tesat",
            "customerEmail": "", // optional
            "customerPhone": "", // optional
            "customerAddress": "", // optional
            "countryAlpha2": "NL", // allowed payment method → country → alpha_2
            "customerPostCode": "", // optional
            "checkoutRedirectURL": "http://127.0.0.1:3000/order",
            "currencyAlpha3": "USD",
            "paymentMethod": "ideal" // allowed payment method → tag
        }

        let {data}  = await axios.post("https://plugins.cxpay.global/api/payment", {...json}, config)

        console.log("Komt hier...");
        console.log(data);
        res.send({url:data, statusCode: 200});

    }
    catch(error)
    {
        console.log(error.response);
        res.json({error: "something went wrong", statusCode: 500});
    }
})

app.get("/", (req, res) => {
    res.render("index.html", {title: "dit is een test"});
})

app.post("/order", (req, res) => {
    console.log(req.body);
    var { responseCode, customerName } = req.body;
    let isPaid = responseCode === "0";
    var response = {
        isPaid,
        customerName
    }
    res.render("order.html", response);
})

app.get("/order/:id", (req, res) => {
    res.render("order.html", {title: "dit is een test"});
})

app.get("/", (req, res) => {
    res.send("hey from the backend");
})


app.listen(3000, () => {
    console.log("app is runnning");
})