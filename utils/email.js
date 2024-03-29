const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const newUserEmail = (userEmail, userName, userPassword) => {
    sgMail.send({
        to: userEmail,
        from: 'devcrate300@gmail.com',
        subject: 'TOTUM ACCOUNT PASSWORD',
        text: `Congradulations ${userName} your account has been successfully created.
        Your password is ${userPassword}. Do not share this password. You can reset your password anytime`
    })
}

const welcomeEmail = (email) => {
    sgMail.send({
            to: email,
            from: 'devcrate300@gmail.com',
            subject: 'Account registration',
            text: `Welcome to Doves, . Thank you for choosing us.`
        }).then((response) => {
            console.log("mail::", response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error("mail error::", error)
        })
}

const cancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}


const paymentEmail = (email) => {
    sgMail.send({
        to: email,
        from: 'muvandie@gmail.com',
        subject: 'Payments',
        text: `You payment for the month of June has been processed.`
    })
}
const claimSubmittedEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'muvandie@gmail.com',
        subject: 'Claims',
        text: `Your claim has been submitted.`
    })
}
const claimProcessedEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'muvandie@gmail.com',
        subject: 'Claims',
        text: `Your claim has been processed.`
    })
}

const passwordResetEmail = (email, emailSubject, message) => {
    sgMail.send({
        to: email,
        from: 'muvandie@gmail.com',
        subject: emailSubject,
        text: message
    })
}

const depAddEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'muvandie@gmail.com',
        subject: 'Policy',
        text: `Dependent has been added to your policy.`
    })
}

const depRemoveEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'muvandie@gmail.com',
        subject: 'Policy',
        text: `Dependent has been removed from your account.`
    })
}

const waitingPeriodEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'muvandie@gmail.com',
        subject: 'Waiting Period',
        text: `6 month Waiting period has ended. You can now get the following services`
    })
}

module.exports = {
    newUserEmail,
    welcomeEmail,
    cancelationEmail,
    paymentEmail,
    claimSubmittedEmail,
    claimProcessedEmail,
    depAddEmail,
    depRemoveEmail,
    waitingPeriodEmail,
    passwordResetEmail

}