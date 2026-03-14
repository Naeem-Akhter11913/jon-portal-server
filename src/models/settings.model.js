const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        jobPreferences: {
            defaultJobType: {
                type: String,
                enum: ["Full-time", "Part-time", "Internship", "Contract"],
                default: "Full-time"
            },
            defaultExperience: {
                type: String,
                default: "0-3 Years (Fresher)"
            },
            defaultSalaryRange: {
                type: String,
                default: "₹6-12 LPA"
            },
            autoCloseApplicationsAfter: {
                type: Number,
                default: 30
            },
            defaultInterviewMode: {
                type: String,
                enum: ["In-Person", "Online", "Hybrid"],
                default: "In-Person"
            }
        },

        notifications: {
            newApplications: {
                type: Boolean,
                default: true
            },
            candidateMessages: {
                type: Boolean,
                default: true
            },
            interviewRequests: {
                type: Boolean,
                default: false
            },
            weeklyReports: {
                type: Boolean,
                default: true
            }
        },

        emailTemplates: {
            newApplicationAutoReply: {
                type: Boolean,
                default: true
            },
            interviewInvitation: {
                type: Boolean,
                default: false
            },
            rejectionEmail: {
                type: Boolean,
                default: true
            },
            jobOfferEmail: {
                type: Boolean,
                default: false
            }
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("settings", settingsSchema);
