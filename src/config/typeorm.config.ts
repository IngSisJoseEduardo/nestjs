import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig : TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456789",
  database: "taskmanagement",
  entities: [__dirname +"/../**/*.entity{.ts,.js}"],
  synchronize: true
}
