export const Simulator = {
    calculate(income, fixedExpenses, variableExpenses, goalTarget, currentSavings) {
        const totalExpenses = fixedExpenses + variableExpenses;
        const surplus = income - totalExpenses;

        const remainingGoal = Math.max(0, goalTarget - currentSavings);
        const monthsToGoal = surplus > 0 ? Math.ceil(remainingGoal / surplus) : Infinity;

        const suggestions = [];
        if (surplus <= 0) {
            suggestions.push({
                text: "Your expenses exceed your income. Try reducing variable expenses.",
                impact: "high"
            });
        }
        if (variableExpenses > income * 0.3) {
            suggestions.push({
                text: "Variable expenses are high (>30%). Consider the 50/30/20 rule.",
                impact: "medium"
            });
        }
        if (surplus > 0 && monthsToGoal > 24) {
            const betterSurplus = surplus + (variableExpenses * 0.1);
            const betterMonths = Math.ceil(remainingGoal / betterSurplus);
            suggestions.push({
                text: `Cutting variable spend by 10% would save you ${monthsToGoal - betterMonths} months.`,
                impact: "medium"
            });
        }

        return {
            surplus,
            totalExpenses,
            monthsToGoal,
            breakdown: {
                fixed: fixedExpenses,
                variable: variableExpenses,
                savings: Math.max(0, surplus)
            },
            suggestions
        };
    }
};
