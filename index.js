const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World Adriano!')
})

app.listen(3000)