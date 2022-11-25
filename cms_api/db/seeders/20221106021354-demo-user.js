"use strict";
const USERS_LIST = [
  {
    name: "Vruddhi Kapre",
    country_code: "91",
    phone_number: "7760882352",
    email: "vruddhi@yopmail.com",
    address: "Bangalore",
    role: "ADMIN",
    gender: "FEMALE",
    encrypted_password: "$2a$12$f6OMJ9gRcEPGriKXjSCFF.i/KBM4I6nuidQC5UHwfmt15.Sj6ye.a",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: "Prachi Koul",
    country_code: "91",
    phone_number: "7760882351",
    email: "prachi@yopmail.com",
    address: "Bangalore",
    role: "USER",
    gender: "FEMALE",
    encrypted_password: "$2a$12$f6OMJ9gRcEPGriKXjSCFF.i/KBM4I6nuidQC5UHwfmt15.Sj6ye.a",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    console.log("-- USERS SEEDING START --");
    await queryInterface.bulkInsert("users", USERS_LIST, {});
    console.log("-- USERS SEEDING COMPLETED --");
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users");
  },
};
