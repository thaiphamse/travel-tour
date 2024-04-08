const dotenv = require("dotenv");
dotenv.config;
const nodemailer = require("nodemailer");

const sendEmailCreateOrder = async (orderItems, email) => {
  console.log("orderItems, email", orderItems, email);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let listItem = "";
  const attachImage = [];
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
      <div>Bên dưới là hình ảnh của sản phẩm</div>
    </div>`;
    attachImage.push({ path: order.image });
  });

  // async..await is not allowed in global scope, must use a wrapper
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "hoangphongvl2021@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Bạn đã mua sản phẩm tại Decoration shop", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại shop </b></div> ${listItem}`,
    attachments: attachImage,
  });
};

const sendEmailUpdateProductToFollowers = async (data) => {
  console.log("product, data", data);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let productDetail = "";
  const attachImage = [];

  productDetail += `<div>
    <div>
      Tên sản phẩm là <b>${data?.name}</b> với giá: <b>${data?.price}</b>VND và giảm giá là: <b>${data?.discount}</b>%</div>
      <div>Bên dưới là hình ảnh của sản phẩm</div>
      </div>`;
  attachImage.push({ path: data.image });
  // async..await is not allowed in global scope, must use a wrapper
  // send mail with defined transport object
  const emails = data.followers.map((follower) => follower.email);
  const emailString = emails.join(", ");
  console.log("emailString", emailString);

  let info = await transporter.sendMail({
    from: "hoangphongvl2021@gmail.com", // sender address
    to: emailString != "" ? emailString : "hoangphongvl2021@gmail.com", // list of receivers
    subject: "Sản phẩm bạn theo dõi đã được cập nhật", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Sản phẩm đã thay đổi </b></div> ${productDetail}`,
    attachments: attachImage,
  });
};

const sendEmailOtp = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: "hoangphongvl2021@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Mã otp của bạn", // Subject line
    text: "Hello world?", // plain text body
    html: `<div>Mã OTP của bạn là ${otp}</div> không chia sẻ cho bất kì ai`,
  });
};

module.exports = {
  sendEmailCreateOrder,
  sendEmailUpdateProductToFollowers,
  sendEmailOtp,
};
