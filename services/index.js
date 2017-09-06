var request = require("request")
var validator = require("w3c-css")
var RateLimiter = require("limiter").RateLimiter
var getCss = require("get-css")
var Prism = require("prismjs")
// init rate limiter for w3c css requests
var limiter = new RateLimiter(1, "second")

exports.validateHtml = (req, res) => {
  const { url } = req.query

  let options = {
    uri: "https://validator.w3.org/check",
    headers: {
      "User-Agent": "request"
    },
    qs: {
      output: "json",
      uri: url
    }
  }

  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      request({ uri: url }, (e, r, b) => {
        res.send(
          JSON.stringify({
            validation: JSON.parse(body),
            raw: Prism.highlight(b, Prism.languages.markup)
          })
        )
      })
      // res.send(body)
    } else {
      console.error("Error", err)
      console.error("Error Response", response)
    }
  })
}

exports.validateCSS = (req, res) => {
  let options = {
    url: req.query.url,
    profile: req.query.profile || "css3svg",
    warning: req.query.warning || 1
  }
  // wraps validator in rate limiter
  limiter.removeTokens(1, (err, remainingRequests) => {
    validator.validate(options, (err, data) => {
      if (err) {
        res.send(err)
      } else {
        getCss(req.query.url).then(css => {
          res.send(
            JSON.stringify({
              validation: data,
              raw: Prism.highlight(css.css, Prism.languages.css)
            })
          )
        })
      }
    })
  })
}
