import React, { Component } from 'react'
import Spinner from '../components/Spinner/Spinner'
import AuthContext from '../context/auth-context'

class BookingsPage extends Component{
	state = {
		isLoading: false,
		bookings: []
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
				Authorization: 'Bearer' + this.context.token
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

	render(){
		return (
			<React.Fragment>
				{this.state.isLoading ?
					<Spinner /> : (
					<ul>
						{this.state.bookings.map(booking => {
							return <li key={booking._id}>
								{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
							</li>
						})}
					</ul>
				)}
			</React.Fragment>
		)
	}
}

export default BookingsPage