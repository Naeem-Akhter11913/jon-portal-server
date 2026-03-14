const transporter = require("./transporter");

const fs = require('fs');
const path = require('path');



const sendEmail = async (to, subject, fileName) => {
    try {
        const templatePath = path.join(__dirname, `./structure/${fileName}`);
        const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        const info = await transporter.sendMail({
            from: '"Naeem Akhter" <dreamabroad83@gmail.com>',
            to,
            subject,
            html: htmlTemplate,
        });
        return info.messageId
    } catch (error) {
        console.error(error.message || error)
    }
}

module.exports = sendEmail