var request = require('request')
var validator = require('w3c-css')

exports.validateHtml = (req, res) => {
  let options = {
    uri: 'https://validator.w3.org/check',
    headers: {
      'User-Agent': 'request'
    },
    qs: {
      output: 'json',
      uri: req.query.url,
    }
  };

  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      res.send(body)
    } else {
      console.error('Error', err)
      console.error('Error Response', response)
    }
  })
}

exports.validateCSS = (req, res) => {
  let options = {
    url: req.query.url,
    profile: req.query.profile || 'css3svg',
    warning: req.query.warning || 1
  }

  validator.validate(options, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
}
