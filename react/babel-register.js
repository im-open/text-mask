const path = require("path");
require("@babel/register")({
  configFile: path.join(__dirname, "babel.config.js"),
});
console.log("Babel register configured for React project");
console.log(__dirname);
