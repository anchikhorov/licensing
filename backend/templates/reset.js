//const keys = require('../keys')

module.exports = function(email, password) {
  return {
    to: email,
    from: "nodejs@mail.ru",
    subject: 'Восстановление пароля',
    html: `
      <h3>Восстановление пароля от системны лицензирования</h3>
      <p>Новый пароль пользователя ${email}: ${password}</p>`
      // <p><a href="http://localhost:3000/api/user/reset/${token}">Восстановить доступ</a></p>
    
  }
}