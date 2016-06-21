var express = require('express')
var app = express()
var OAuth2Strategy = require('passport-oauth2')
var passport = require('passport')

app.use(passport.initialize())
var port = 8888

/*
 * Configure Genius authentication
 */

var geniusOptions = {
  authorizationURL: 'https://api.genius.com/oauth/authorize',
  tokenURL: 'https://api.genius.com/oauth/token',
  clientID: process.env.GENIUS_CLIENT_ID,
  clientSecret: process.env.GENIUS_CLIENT_SECRET,
  callbackURL: `http://localhost:${port}/auth/genius/callback`
}

var geniusStrategy = new OAuth2Strategy(geniusOptions,
  function (accessToken, refreshToken, profile, done) {
    var wrapper = JSON.stringify({
      type: 'genius',
      accessToken
    })
    // transmit code back to the Atom plugin via stdout
    console.log(wrapper)
    done(null, {})
  }
)

passport.use(geniusStrategy)

/*
 * Routes
 */

app.get('/', function (req, res) {
  var message = `This is a server that an Atom package uses to talk with
  the Genius lyrics API. It only runs when you're using Atom, and only talks to
  those services when you ask the app to get data from them.`
  res.send(message)
})

app.get('/auth/genius', passport.authenticate('oauth2', { session: false }))

app.get('/auth/genius/error', function (req, res) {
  console.error('Genius authentication error')
  res.send('Ran into a problem getting permission from the Genius API')
})

app.get('/auth/genius/callback', passport.authenticate('oauth2', {
  successRedirect: '/auth/genius/complete', failureRedirect: '/auth/genius/error', session: false
}))

app.get('/auth/genius/complete',
  function (req, res) {
    res.send('Hey! Glad to see you got the Genius stuff working. You can go back to Atom now.')
  }
)

app.listen(8888, function () {
  console.log('Genius OAuth server started')
})
