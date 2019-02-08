const bcrypt = require('bcrypt')
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
    }
}