const DB_CONFIG = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || "localhost",
  dialect: process.env.DB_ADAPTER || "postgres",
  logging: console.info,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deleteAt: "deleted_at",
  },
};

module.exports = DB_CONFIG;
