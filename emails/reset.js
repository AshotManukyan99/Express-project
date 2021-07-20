const keys = require('../keys')


module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Reset Password',
        html: `
            <h1>Have you forgotten your password?</h1>
            <p>If not, ignore this letter </p>
            <p>Otherwise click the link below</p>
            <a clicktracking="off" href="${keys.BASE_URL}/auth/password/${token}">Reset Password</a>
        `
    }
}
