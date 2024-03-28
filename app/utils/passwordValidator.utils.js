const { isStrongPassword } = require('validator');

function validatePassword(password) {
  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  };

  return isStrongPassword(password, options);
}

module.exports = {
  validatePassword,
};