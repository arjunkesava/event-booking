import React from 'react'
import './BookingsList.css'

const bookingsList = props => (
    <ul className="bookings__list">
        {props.bookings.map(booking => {
            return (
                <li key={booking._id} className="bookings__item">
                    <div className="bookings__item-data">
                        {booking.event.title} {' - '}
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <div className="bookings__action">
                        <button className="btn" onClick={props.onDeleteBooking.bind(null, booking._id)}>Cancel</button>
                    </div>
                </li>
            )
        })}
    </ul>
)

export default bookingsList;