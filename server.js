var express = require('express')
var app = express()
app.use(express.static('docs'))
app.get('*', (req, res) => {
    res.sendFile(__dirname + "/docs/index.html")
  })
app.listen(3000, () => {
  //console.log("App listening on port 3000")
})