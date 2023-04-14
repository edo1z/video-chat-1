module.exports = {
  files: ['./public/**/*.{css,html}', './views/**/*.hbs'],
  server: false,
  proxy: 'localhost:3000',
  port: 8080,
  open: false,
  notify: false,
};
