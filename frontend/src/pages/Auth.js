import React, { Component } from 'react'
import './Auth.css'

import AuthContext from '../context/auth-context'

class AuthPage extends Component{
	state = {
		isLogin: true
	}

	static contextType = AuthContext

	constructor(crazyProps){
		super(crazyProps)

		this.emailEl = React.createRef()
		this.passwordEl = React.createRef()
	}

	switchModeHandler = () => {
		this.setState(prevState => {
			return { isLogin: !prevState.isLogin }
		})
	}

	submitHandler = (event) => {
		event.preventDefault()

		const email = this.emailEl.current.value
		const password = this.passwordEl.current.value

		if(email.trim().length === 0 || password.trim().length === 0)
			return

		let requestBody = {
			query: `
				query Login($email: String!, $password: String!){
					login(email: $email, password: $password) {
						userId
						token
						tokenExpiration
					}
				}
			`,
			variables: {
				email,
				password
			}
		}

		if(!this.state.isLogin) {
			requestBody = {
				query: `
					mutation CreateUser($email: String!, $password: String!){
						createUser(userInput: {email: $email, password: $password}) {
							_id
							email
						}
					}
				`,
				variables: {
					email,
					password
				}
			}
		}

		fetch('http://localhost:9000/graphql',{
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => {
			if (res.status !== 200 && res.status !== 201) {
				throw new Error('Invalid Request')
			}
			return res.json()
		})
		.then(resData => {
			if (resData.data.login.token) {
				this.context.login(
					resData.data.login.token,
					resData.data.login.userId,
					resData.data.login.tokenExpiration
				)
			}
		})
		.catch(err => {
			console.log(err)
		})
	}

	render(){
		return (
			<form className="auth-form" onSubmit={this.submitHandler}>
				<div className="form-control">
					<label htmlFor="email">E-Mail</label>
					<input type="email" id="email" ref={this.emailEl}/>
				</div>
				<div className="form-control">
					<label htmlFor="password">Password</label>
					<input type="password" id="password" ref={this.passwordEl}/>
				</div>
				<div className="form-actions">
					<button type="submit">Submit</button>
					<button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? "Sign Up" : "Log In"}</button>
				</div>
			</form>
		)
	}
}

export default AuthPage