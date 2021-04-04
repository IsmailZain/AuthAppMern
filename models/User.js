const mongoose = require("mongoose")
const { Schema } = mongoose;


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    if (!foundUser) return false;


    // const isValid = await bcrypt.compare(password, foundUser.password);
    let isValid = false;
    let add1 = ""
    for (var i of foundUser.password) {
        add1 += (String.fromCharCode(i.charCodeAt(0) + 1))

    }
    var sortAlphabets = function (text) {
        return text.split('').sort().join('');
    };

    if (password === add1 || sortAlphabets(password) === sortAlphabets(foundUser.password)) {
        isValid = true
    }




    return isValid ? foundUser : false;
}

const User = mongoose.model("User", userSchema)
module.exports = User