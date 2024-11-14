require("dotenv").config(); 

const app = require("./app.js");
const debug = require("debug")("app:server");

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    debug(`Server is running on port ${PORT}`);
    
});