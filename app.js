const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const isAuth = require('./middleware/is-auth')

const app = express()

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')

app.use(bodyParser.json())

app.use(isAuth)

app.use(
    '/graphql',
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true
    })
)

mongoose
    .connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds121295.mlab.com:21295/event_booking`)
    .then(() => {
        console.log('Mongo connected, go ahead')
        app.listen(5000)
    })
    .catch(err => {
        throw err
    })
