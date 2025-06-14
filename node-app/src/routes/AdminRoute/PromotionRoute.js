const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");

const {
    getPromotion
} = require("../../controller/AdminController/PromotionController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const CRUDBrand = (app) => {
    router.get("/getAllPromotion", getPromotion);
    return app.use("/api/v1/admin/promotion/", router);
};

module.exports = CRUDBrand;
