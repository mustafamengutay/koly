# koly

The main idea of “koly” is to provide a dynamic issue report for products and product teams. It is a lightweight, fast and productive tool to track all issues of a product that are reported by the team members. **koly** displays all opened issues which can be taken by a team member(s), or can be assigned to a team member(s) by their team leader.

## Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version 20.16.0 or later.
- Install [PostgreSQL](https://www.postgresql.org/download/) version 16.0 or later.

## .env File Documentation

This file contains configuration settings for the tool. Each environment variable provides necessary information for different components. So, be sure that you added all those variables.

| Name         | Description                                 | Example Value                                               |
| ------------ | ------------------------------------------- | ----------------------------------------------------------- |
| PORT         | The port on which the server will listen    | 3000                                                        |
| DATABASE_URL | The address of your database server         | postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public |
| JWT_SECRET   | A secret key for the authentication feature | any text                                                    |

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
# First
cd koly-main
npm i

# Second
cd koly-main/server
npm i
```

- Build the project

```bash
# Will be added soon...
```

- Run the server of the project in the development mode

```bash
cd koly-main/server

npm run dev
```

- Build and run the server of the project

```bash
cd koly-main/server

npm run start
```

Navigate to `http://localhost:3000`
