const express = require("express");
const router = express.Router();
const moment = require("moment");

// Import controller functions
router.post("/create_payment_url", function (req, res, next) {
  console.log("req.bodyreq.body: ", req.body)
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // var tmnCode = "SQ2T80DZ";
  // var secretKey = "3ISEJ444992EJONGCPVUEXY1SKJIUG1O";
  // var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  var tmnCode = "I7I3JK33";
  var secretKey = "O4K1UDO9HFRFNW8HTSU8EGJI162HRVA3";
  var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  var returnUrl = req.body.returnUrl;

  if (!returnUrl || typeof returnUrl !== "string") {
    return res.status(400).json({ error: "Invalid returnUrl format" });
  }

  var moment = require("moment");
  var date = new Date();

  var createDate = moment(date).format("YYYYMMDDHHmmss");
  var orderId = req.body.orderId || moment(date).format("HHmmss");
  var amount = req.body.amount;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount format" });
  }

  var bankCode = req.body.bankCode || "";

  var orderInfo = req.body.orderDescription || "No description";
  var orderType = req.body.orderType || "other";
  var locale = req.body.language || "vn";
  var currCode = "VND";

  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;

  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = Math.round(amount * 100); // VND -> đồng

  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);

  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  console.log("Sorted Params:", vnp_Params);
  console.log("Sign Data:", signData);
  console.log("Generated Secure Hash:", signed);
  console.log("Generated vnpUrl:", vnpUrl); // Log URL để kiểm tra
  res.json({ url: vnpUrl });
});

module.exports = router;
