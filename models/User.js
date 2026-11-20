const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: String,
    role: {
        type: String,
        enum: ["admin", "elev"],
        default: "elev", 
        required: true
    }

})

const User = mongoose.model("User", userSchema);


module.exports = User;