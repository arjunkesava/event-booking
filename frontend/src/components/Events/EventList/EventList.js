import React from 'react'

import EventItem from './EventItem/EventItem'
import './EventList.css'

const eventList = props => {
    const events = props.events.map((event, index) => {
        return (
            <EventItem
                key = {index}
                eventId = {event._id}
                title = {event.title}
                price = {event.price}
                date = {event.date}
                description = {event.description}
                creatorId = {event.creator._id}
                userId = {props.authUserId}
                onDetail = {props.onViewDetail}
            />
        )
    })

    return <ul className="event__list">{events}</ul>
}

export default eventList