require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const config = { backEndDomain: isProduction ? "https://used-car-prices-be.herokuapp.com" : "http://localhost:3001" }

module.exports = config;