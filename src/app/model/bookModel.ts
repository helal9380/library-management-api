/** @format */

import { model, Schema } from "mongoose";
import { Genre, IBook } from "../types/bookType";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, enum: Object.values(Genre), required: true },
    isbn: { type: String, required: true, unique: true },
    description: String,
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// instence
bookSchema.methods.checkAvailability = function () {
  this.available = this.copies > 0;
};

// pre save hook
bookSchema.pre("save", function (next) {
  this.checkAvailability();
  next();
});

export const Book = model<IBook>("Book", bookSchema);
