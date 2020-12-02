const Post = require("../models/post");
const moment = require('moment')
const licenseFile = require('nodejs-license-file')
const template = require('../templates/lic')
const key = require('../config/key')




licenseGen = (
               template, 
               orgname,
               email,
               firstname, 
               lastname, 
               appname,
               appversion,  
               licersion,
               hostid, 
               expdate) => {

  let licenseFileContent = "";
  try{
     licenseFileContent = licenseFile.generate({
          privateKeyPath: key.privateKey,
          template: template,
          data: {
              orgname: orgname,
              email: email,
              firstname: firstname,
              lastname: lastname,
              appname: appname,
              appversion: appversion,
              licersion: licersion,
              hostid: hostid,
              expdate: expdate
          }
      })
      
  } catch (err) {

      console.log(err);
  }
  //console.log("const licenseFileContent", licenseFileContent)
  return licenseFileContent;

}

function setExpirationDate(licversion) {
  let expirationDate = '';
  moment.locale('ru')
  switch (licversion) {
    case 'постоянная':
         expirationDate = moment().add(9999, 'days').calendar()
         break
    case 'на 30 дней':
         expirationDate = moment().add(30, 'days').calendar()
         break
  }       
  return expirationDate;
}

exports.createPost = async (req, res, next) => {
  // await Post.findOne({hostid: req.body.hostid, appname: req.body.appname, appversion: req.body.appversion })
  // .then(lic => {
  //   if (lic) {
  //     return res.status(401).json({
  //       message: "Лицензия для указанного ПО и Host ID уже есть в системе!"
  //     });
  //   }
    let expdate = setExpirationDate(req.body.licversion)
    let licenseFileContent = licenseGen(
      template, 
      req.body.orgname,
      req.body.email,
      req.body.firstname, 
      req.body.lastname,
      req.body.appname,
      req.body.appversion,  
      req.body.licversion,
      req.body.hostid, 
      expdate)
  console.log("req.body.hostid", req.body.hostid)
    const post = new Post({
      orgname: req.body.orgname,
      email: req.body.email,
      firstname: req.body.firstname, 
      lastname: req.body.lastname, 
      appname: req.body.appname,
      appversion: req.body.appversion,
      licversion: req.body.licversion,
      hostid: req.body.hostid,
      expdate: expdate,
      licensefile: licenseFileContent,
      gendatetime: moment().format("llll"),
      creator: req.userData.email
    });
    post
      .save()
      .then(createdPost => {
        res.status(201).json({
          message: "Лицензия сгенерирована успешно!",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: "Ошибка генерации лицензии!"
        });
      });
  //})

};


exports.updatePost = (req, res, next) => {

  const post = new Post({
    _id: req.body.id,
    orgname: req.body.orgname,
    email: req.body.email,
    firstname: req.body.firstName, 
    lastname: req.body.lastName, 
    appname: req.body.appname,
    appversion: req.body.appversion,
    licversion: req.body.licversion,
    hostid: req.body.hostid,
    creator: req.userData.email
  });
  Post.updateOne({ _id: req.params.id}, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Данные лицензии успешно обновлены!" });
      } else {
        res.status(401).json({ message: "Не достаточно прав!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Ошибка обновления лицензии!"
      });
    });
};

exports.dowloadFile = (req, res, next) => {
  //console.log(req.params['id'])
  Post.findOne({ _id: req.params['id'] })
  .then(post => { 
  //console.log(post)
  res.header('Content-disposition', `attachment; filename=${req.params['id']}.lic`);
  res.header('Content-Type', 'text/plain')
  res.header('Content-Security-Policy', 'upgrade-insecure-requests');
  res.charset = 'UTF-8';
  const lic = post.licensefile
  res.send(lic);
  })
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      //console.log("documents", documents)
      return Post.count();
    })
    .then(count => {
      //console.log("fetchedPosts", fetchedPosts)
      res.status(200).json({
        status: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(201).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};
