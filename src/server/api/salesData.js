const express = require("express");
const salesRouter = express.Router();
const { createSale, getSalesByMonth, getAllSales, updateSale, deleteSale } = require("../db/salesData");

// Endpoint to create a new sale
salesRouter.post("/", async (req, res, next) => {
  try {
    const { month, sales } = req.body;
    const newSale = await createSale(month, sales);
    res.status(201).json(newSale);
  } catch (error) {
    next(error);
  }
});

// Endpoint to get sales data for a specific month
salesRouter.get("/:month", async (req, res, next) => {
  try {
    const { month } = req.params;
    const salesData = await getSalesByMonth(month);
    res.json(salesData);
  } catch (error) {
    next(error);
  }
});

// Endpoint to get all sales data
salesRouter.get("/", async (req, res, next) => {
  try {
    const allSales = await getAllSales();
    res.json(allSales);
  } catch (error) {
    next(error);
  }
});

// Endpoint to update a sales record
salesRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { month, sales } = req.body;
    const updatedSale = await updateSale(id, month, sales);
    res.json(updatedSale);
  } catch (error) {
    next(error);
  }
});

// Endpoint to delete a sales record
salesRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSale = await deleteSale(id);
    res.json(deletedSale);
  } catch (error) {
    next(error);
  }
});

module.exports = salesRouter;
