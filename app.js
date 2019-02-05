const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const {
    buildSchema
} = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Event = require('./models/event')
const User = require('./models/user')

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

    type User {
        _id: ID!
        email: String!
        password: String
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
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
                    date: new Date(args.eventInput.date),
                    creator: "5c599ac038217f214b405ef6"
                })
                let createdEvent
                // Save the event to mongo db here
                return event
                    .save()
                    .then(result => {
                        createdEvent = { ...result._doc }
                        return User.findById("5c599ac038217f214b405ef6")
                    })
                    .then(user => {
                        if(!user) {
                            throw Error('User not found')
                        }
                        user.createdEvents.push(event)
                        return user.save()
                    })
                    .then(result => {
                        return createdEvent
                    })
                    .catch(err => {
                        throw err
                    })
            },
            createUser: args => {
                // Find for user email existence
                return User
                    .findOne({ email: args.userInput.email })
                    .then(user => {
                        // If the user is there, we throw
                        if (user) {
                            throw new Error('User already exists')
                        }
                        // else, we hash the user
                        return bcrypt.hash(args.userInput.password, 12)
                    })
                    .then(hashedPassword => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword
                        })
                        return user.save()
                    })
                    .then(result => {
                        return { ...result._doc, password: null }
                    })
                    .catch(err => {
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
