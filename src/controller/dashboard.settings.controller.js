const settingsModel = require('../models/settings.model');


const addSettings = async (req, res) => {
    try {

        const isExists = await settingsModel.findOne({ userId: req.user._id });

        if (isExists) {
            return res.status(409).send({
                status: false,
                message: "Oppse Your are Trying to add duplicate data. Please connect to your tech team!"
            })
        }

        const settingsInstence = await settingsModel.create({ ...req.body, userId: req.user._id });

        await settingsInstence.save();

        res.status(201).send({
            status: true,
            message: "Setting Info Saved Successfully!. "
        })
    } catch (error) {
        res.status(500).send({
            status: true,
            message: error.message || error
        })
    }
}
const updateSettings = async (req, res) => {
    try {
        const { jobPreferences, notifications, emailTemplates } = req.body;
        const isExists = await settingsModel.findOne({ userId: req.user._id });

        if (!isExists) {
            return res.status(409).send({
                status: false,
                message: "Oppse You don't have data to update. Please connect to your tech team!"
            })
        }

        if (emailTemplates) isExists.emailTemplates = emailTemplates;
        if (notifications) isExists.notifications = notifications;
        if (jobPreferences) isExists.jobPreferences = jobPreferences;

        await isExists.save();


        res.status(200).send({
            status: true,
            message: "Setting Info Saved Successfully!. "
        })
    } catch (error) {
        res.status(500).send({
            status: true,
            message: error.message || error
        })
    }
}


module.exports = {
    addSettings,
    updateSettings
}