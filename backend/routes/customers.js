const express = require("express");

const CustomerController = require("../controllers/customers");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, CustomerController.createCustomer);

router.put("/:id", checkAuth, extractFile, CustomerController.updateCustomer);

router.get("", checkAuth, CustomerController.getCustomers);

router.get("/:id", checkAuth, CustomerController.getCustomer);

//router.get("/download/:id", checkAuth,  PostController.dowloadFile);

router.delete("/:id", CustomerController.deleteCustomer);


module.exports = router;
