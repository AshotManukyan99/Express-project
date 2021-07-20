const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'account created',
        html: `
            <h1>Welcome to our store</h1>
            <p>you have successfully created an account with email - ${email} </p>
            <hr>
            <a href="${keys.BASE_URL}">course shop</a>
        `
    }
}