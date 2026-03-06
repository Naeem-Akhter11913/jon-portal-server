

const createAdmin = async (req, res) => {
    try {
        res.status(200).send({
            status: true,
            message: "Happy to see you"
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error
        })
    }
}


module.exports = {
    createAdmin
}