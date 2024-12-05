import Expense from "../models/expenseModel.js";


// Function for add a new expense
async function handleCreateExpense(req, res){
    try {
        const newExpense = new Expense(req.body);
        const savedExpense = await newExpense.save();
        res.status(201).json({ success: true, data: savedExpense });
      } catch (error) {
        console.error("Error adding expense:", error.message);
        res.status(400).json({ success: false, message: error.message });
      }
};


// Function for get all expenses
async function handleGetExpense(req, res){
    try {
        const expenses = await Expense.find({})
          .populate("category", "name")
          .populate("user", "username");
        res.status(200).json({ success: true, data: expenses });
      } catch (error) {
        console.error("Error fetching expenses:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
      }
};

module.exports = {
    handleCreateExpense,
    handleGetExpense,
}