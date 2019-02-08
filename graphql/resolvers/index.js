const bcrypt = require('bcrypt')
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const events = async eventIDs => {
    try {
        const events = await Event.find({_id: {$in: eventIDs }})
        return events.map(event => {
            return {
                ...event._doc,
                creator: user.bind(this, event.creator)
            }
        })
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try{
        const eventDetails = await Event.findById(eventId)
        return {
            ...eventDetails._doc,
            creator: user.bind(this, eventDetails.creator)
        }
    } catch (err) {
        throw err
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find({})
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    user: user.bind(this, booking.user),
                    event: singleEvent.bind(this, booking.event),
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString()
                }
            })
        } catch (error) {
            throw error
        }
    },
    events: async () => {
        try{
            const eventsList = await Event.find()
            return eventsList.map(event => {
                return {
                    ...event._doc,
                    creator: user.bind(this, event.creator)
                }
            })
        } catch (err) {
            throw err
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5c5ab7ac34ceee6900c4a90b"
        })
        try {
            // Save the event to mongo db here
            const result = await event.save()
            let  = {
                ...result._doc,
                creator: user.bind(this, result._doc.creator)
            }

            const creator = await User.findById("5c5ab7ac34ceee6900c4a90b")
            if(!creator){
                throw Error('User not found')
            }
            creator.createdEvents.push(event)
            await creator.save()

            return createdEvent
        } catch (error) {
            throw error
        }
    },
    createUser: async args => {
        try {
            // Find for user email existence
            const checkUserExists = await User.findOne({ email: args.userInput.email })
            if(checkUserExists){
                // If the user is there, we throw
                throw new Error('User already exists')
            }
            // else, we hash the user
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save()
            return {
                ...result._doc,
                password: null
            }
        } catch (error) {
            throw err
        }
    },
    bookEvent: async args => {
        try {
            const eventDetails = await Event.findOne({ _id: args.eventId })
            const bookingDetails = new Booking({
                user: "5c5ab7ac34ceee6900c4a90b",
                event: eventDetails
            })
            const result = await bookingDetails.save()
            return {
                ...result._doc,
                user: user.bind(this, result._doc.user),
                event: singleEvent.bind(this, result._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            }
        } catch (error) {
            throw error
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = {
                ...booking.event._doc,
                creator: user.bind(this, booking.event._doc.creator)
            }
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch (error) {
            throw error
        }
    }
}
