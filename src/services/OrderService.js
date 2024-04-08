const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
// const bcrypt = require("bcrypt");
const EmailService = require("./EmailService");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      isConfirm,
      isReceived,
      isEvaluate,
      paidAt,
      email,
    } = newOrder;
    try {
      const promises = orderItems?.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order?.product,
            countInStock: { $gte: order.amount }, //Tìm xem số lượng sản phẩm có trong kho có bằng số lượng mua không
          },
          {
            $inc: {
              countInStock: -order.amount, //Cập nhật số lượng sản phẩm
              selled: +order.amount, //Cập nhật số lượng sản phẩm đã mua
            },
          },
          { new: true }
        );

        if (productData) {
          return {
            status: "OK",
            message: "Success",
          };
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });

      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id);
        });
        resolve({
          status: "ERR",
          message: `San pham voi id: ${arrId.join(",")} khong du hang`,
        });
      } else {
        const createOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          isPaid,
          isConfirm,
          isReceived,
          isEvaluate,
          paidAt,
          email,
        });
        if (createOrder) {
          await EmailService.sendEmailCreateOrder(orderItems, email);
          resolve({
            status: "OK",
            message: "success",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data?.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order?.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount, //Cập nhật số lượng sản phẩm
              selled: -order.amount, //Cập nhật số lượng sản phẩm đã mua
            },
          },
          { new: true }
        );

        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: "ERR",
              message: "The order is not defined",
            });
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });

      const results = await Promise.all(promises);
      const newData = results && results[0] && results[0].id;
      console.log("newDtâ", newData);
      if (newData) {
        resolve({
          status: "ERR",
          message: `San pham voi id: ${arrId.join(",")} khong du hang`,
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();
      resolve({
        status: "OK",
        message: "success",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({
        _id: id,
      });
      if (checkOrder === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }
      const updateOrder = await Order.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "success",
        data: updateOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrder,
  getAllOrder,
  updateOrder,
};
