let config = null

if (process.env.NODE_ENV === 'development') {
  config = require(`./config.local.json`)
}

module.exports = config
