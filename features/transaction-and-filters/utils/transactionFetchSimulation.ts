import {faker} from "@faker-js/faker";
import {
    type Transaction,
    type TransactionType,
    type ExpenseCategory,
    type IncomeCategory,
} from "@/features/transaction-and-filters/slices/transactionSlice";

interface ExpenseSource {
    category: ExpenseCategory;
    descriptions: string[];
    amountRange: [number, number];
}

interface IncomeSource {
    category: IncomeCategory;
    descriptions: string[];
    amountRange: [number, number];
}

const EXPENSE_SOURCES: ExpenseSource[] = [
    {category: "food", descriptions: ["Grocery Store", "Restaurant Dinner", "Coffee Shop", "Food Delivery", "Bakery", "Lunch Takeout"], amountRange: [5, 150]},
    {category: "transport", descriptions: ["Uber Ride", "Metro Pass", "Gas Station", "Parking Fee", "Toll Road", "Bus Ticket"], amountRange: [3, 80]},
    {category: "entertainment", descriptions: ["Netflix Subscription", "Movie Tickets", "Concert Ticket", "Gaming Purchase", "Spotify Premium", "Book Purchase"], amountRange: [5, 200]},
    {category: "utilities", descriptions: ["Electric Bill", "Water Bill", "Internet Service", "Phone Bill", "Gas Bill", "Trash Collection"], amountRange: [30, 250]},
    {category: "shopping", descriptions: ["Amazon Purchase", "Clothing Store", "Electronics Shop", "Home Depot", "Target Run", "IKEA Furniture"], amountRange: [15, 500]},
    {category: "health", descriptions: ["Pharmacy", "Doctor Visit", "Gym Membership", "Dental Checkup", "Vitamins & Supplements", "Eye Exam"], amountRange: [10, 300]},
    {category: "education", descriptions: ["Online Course", "Textbook Purchase", "Workshop Fee", "Certification Exam", "Tutoring Session"], amountRange: [20, 500]},
    {category: "rent", descriptions: ["Monthly Rent", "Apartment Insurance", "Storage Unit"], amountRange: [800, 2500]},
];

const INCOME_SOURCES: IncomeSource[] = [
    {category: "salary", descriptions: ["Monthly Salary", "Bi-weekly Paycheck"], amountRange: [2000, 8000]},
    {category: "freelance", descriptions: ["Freelance Project", "Consulting Fee", "Design Work", "Writing Gig"], amountRange: [200, 3000]},
    {category: "investment", descriptions: ["Dividend Payment", "Stock Sale", "Interest Income", "Bond Coupon"], amountRange: [50, 1500]},
];

export function generateTransactions(userId: string, count: number = 120): Transaction[] {
    // Deterministic seed from userId — same user, same dataset, every refresh.
    const seed = userId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    faker.seed(seed);

    const transactions: Transaction[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const isIncome = faker.number.float({min: 0, max: 1}) < 0.25;
        const type: TransactionType = isIncome ? "income" : "expense";
        const source = isIncome
            ? faker.helpers.arrayElement(INCOME_SOURCES)
            : faker.helpers.arrayElement(EXPENSE_SOURCES);
        const description = faker.helpers.arrayElement(source.descriptions);
        const amount = parseFloat(
            faker.number
                .float({min: source.amountRange[0], max: source.amountRange[1], fractionDigits: 2})
                .toFixed(2)
        );

        const daysAgo = faker.number.int({min: 0, max: 180});
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);

        transactions.push({
            id: faker.string.uuid(),
            date: date.toISOString(),
            description,
            amount,
            type,
            category: source.category,
            currency: "USD",
        });
    }

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return transactions;
}

export const simulateTxnFetchFromDb = async (userId: string): Promise<Transaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return generateTransactions(userId);
};
