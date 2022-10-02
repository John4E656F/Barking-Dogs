const nodemailer = require("nodemailer");

module.exports = class Email {
    constructor(user) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.from = `${process.env.EMAIL_FROM}`;
    }

    newTransport() {
        return nodemailer.createTransport({
            service: 'gmail',
            host: 'stmp.gmail.com',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(subject, text) {
        //Mail Option
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text
        };

        //Create a transport and send mail
        await this.newTransport().sendMail(mailOptions);
    }

    async senndWelcome() {
        await this.send("Welcome To Bark!", "Welcome to the Barking Community!");
    }

    async sendPasswordReset(url) {
        await this.send(
            "Reset Your Password",
            `Your Password Reset Token (valid for only 10 minutes): ${url}`
        );
    }
};