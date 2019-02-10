const Event = require('../../models/event')
const User = require('../../models/user')

const {
    transformEvent
} = require('./merge')

module.exports = {
    events: async () => {
        try {
            const eventsList = await Event.find()
            return eventsList.map(event => transformEvent(event))
        } catch (err) {
            throw err
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthorized')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        })
        let createdEvent
        try {
            // Save the event to mongo db here
            const result = await event.save()
            createdEvent = transformEvent(result)
            const creator = await User.findById(req.userId)
            if (!creator) {
                throw Error('User not found')
            }
            creator.createdEvents.push(event)
            await creator.save()

            return createdEvent
        } catch (error) {
            throw error
        }
    }
}
