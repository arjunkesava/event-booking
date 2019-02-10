const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')

module.exports = {
    createUser: async args => {
        try {
            // Find for user email existence
            const checkUserExists = await User.findOne({
                email: args.userInput.email
            })
            if (checkUserExists) {
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
    login: async ({email, password}) => {
        const user = await User.findOne({email: email})
        if(!user){
            throw new Error('User not found')
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if(!isEqual){
            throw new Error('Wrong password')
        }
        const token = jwt.sign(
            {userId: user._id, email: user.email},
            'someSecretKey',
            {expiresIn: '1h'}
        )
        return {
            userId: user._id,
            token: token,
            tokenExpiration: 1
        }
    }
}