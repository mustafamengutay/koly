# koly

Note: **koly** is still an **MVP**. I am aware of some of the techniques that can make the project better. All of those will be implemented in the future.

The main idea of “koly” is to provide a dynamic issue report for projects and project teams. It is a lightweight, fast and productive tool to track all issues of a project that are reported by the team members. **koly** displays all issues which can be adopted by a team member(s), or can be assigned to a team member(s) by their team leader. **koly** provides features that allow you to manage projects without any learning curve and complexity.

## Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version 20.16.0 or later.
- Install [Redis](https://redis.io/downloads/) version 7.2.5 or later.
- Install [PostgreSQL](https://www.postgresql.org/download/) version 16.0 or later.

## .env File Documentation

This file contains configuration settings for the tool. Each environment variable provides necessary information for different components. So, be sure that you added all those variables.

| Name         | Description                                 | Example Value                                               |
| ------------ | ------------------------------------------- | ----------------------------------------------------------- |
| PORT         | The port on which the server will listen    | 3000                                                        |
| DATABASE_URL | The address of your database server         | postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public |
| JWT_SECRET   | A secret key for the authentication feature | any text                                                    |
| REDIS_URI    | The address of the redis server             | redis://127.0.0.1:6379                                      |

### DATABASE_URL Format

| Name     | Description                                    | Example Value                          |
| -------- | ---------------------------------------------- | -------------------------------------- |
| USER     | The username to connect to the database        | username                               |
| PASSWORD | The password for your database user            | password (empty if you do not have it) |
| HOST     | The address of the database server             | localhost                              |
| PORT     | The port where your database server is running | 5432                                   |
| DATABASE | The name of the database                       | koly                                   |

```bash
# Example
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

## Getting started

- Clone the repository

```bash
git clone  https://github.com/mustafamengutay/koly.git
```

- Install dependencies

```bash
cd koly
npm i

cd koly/server
npm i

npx prisma generate
```

- Run the server in the development mode

```bash
cd koly/server

# 1. Run the redis/redis-stack server. Eg: redis-stack-server

npm run dev
```
