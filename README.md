<!-- @format -->

# Library Management API (Express + TypeScript + MongoDB via mongoose)

Welcome to the **Library Management System**, built using **Express.js**, **TypeScript**, and **MongoDB**. এই API ব্যবহার করে আপনি বই add, update, delete এবং borrow করতে পারবেন।

---

## Features

# **Book Management**

- Add new books (নতুন বই যোগ)
- Dynamic sorting and pagination
- Availability tracking with instance methods

# **Borrow System** (Aggregate pipeline)

- Borrow a book with quantity and due date
- Automatically updates available copies
- Prevents borrowing when stock is low
- See how many times each book has been borrowed
- Calculate total borrowed copies using Mongoose Aggregation Pipeline

---

## Technologies Used

- Express.js
- TypeScript
- MongoDB + Mongoose

---

## Important Concepts Used.

### 1. Instance Method in Mongoose

- আমি Book মডেলে একটি **instance method** ব্যবহার করেছি যার নাম `checkAvailability`।
- এটি copies এর উপর ভিত্তি করে book এর `available` status ঠিক করে।

```ts
// instance method
bookSchema.methods.checkAvailability = function () {
  this.available = this.copies > 0;
};

// used in pre-save hook
bookSchema.pre("save", function (next) {
  this.checkAvailability();
  next();
});
```

### 2. Aggregation Pipeline in MongoDB (four stage)

- আমি Book মডেলে একটি **instance method** ব্যবহার করেছি যার নাম `checkAvailability`।
- এটি copies এর উপর ভিত্তি করে book এর `available` status ঠিক করে।

```const result = await Borrow.aggregate([
      {
        // stage 1
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      // stage 2
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookSummary",
        },
      },
      // stage 3
      {
        $unwind: "$bookSummary",
      },
      // stage 4
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookSummary.title",
            isbn: "$bookSummary.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);
```

## **Error Handling**

- Proper validation and error responses.
- 404 & 400 level structured responses

## Instructions on setting up the project locally.

```bash
git clone https://github.com/helal9380/library-management-api.git
cd library-management-api

npm install

Create a .env file at the root of the project:

## Set environment variables
BONGODB_USER="helaldb"
BONGODB_PASSWORD="helaldb"
PORT=3000

npm run dev
```
