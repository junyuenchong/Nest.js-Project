import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin',
  database: 'BLOG',
  entities: ['src/users/entities/user.entity.ts', 'src/users/entities/user-profile.entity.ts', 'src/posts/entities/post.entity.ts', 'src/tags/entities/tag.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
}); 