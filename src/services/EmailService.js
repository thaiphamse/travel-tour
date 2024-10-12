const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const moment = require('moment')
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, //
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_APPLICATION_PASSWORD,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

const sendEmailCreateOrder = async ({ to, data }) => {

  let htmlTemplate = `
  <!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Thành Công</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            margin-top: 20px;
        }
        .content h2 {
            color: #333333;
        }
        .content p {
            color: #666666;
        }
        .content .details {
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .content .details p {
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #888888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thông Báo Booking Thành Công</h1>
        </div>
        <div class="content">
            <h2>Xin chào ${data.fullname},</h2>
            <p>Chúng tôi đã nhận được booking của bạn. Booking của bạn sẽ được nhân viên của chúng tôi gọi điện để xác nhận trong thời gian sớm nhất.</p>
            <p>Dưới đây là thông tin chi tiết của booking:</p>
            <div class="details">
                <p><strong>Mã booking:</strong> ${data._id}</p>
                <p><strong>Tour:</strong> ${data.tour_id.name}</p>
                <p><strong>Thời gian khởi hành:</strong> ${moment(data.start_date).format('L')}</p>
                <p><strong>Thời gian kết thúc:</strong> ${moment(data.end_date).format('L')}</p>
                <p><strong>Số lượng người:</strong> ${data.adult_ticket + data.child_ticket}</p>
                <p><strong>Địa chỉ:</strong> ${data.address}</p>
                <p><strong>Ghi chú thêm:</strong> ${data.note}</p>
                <p><strong>Tổng tiền:</strong> ${data.total_price} VND</p>
                <p><strong>Phương thức thanh toán:</strong> ${data.payment_method_name}</p>
                <p><strong>Điện thoại liên hệ:</strong> ${data.phone}</p>
                <p><strong>Trạng thái booking:</strong> Chờ thanh toán</p>
            </div>
            <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi. Chúng tôi rất mong được phục vụ bạn!</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ Tour miền tây</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 tourmientay475. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

  `
  await transporter.sendMail({
    from: "Admin Tour Miền Tây", // sender address
    to: to, // list of receivers
    subject: "Tạo booking thành công", // Subject line
    html: htmlTemplate
  });
};

const sendEmailPaymentConfirm = async ({ to, data }) => {
  try {
    let htmlTemplate = `
    <!DOCTYPE html>
  <html lang="vi">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Thành Công</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              background-color: #ffffff;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #4CAF50;
              color: white;
              text-align: center;
              padding: 10px 0;
          }
          .header h1 {
              margin: 0;
          }
          .content {
              margin-top: 20px;
          }
          .content h2 {
              color: #333333;
          }
          .content p {
              color: #666666;
          }
          .content .details {
              background-color: #f9f9f9;
              padding: 10px;
              border-radius: 5px;
              margin: 20px 0;
          }
          .content .details p {
              margin: 5px 0;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              color: #888888;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Thông Báo Thanh toán Booking Thành Công</h1>
          </div>
          <div class="content">
              <h2>Xin chào ${data.fullname},</h2>
              <p>Chúc mừng bạn đã thanh toán thành công! </p>
              <p>Dưới đây là thông tin chi tiết của booking:</p>
              <div class="details">
                  <p><strong>Mã booking:</strong> ${data._id}</p>
                  <p><strong>Tour:</strong> ${data.tour_id.name}</p>
                  <p><strong>Số lượng người:</strong> ${data.adult_ticket + data.child_ticket}</p>
                  <p><strong>Địa chỉ:</strong> ${data.address}</p>
                  <p><strong>Tổng tiền:</strong> ${data.total_price} VND</p>
                  <p><strong>Phương thức thanh toán:</strong> ${data.payment_method_name}</p>
                  <p><strong>Điện thoại liên hệ:</strong> ${data.phone}</p>
                  <p><strong>Trạng thái booking:</strong> Đã thanh toán. Chờ xác nhận của nhân viên</p>
                  <p><strong>Ngày thanh toán:</strong> ${moment(data.payment_date).format('L')}</p>
              </div>
              <p>Booking của bạn sẽ được nhân viên của chúng tôi gọi điện để xác nhận trong thời gian sớm nhất.</p>
              <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi. Chúng tôi rất mong được phục vụ bạn!</p>
              
              <p>Trân trọng,</p>
              <p>Đội ngũ Tour miền tây</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 tourmientay475. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  
    `

    await transporter.sendMail({
      from: "hoangphongvl2021@gmail.com", // sender address
      to: to, // list of receivers
      subject: "Thanh toán booking thành công", // Subject line
      html: htmlTemplate,
    });
  } catch (error) {
    console.log(error)
  }
};

const sendEmailSuccessBooking = async ({ to, data }) => {
  try {
    let htmlTemplate = `
    <!DOCTYPE html>
  <html lang="vi">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Thành Công</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              background-color: #ffffff;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #4CAF50;
              color: white;
              text-align: center;
              padding: 10px 0;
          }
          .header h1 {
              margin: 0;
          }
          .content {
              margin-top: 20px;
          }
          .content h2 {
              color: #333333;
          }
          .content p {
              color: #666666;
          }
          .content .details {
              background-color: #f9f9f9;
              padding: 10px;
              border-radius: 5px;
              margin: 20px 0;
          }
          .content .details p {
              margin: 5px 0;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              color: #888888;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Thông Báo Hoành Thành Xác Nhận Booking</h1>
          </div>
          <div class="content">
              <h2>Xin chào ${data.fullname},</h2>
              <p>Booking của bạn đã được nhân viên xác nhận </p>
              <p>Dưới đây là thông tin chi tiết của booking:</p>
              <div class="details">
                  <p><strong>Mã booking:</strong> ${data._id}</p>
                  <p><strong>Tour:</strong> ${data.tour_id.name}</p>
                  <p><strong>Số lượng người:</strong> ${data.adult_ticket + data.child_ticket}</p>
                  <p><strong>Địa chỉ:</strong> ${data.address}</p>
                  <p><strong>Thời gian khởi hành:</strong> ${moment(data.start_date).format('L')}</p>
                  <p><strong>Thời gian kết thúc:</strong> ${moment(data.end_date).format('L')}</p>
                  <p><strong>Ghi chú thêm:</strong> ${data.note}</p>
                  <p><strong>Điện thoại liên hệ:</strong> ${data.phone}</p>
                  <p><strong>Trạng thái booking:</strong>Thành công</p>
                  <p><strong>Ngày thanh toán:</strong> ${moment(data.payment_date).format('L')}</p>
                  <p><strong>Tên nhóm hướng dẫn:</strong> ${data.group_number}</p>
              </div>
              <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi. Chúng tôi rất mong được phục vụ bạn!</p>
              <p>Trân trọng,</p>
              <p>Đội ngũ Tour miền tây</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 tourmientay475. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  
    `

    await transporter.sendMail({
      to: to, // list of receivers
      subject: "Xác nhận booking thành công", // Subject line
      html: htmlTemplate,
    });
  } catch (error) {
    console.log(error)
  }
};
module.exports = {
  sendEmailCreateOrder,
  sendEmailPaymentConfirm,
  sendEmailSuccessBooking
};
