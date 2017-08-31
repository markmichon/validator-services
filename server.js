const express = require("express")
const compression = require("compression")
const cors = require("cors")
const services = require("./services")

const app = new express()

app.set("port", process.env.PORT || 5000)

app.use(cors())
app.use(compression())
app.get("/ping", function() {
  console.log("I'm awake!")
})
app.get("/html", services.validateHtml)
app.get("/css", services.validateCSS)

app.listen(app.get("port"), () => {
  console.log("Validator API services listening on port " + app.get("port"))
})
