const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../middleware/mailer");
const User = require("../models/user");
const resetMail = require('../templates/reset')
const generator = require('generate-password');

exports.createUser = async (req, res, next) => {
  await User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: "Пользователь с таким e-mail уже зарегистрирован!"
        });
      }
      bcrypt.hash(req.body.password, 10).then(hash => {
        let role = "basic"
        console.log("req.body.admin", req.body.admin)
        if (req.body.admin){
            role = "admin"
        } 
        const user = new User({
          email: req.body.email,
          password: hash,
          role: role
        });
        user
          .save()
          .then(result => {
            res.status(201).json({
              message: "Новый пользователь зарегистрирован!",
              result: result
            });
          })
          .catch(err => {
            res.status(500).json({
              message: "Проверьте данные пользователя!"
            });
          });
      });
    })

}

exports.checkAdminPresent = async (req, res, next) => {
  let role = '';
  //console.log("req.body", req.body)
  if(req.body.admin){
    role = "admin"
  }
  await User.findOne({ role: role })
    .then(user => {
      if (user) {
        return res.status(202).json({
          status: true
        });
      } else if (!user) {
        return res.status(202).json({
          status: false
        });
      }
    })

}

exports.userLogin = async (req, res, next) => {
  let fetchedUser;
  await User.findOne({ email: req.body.email })
    .then(user => {
      //console.log(user)
      if (!user) {
        //console.log("Auth failed")
        return res.status(401).json({
          message: "Проверьте введённый email!"
        });

      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Пожалуйста проверьте пароль!"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id},
        //process.env.JWT_KEY,
        "private_key",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        role: fetchedUser.role, 
        email: fetchedUser.email
      });
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({
        message: "Проверьте данные пользователя!"
      });
    });
}

exports.changePassword = async (req, res, next) => {
      //console.log(req.body)
  await User.findOne({ _id: req.body.id })
    .then(user => {
      //console.log(req.body.email)
      if (!user) {
        return res.status(401).json({
          message: "Пользователь не найден!"
        });
      }
      bcrypt.hash(req.body.password, 10).then(hash => {
        user.password = hash
        user
          .save()
          .then(result => {
            res.status(201).json({
              message: "Пароль успешно изменёт!",
              result: result
            });
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              message: "Ошибка сохранения пароля!"
            });
          });
      });
    })

}



exports.reset = async (req, res, next) => {
  //console.log(req.body)
  let fetchedUser;
  await User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Проверьте введённый email!"
        });

      }
      fetchedUser = user;
      let password = generator.generate({
        length: 10,
        numbers: true
      });
      bcrypt.hash(password, 10).then(hash => {
        user.password = hash
          user.save()
          .then(result => {
            const mail = resetMail(req.body.email,password)
            mailer(mail)
            res.status(200).json({
              message: "Письмо со ссылкой отправлено, проверьте почтовый ящик.",
              result: result
            });

          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              status: "Проверьте данные пользователя!"
            });
          });
      });

    })

}



