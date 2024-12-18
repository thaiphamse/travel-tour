const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const genneralAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "365d" }
  );
  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );
  return refresh_token;
};

const refreshTokenService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            status: "ERR",
            message: err,
          });
        }

        const access_token = await genneralAccessToken({
          id: user?.id,
          role: user?.role,
        });

        resolve({
          status: "OK",
          message: "success",
          access_token,
          // refresh_token,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getPayloadFromToken = (token) => {
  let decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
  return decoded
}
module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenService,
  getPayloadFromToken
};
