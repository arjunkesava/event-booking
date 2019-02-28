import React, { Component } from 'react'
import Spinner from '../components/Spinner/Spinner'
import AuthContext from '../context/auth-context'
import BookingsList from '../components/Bookings/BookingsList/BookingsList'
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart'
import BookingsControl from '../components/Bookings/BookingsControl/BookingsControl'

class BookingsPage extends Component{
	state = {
		isLoading: false,
		bookings: [],
		outputType: 'list'
	}

	static contextType = AuthContext

	componentDidMount () {
		this.fetchEvents()
	}

	fetchEvents = () => {
		this.setState({isLoading: true})

		const requestBody = {
			query: `
				query{
					bookings {
						_id
						createdAt
						event {
							_id
							title
							date
							price
						}
					}
				}
			`
		}

		fetch('http://localhost:9000/graphql',{
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.context.token
			}
		})
		.then(res => {
			if (res.status !== 200 && res.status !== 201) {
				throw new Error('Invalid Request')
			}
			return res.json()
		})
		.then(resData => {
			const bookings = resData.data.bookings
			this.setState({bookings, isLoading: false})
		})
		.catch(err => {
			console.log(err)
			this.setState({isLoading: false})
		})
	}

	deleteBookingHandler = bookingId => {
		this.setState({isLoading: true})

		const requestBody = {
			query: `
				mutation CancelBooking($id: ID!){
					cancelBooking(bookingId: $id){
						_id
						title
					}
				}
			`,
			variables: {
				id: bookingId
			}
		}

		fetch('http://localhost:9000/graphql',{
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.context.token
			}
		})
		.then(res => {
			if (res.status !== 200 && res.status !== 201) {
				throw new Error('Invalid Request')
			}
			return res.json()
		})
		.then(resData => {
			this.setState(prevState => {
				const updatedBookings = prevState.bookings.filter(booking => {
					return booking._id !== bookingId
				})
				return { bookings: updatedBookings, isLoading: false }
			})
		})
		.catch(err => {
			console.log(err)
			this.setState({isLoading: false})
		})
	}

	changeOutputHandler = outputType => {
		if ( outputType === 'list' ) {
			this.setState({outputType: 'list'})
		} else {
			this.setState({outputType: 'chart'})
		}
	}

	render(){
		let content = <Spinner />
		if( !this.state.isLoading ) {
			content = (
				<React.Fragment>
					<BookingsControl
						onChange={this.changeOutputHandler}
						activeOutputType={this.state.outputType}
					/>
					<div>
						{this.state.outputType === 'list' ?
							<BookingsList bookings={this.state.bookings} onDeleteBooking={this.deleteBookingHandler} /> :
							<BookingsChart bookings={this.state.bookings} />
						}
					</div>
				</React.Fragment>
			)
		}
		return (
			<React.Fragment>
				{content}
			</React.Fragment>
		)
	}
}

export default BookingsPage