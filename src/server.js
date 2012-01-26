var express = require("express"),
app = express.createServer();
app.use(express.static(__dirname));
app.get("/detect/:text", function (req, res) {
    var text = req.params.text;
    if (/je/.test(text)) {
        res.send("fr");
    } else {
        res.send("en");
    }
});
app.get("/translate/:text/:from/:to", function (req, res) {
    var text = req.params.text,
        from = req.params.from,
        to = req.params.to,
        baseString = "Me llamo Joel";
    if (from === "en") {
        res.send(baseString.substring(0, text.length));
    } else if (from === "fr") {
        res.send(baseString.substring(0, text.length));
    }
});


app.listen(5001);
console.log("started on port 5001");
