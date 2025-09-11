module.exports = {
  extends: "../babel.config.js",
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  include: ["../**/*.js", "../**/*.jsx"],
};
