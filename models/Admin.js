const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['Staff', 'Admin'],
        default: 'Admin'
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    lastLogin: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: true
    },
    resetToken : String,
    OTP: String,
    resetOTPExpiry: Date,
    OTPversion :{
        type:Number,
        default:0,
    },
    resetTokenExpiry: Date,
    tokenVersion: {
        type: Number,
        default: 0
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lockLevel: { type: Number, default: 0 }, 
    lockedManually: { type: Boolean, default: false },

},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
 }
)

module.exports = mongoose.model('Admin',AdminSchema)