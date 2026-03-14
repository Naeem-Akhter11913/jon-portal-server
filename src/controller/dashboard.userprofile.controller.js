const companyModel = require("../models/company.model");


const addCompanyDetails = async (req, res) => {
    try {
        const { _id } = req.user;

        const isAlreadyExist = await companyModel.findOne({ userRef: _id });

        if (isAlreadyExist) {
            return res.status(409).send({
                status: false,
                message: "Your Data is already exists!."
            })
        }
        const body = req.body;
        const bodyToBeSave = { ...body, userRef: _id }

        const companyDetailsInstence = await companyModel.create(bodyToBeSave);

        await companyDetailsInstence.save();

        res.status(201).send({
            status: true,
            message: "Company Details Saved Successfully!."
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message || error
        });
    }
}

const updateCompanyDetails = async (req, res) => {
    try {
        const { _id } = req.user;

        const isAlreadyExist = await companyModel.findOne({ userRef: _id });

        if (!isAlreadyExist) {
            return res.status(409).send({
                status: false,
                message: "Your Information is nor present!."
            })
        }

        const { image, about, information, address, links } = req.body;

        if (image) isAlreadyExist.image = image;

        if (about) isAlreadyExist.about = about;

        if (information) isAlreadyExist.information = information;

        if (address) isAlreadyExist.address = address;

        if (links) isAlreadyExist.links = links;


        await isAlreadyExist.save();

        res.status(200).send({
            status: true,
            message: "Company Details Saved Successfully!."
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message || error
        });
    }
}

module.exports = {
    addCompanyDetails,
    updateCompanyDetails
}