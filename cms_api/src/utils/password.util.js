const { genSalt, hash, compare } = require("bcryptjs");

const SALT_ROUNDS = 12;

const hashPassword = async password => {
    const salt = await genSalt(SALT_ROUNDS);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
}

const comparePassword = async (password, hashedPassword) => {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

module.exports = { hashPassword, comparePassword };