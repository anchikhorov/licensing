const Customer = require("../models/customer");
const moment = require('moment')


exports.createCustomer = (req, res, next) => {
  Customer.findOne({ orgname: req.body.orgname, country: req.body.country, locality: req.body.locality, street: req.body.street, house: req.body.house})
    .then(organisation => {
      if (organisation) {
        return res.status(401).json({
          message: "Организация с таким названием и по этому адресу уже зарегистрирована!"
        });
      }
      moment.locale('ru')
      const customer = new Customer({
        orgname: req.body.orgname,
        country: req.body.country,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        locality: req.body.locality,
        street: req.body.street,
        house: req.body.house,
        phone: req.body.phone,
        gendatetime: moment().format("llll"),
        creator: req.userData.email
      });
      customer
      .save()
      .then(createdCustomer => {
        res.status(201).json({
          message: "Организация добавлена успешно!",
          customer: {
            ...createdCustomer,
            id: createdCustomer._id
          }
        });
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: "Ошибка добавления организации!"
        });
      });
});
}

exports.updateCustomer = (req, res, next) => {

  const customer = new Customer({
    _id: req.body.id,
    orgname: req.body.orgname,
    country: req.body.country,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    locality: req.body.locality,
    street: req.body.street,
    house: req.body.house,
    phone: req.body.phone,
    creator: req.userData.email
  });
  Customer.updateOne({ _id: req.params.id}, customer)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Данные организации успешно обновлены!" });
      } else {
        res.status(401).json({ message: "Не достаточно прав!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Ошибка обновления данных организации!"
      });
    });
};


exports.getCustomers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const customersQuery = Customer.find();
  let fetchedCustomers;
  // if (pageSize && currentPage) {
  if (pageSize > 0 && currentPage > 0) {
    customersQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  customersQuery
    .then(documents => {
      fetchedCustomers = documents;
      return Customer.count();
    })
    .then(count => {
      res.status(200).json({
        status: "Список организаций выгружен успешно!",
        customers: fetchedCustomers,
        maxCustomers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Ошибка выгрузки списка организаций!"
      });
    });
};

exports.getCustomer = (req, res, next) => {
  Customer.findById(req.params.id)
    .then(customer => {
      if (customer) {
        res.status(201).json(customer);
      } else {
        res.status(404).json({ message: "Организация не найдена!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Ошибка выгрузки организации!"
      });
    });
};

exports.deleteCustomer = (req, res, next) => {
  Customer.deleteOne({ _id: req.params.id})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Организация удалена успешно!" });
      } else {
        res.status(401).json({ message: "Не достаточно прав!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Ошибка удаления организации!"
      });
    });
};
