const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const {
    buildSchema
} = require('graphql')
const mongoose = require('mongoose')

const Event = require('./models/event')

const app = express()

const events = [];

const buildSchemaObj = `
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`

app.use(bodyParser.json())

app.use(
    '/graphql',
    graphqlHttp({
        schema: buildSchema(buildSchemaObj),
        rootValue: {
            events: () => {
                return Event.find()
                    .then(events => {
                        return events.map(event => {
                            return { ...event._doc }
                        })
                    })
                    .catch(err => {
                        throw err
                    })
            },
            createEvent: args => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date)
                })
                // Save the event to mongo db here
                return event
                    .save()
                    .then(result => {
                        console.log(result)
                        return { ...result._doc }
                    })
                    .catch(err => {
                        console.log(err)
                        throw err
                    })
            }
        },
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
        console.log(err)
    })
