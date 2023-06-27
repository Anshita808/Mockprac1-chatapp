const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        Username: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
        },
        Password: {
            type: String,
            required: true,
        },
        isVerified: { type: Boolean, default: false },
    },
    {
        versionKey: false,
    }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = {
    UserModel,
};
