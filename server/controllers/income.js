import Income from "../models/IncomeModel.js";


// Function for add a new income entry
async function handleCreateIncome(req, res){
    try {
        const newIncome = new Income(req.body);
        const savedIncome = await newIncome.save();
        res.status(201).json({ success: true, data: savedIncome });
      } catch (error) {
        console.error("Error adding income:", error.message);
        res.status(400).json({ success: false, message: error.message });
      }
};


// Function for get all income entries 
async function handleGetIncome(req, res){
    try {
        const incomes = await Income.find()
          .populate("category", "name")
          .populate("user", "username");
        res.status(200).json({ success: true, data: incomes });
      } catch (error) {
        console.error("Error fetching incomes:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
      }
};

export {
    handleCreateIncome,
    handleGetIncome,
}