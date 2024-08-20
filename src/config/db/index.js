const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb+srv://thaipham12:Xtera123@cluster0.znj9b.mongodb.net/travel?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect Successfully");
  } catch (error) {
    console.log("Connect Failure");
  }
}

module.exports = { connect };
