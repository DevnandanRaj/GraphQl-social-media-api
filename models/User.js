const { model, Schema } = require('mongoose')
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    followers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    }
});
module.exports = model("User", userSchema);