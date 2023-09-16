const axios = require("axios");

const TOKEN = "6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo";
const apiUrl = `https://api.telegram.org/bot${TOKEN}/getMe`;

axios
  .get(apiUrl)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Error calling the API:", error);
  });
