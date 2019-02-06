const bcrypt = require('bcrypt')
const Event = require('../../models/event')
const User = require('../../models/user')

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        creator: user.bind(this, event._doc.creator)
                    }
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
            creator: "5c5ab7ac34ceee6900c4a90b"
        })
        let createdEvent
        // Save the event to mongo db here
        return event
            .save()
            .then(result => {
                createdEvent = {
                    ...result._doc,
                    creator: user.bind(this, result._doc.creator)
                }
                return User.findById("5c5ab7ac34ceee6900c4a90b")
            })
            .then(user => {
                if (!user) {
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
            .findOne({
                email: args.userInput.email
            })
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
                return {
                    ...result._doc,
                    password: null
                }
            })
            .catch(err => {
                throw err
            })
    }
}

const events = eventIDs => {
    return Event.find({
            _id: {
                $in: eventIDs
            }
        })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    creator: user.bind(this, event.creator)
                }
            })
        })
        .catch(err => {
            throw err
        })
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => {
            throw err
        })
}
