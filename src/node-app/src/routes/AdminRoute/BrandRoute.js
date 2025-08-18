const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");

const {
    getBrand
} = require("../../controller/AdminController/BrandController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const CRUDBrand = (app) => {
    router.get("/getAllBrand", getBrand);
    return app.use("/api/v1/admin/brand/", router);
};

module.exports = CRUDBrand;
