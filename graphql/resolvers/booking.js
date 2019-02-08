const Event = require('../../models/event')
const Booking = require('../../models/booking')

const {
    transformBooking,
    transformEvent
} = require('./merge')

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find({})
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (error) {
            throw error
        }
    },
    bookEvent: async args => {
        try {
            const eventDetails = await Event.findOne({
                _id: args.eventId
            })
            const bookingDetails = new Booking({
                user: "5c5ab7ac34ceee6900c4a90b",
                event: eventDetails
            })
            const result = await bookingDetails.save()
            return transformBooking(result)
        } catch (error) {
            throw error
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({
                _id: args.bookingId
            })
            return event
        } catch (error) {
            throw error
        }
    }
}
