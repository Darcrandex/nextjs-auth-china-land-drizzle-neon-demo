# nextjs + neon + drizzle + smdp(QQ)

这是一个基于 nextjs 构建全栈项目模板。数据库使用 neon。并使用 drizzle 作为 ORM 工具。
另外，用户权限功能

参考文档

- [neon](https://orm.drizzle.team/docs/get-started/neon-new)
- [schema](https://orm.drizzle.team/docs/sql-schema-declaration)

## 创建项目

```bash
npx create-next-app@latest --use-pnpm
```

## 安装依赖

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

## 定义模型

> 注意，表结构需要登录 neon 创建项目并新建所需的表

在 `src/db/schema` 文件夹中定义每个表的模型；在 `drizzle.config.ts` 中定义配置

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // 数据库类型，本项目使用 postgresql
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'

  // 模型定义的文件夹
  schema: './src/db/schema',
})
```

## 连接数据库

新建 `.env` 文件，并定义环境变量；数据库地址从你的 neon 项目仪表盘中获取；
[connect-from-any-app](https://neon.tech/docs/connect/connect-from-any-app)

```
DATABASE_URL=<your neon db url>
```

新建 `src/db/index.ts`

```ts
import { drizzle } from 'drizzle-orm/neon-http'

export const db = drizzle(process.env.DATABASE_URL || '')
```
