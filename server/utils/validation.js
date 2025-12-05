// Input validation utilities
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    // Min 8 chars, 1 uppercase, 1 number, 1 special char
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

export const validateAmount = (amount) => {
    return !isNaN(amount) && amount > 0;
};

export const validateDate = (date) => {
    return !isNaN(Date.parse(date));
};

export const validateTransactionRequest = (body) => {
    const errors = [];

    if (!body.type || !["income", "expense", "transfer"].includes(body.type)) {
        errors.push("Invalid transaction type");
    }
    if (!body.amount || !validateAmount(body.amount)) {
        errors.push("Invalid amount");
    }
    if (!body.category) {
        errors.push("Category is required");
    }
    if (!body.account) {
        errors.push("Account is required");
    }
    if (!body.description || body.description.trim().length === 0) {
        errors.push("Description is required");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateBudgetRequest = (body) => {
    const errors = [];

    if (!body.category) {
        errors.push("Category is required");
    }
    if (!body.limit || !validateAmount(body.limit)) {
        errors.push("Invalid limit amount");
    }
    if (!["daily", "weekly", "monthly", "quarterly", "yearly"].includes(body.period)) {
        errors.push("Invalid period");
    }
    if (!body.startDate || !validateDate(body.startDate)) {
        errors.push("Invalid start date");
    }
    if (!body.endDate || !validateDate(body.endDate)) {
        errors.push("Invalid end date");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const sanitizeInput = (input) => {
    if (typeof input === "string") {
        return input.trim().replace(/[<>]/g, "");
    }
    return input;
};
