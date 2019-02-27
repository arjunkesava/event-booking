const DataLoader = require('dataloader')

const Event = require('../../models/event')
const User = require('../../models/user')
const {
    dateToString
} = require('../../helper/date')

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds)
})

const userLoader = new DataLoader((userIds) => {
    return User.find({_id: {$in: userIds}})
})

const events = async eventIDs => {
    try {
        const events = await Event.find({
            _id: {
                $in: eventIDs
            }
        })
        return events.map(event => transformEvent(event))
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        const eventDetails = await eventLoader.load(eventId.toString())
        return eventDetails
    } catch (err) {
        throw err
    }
}

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString())
        return {
            ...user._doc,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        }
    } catch (error) {
        throw error
    }
}

const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

exports.transformEvent = transformEvent
exports.transformBooking = transformBooking
