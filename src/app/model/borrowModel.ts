/** @format */

import { model, Schema } from "mongoose";
import { IBorrow } from "../types/borrowType";
import { Book } from "./bookModel";

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// post save hook
borrowSchema.post("save", async function () {
  const book = await Book.findById(this.book);
  if (book) {
    book.copies -= this.quantity;
    book.checkAvailability();
    await book.save();
  }
});

export const Borrow = model("Borrow", borrowSchema);
