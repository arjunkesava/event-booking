import React from 'react'

import './BookingsControl.css'

const bookingsControl = props => {
    return (
        <div className="bookings-control">
            <button className={props.activeOutputType === 'list' ? 'active': ''} onClick={props.onChange.bind(null, 'list')}>
                List
            </button>
            <button className={props.activeOutputType === 'chart' ? 'active': ''} onClick={props.onChange.bind(null, 'chart')}>
                Chart
            </button>
        </div>
    )
}

export default bookingsControl