const mongoose = require('mongoose');
const { Schema } = mongoose;

const companyModelInstence = new Schema({
    userRef: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    information: {
        logo: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        industryType: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        numberOfEmp: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },

    address: {
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        fullAddress: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },

    links: {
        linkedin: {
            type: String,
            required: true
        },
        x: {
            type: String,
            required: true
        },
        facebook: {
            type: String,
            required: true
        },
        instagram: {

        }
    },
},{timestamps: true});

module.exports = mongoose.model('companyModel', companyModelInstence);