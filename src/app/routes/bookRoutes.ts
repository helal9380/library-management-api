/** @format */

import express, { Request, Response } from "express";
import { Book } from "../model/bookModel";

export const bookRoutes = express.Router();

bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);
    await book.save();
    res.status(201).json({
      success: true,
      message: "The book created successfully",
      data: book,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Validation error", error });
  }
});

bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;
    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    const book = await Book.find(query)
      .sort({ [sortBy as string]: sort === "asc" ? 1 : -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

bookRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);
    if (!book)
      res
        .status(404)
        .json({ success: false, message: "Book not found", data: null });
    res.json({
      success: true,
      message: "Book retrieved succeefully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "invalid ID", error });
  }
});

bookRoutes.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updated = req.body;
    const book = await Book.findByIdAndUpdate(id, updated, {
      new: true,
      runValidators: true,
    });
    if (!book)
      res
        .status(404)
        .json({ success: false, message: "Book no found", data: null });
    res.json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Update failed", error });
  }
});
bookRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const book = await Book.findByIdAndDelete(id);
    res.json({
      success: true,
      meassage: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "delete faild", error });
  }
});
