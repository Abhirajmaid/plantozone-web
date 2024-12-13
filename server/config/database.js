// module.exports = ({ env }) => ({
//   defaultConnection: "default",
//   connection: {
//     client: "postgres",
//     connection: {
//       host: env("DATABASE_HOST", "localhost"),
//       port: env.int("DATABASE_PORT", 5432),
//       database: env("DATABASE_NAME", "plantozone_db"),
//       user: env("DATABASE_USER", "postgres"),
//       password: env("DATABASE_PASSWORD", "12345678"),
//       schema: env("DATABASE_SCHEMA", "public"),
//     },
//   }
// });

module.exports = ({ env }) => ({
  defaultConnection: "default",
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "aws-0-ap-south-1.pooler.supabase.com"),
      port: env.int("DATABASE_PORT", 6543),
      database: env("DATABASE_NAME", "postgres"),
      user: env("DATABASE_USER", "postgres"),
      password: env("DATABASE_PASSWORD", "@bhir@j1166"),
      schema: env("DATABASE_SCHEMA", "public"),
    },
  }
});
