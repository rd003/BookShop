# Chapter & Verse

A web app for selling books.

## Tech used

- **Backend:** .NET 10
  - **Database:** Sqlite
  - **ORM**: Entity Framework Core

- **Frontend:** React 19
  - React hook form (form)
  - Zod (shema validation)
  - Tanstack query (server side state management and client side caching)
  - Shadcn (UI library)

## How to run project

- Clone the repo by firing `git clone https://github.com/rd003/BookShop.git`

- Run these commands in a sequence to run the dotnet app

```sh
# change directory
cd BookShop.Api

## run
dotnet run
```

- For running the front-end, run these commands in a sequence.

```sh
## Change directory
cd BookShop.Client

## Install dependencies
npm install

## run
npm run dev
```

## Admin credentials

When you run the app, it automatically creates the admin user with these credentials:

```txt
username: admin@example.com
password: Admin@123
```

## Screenshots

catalog:

![1](./Screenshots/1.jpg)

signup:

![2](./Screenshots/2.png)

Login:

![3](./Screenshots/3.png)

user menu:

![4](./Screenshots/4.png)

Cart:

![5](./Screenshots/5.png)

Select shipping address:

![6](./Screenshots/6.png)

Order success:

![7](./Screenshots/7.png)

User orders:

![8](./Screenshots/8.png)

Admin panel
![9](./Screenshots/9.png)
