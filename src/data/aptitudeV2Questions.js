export const APTITUDE_SECTIONS = [
  {
    id: "SECTION_A",
    title: "SECTION A",
    name: "Numerical aptitude",
    questionRange: "Questions 1–10",
    marks: 10,
    suggestedTime: "15 Minutes",
    description: "Evaluates number sequences, percentages, ratios, averages, time & work, probability, and basic algebra.",
    startId: 1,
    endId: 10,
  },
  {
    id: "SECTION_B",
    title: "SECTION B",
    name: "Logical reasoning",
    questionRange: "Questions 11–20",
    marks: 10,
    suggestedTime: "15 Minutes",
    description: "Evaluates logical deductions, letter series, sequence ordering, pattern exceptions, and analytical puzzles.",
    startId: 11,
    endId: 20,
  },
  {
    id: "SECTION_C",
    title: "SECTION C",
    name: "Analytical and data interpretation",
    questionRange: "Questions 21–30",
    marks: 10,
    suggestedTime: "15 Minutes",
    description: "Evaluates table data interpretation, percentage growth, averages, business profits, and ratios.",
    startId: 21,
    endId: 30,
  },
  {
    id: "SECTION_D",
    title: "SECTION D",
    name: "Computational thinking and problem-solving",
    questionRange: "Questions 31–40",
    marks: 10,
    suggestedTime: "15 Minutes",
    description: "Evaluates algorithmic logic, binary arithmetic, searching mechanisms, and systematic problem handling.",
    startId: 31,
    endId: 40,
  },
];

export const WEEKLY_SALES_TABLE = [
  { day: "Monday", units: 20 },
  { day: "Tuesday", units: 30 },
  { day: "Wednesday", units: 25 },
  { day: "Thursday", units: 45 },
  { day: "Friday", units: 30 },
];

export const aptitudeV2Questions = [
  // ==========================================
  // SECTION A: Numerical aptitude (Q1 - Q10)
  // ==========================================
  {
    id: 1,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "Find the next number in the sequence:\n3, 8, 15, 24, 35, ?",
    options: [
      { key: "A", text: "46" },
      { key: "B", text: "47" },
      { key: "C", text: "48" },
      { key: "D", text: "49" },
    ],
    answer: "C",
    explanation: "Differences between consecutive terms are +5, +7, +9, +11. The next difference is +13: 35 + 13 = 48 (or n² − 1 for n = 2, 3, 4, 5, 6, 7 where 7² − 1 = 48).",
  },
  {
    id: 2,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "A product's price increases by 25% and then decreases by 20%. Compared with its original price, the final price is:",
    options: [
      { key: "A", text: "5% higher" },
      { key: "B", text: "5% lower" },
      { key: "C", text: "The same" },
      { key: "D", text: "10% higher" },
    ],
    answer: "C",
    explanation: "Let the initial price be 100. After a 25% increase: 100 × 1.25 = 125. After a 20% decrease: 125 − (0.20 × 125) = 125 − 25 = 100. The final price is the same.",
  },
  {
    id: 3,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "The ratio of boys to girls in a class is 3:5. If there are 64 students, how many are girls?",
    options: [
      { key: "A", text: "24" },
      { key: "B", text: "32" },
      { key: "C", text: "40" },
      { key: "D", text: "48" },
    ],
    answer: "C",
    explanation: "Total ratio parts = 3 + 5 = 8 parts. Each part corresponds to 64 / 8 = 8 students. Number of girls = 5 × 8 = 40.",
  },
  {
    id: 4,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "The average of five numbers is 18. Four of those numbers add up to 68. What is the fifth number?",
    options: [
      { key: "A", text: "20" },
      { key: "B", text: "22" },
      { key: "C", text: "24" },
      { key: "D", text: "26" },
    ],
    answer: "B",
    explanation: "Total sum of the 5 numbers = 5 × 18 = 90. The fifth number = 90 − 68 = 22.",
  },
  {
    id: 5,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "If 2 workers can complete a task in 6 days, how many days would 3 equally efficient workers take, assuming a constant work rate?",
    options: [
      { key: "A", text: "3 days" },
      { key: "B", text: "4 days" },
      { key: "C", text: "6 days" },
      { key: "D", text: "9 days" },
    ],
    answer: "B",
    explanation: "Total required effort = 2 workers × 6 days = 12 worker-days. With 3 workers: 12 / 3 = 4 days.",
  },
  {
    id: 6,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "A bag contains 3 blue balls, 2 red balls and 1 green ball. One ball is selected randomly. What is the probability that it is not blue?",
    options: [
      { key: "A", text: "1/3" },
      { key: "B", text: "1/2" },
      { key: "C", text: "2/3" },
      { key: "D", text: "5/6" },
    ],
    answer: "B",
    explanation: "Total balls = 3 + 2 + 1 = 6. Balls that are not blue = 2 red + 1 green = 3. Probability = 3/6 = 1/2.",
  },
  {
    id: 7,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "An investment of ₹8,000 earns simple interest at 5% per annum for 2 years. What is the interest earned?",
    options: [
      { key: "A", text: "₹400" },
      { key: "B", text: "₹600" },
      { key: "C", text: "₹800" },
      { key: "D", text: "₹1,000" },
    ],
    answer: "C",
    explanation: "Simple Interest = (P × R × T) / 100 = (8000 × 5 × 2) / 100 = ₹800.",
  },
  {
    id: 8,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "Calculate 0.04 × 0.25.",
    options: [
      { key: "A", text: "0.1" },
      { key: "B", text: "0.01" },
      { key: "C", text: "0.001" },
      { key: "D", text: "1.0" },
    ],
    answer: "B",
    explanation: "0.04 × 0.25 = (4/100) × (25/100) = 100 / 10000 = 0.01.",
  },
  {
    id: 9,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "A vehicle travels 150 km in 2.5 hours at a constant speed. What is its speed?",
    options: [
      { key: "A", text: "50 km/h" },
      { key: "B", text: "55 km/h" },
      { key: "C", text: "60 km/h" },
      { key: "D", text: "65 km/h" },
    ],
    answer: "C",
    explanation: "Speed = Distance / Time = 150 km / 2.5 hours = 60 km/h.",
  },
  {
    id: 10,
    section: "SECTION A",
    sectionTitle: "Numerical aptitude",
    question: "Solve for x:\n3x − 7 = 2x + 9",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "9" },
      { key: "C", text: "16" },
      { key: "D", text: "18" },
    ],
    answer: "C",
    explanation: "3x − 2x = 9 + 7 ⇒ x = 16.",
  },

  // ==========================================
  // SECTION B: Logical reasoning (Q11 - Q20)
  // ==========================================
  {
    id: 11,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "All engineers are problem-solvers. Some problem-solvers are artists. Which conclusion must be true?",
    options: [
      { key: "A", text: "All engineers are artists." },
      { key: "B", text: "Some engineers are artists." },
      { key: "C", text: "No engineers are artists." },
      { key: "D", text: "None of the above conclusions necessarily follows." },
    ],
    answer: "D",
    explanation: "The problem-solvers who are artists may or may not overlap with engineers. Hence none of the statements is guaranteed to be true.",
  },
  {
    id: 12,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "Find the next letter in the sequence:\nB, E, I, N, T, ?",
    options: [
      { key: "A", text: "A" },
      { key: "B", text: "Z" },
      { key: "C", text: "B" },
      { key: "D", text: "C" },
    ],
    answer: "A",
    explanation: "Alphabet positions: B(2) + 3 = E(5); E(5) + 4 = I(9); I(9) + 5 = N(14); N(14) + 6 = T(20). Next addition is +7: 20 + 7 = 27 = 26 + 1 = A.",
  },
  {
    id: 13,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "Five people — P, Q, R, S and T — stand in a line. P stands before Q, Q stands before R, S stands after R, and T stands before P. Who must stand first?",
    options: [
      { key: "A", text: "P" },
      { key: "B", text: "Q" },
      { key: "C", text: "S" },
      { key: "D", text: "T" },
    ],
    answer: "D",
    explanation: "From the given conditions: T stands before P, P stands before Q, Q stands before R, and S stands after R. The order is T → P → Q → R → S. T stands first.",
  },
  {
    id: 14,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "Which number does not belong in the group?\n8, 27, 64, 100, 125",
    options: [
      { key: "A", text: "27" },
      { key: "B", text: "64" },
      { key: "C", text: "100" },
      { key: "D", text: "125" },
    ],
    answer: "C",
    explanation: "8 = 2³, 27 = 3³, 64 = 4³, and 125 = 5³ are all perfect cubes. 100 is a square (10²) but not a cube.",
  },
  {
    id: 15,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "If the day after tomorrow is Monday, what day is today?",
    options: [
      { key: "A", text: "Thursday" },
      { key: "B", text: "Friday" },
      { key: "C", text: "Saturday" },
      { key: "D", text: "Sunday" },
    ],
    answer: "C",
    explanation: "If the day after tomorrow is Monday, tomorrow is Sunday, and today is Saturday.",
  },
  {
    id: 16,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "Find the next number:\n4, 9, 19, 39, 79, ?",
    options: [
      { key: "A", text: "119" },
      { key: "B", text: "149" },
      { key: "C", text: "158" },
      { key: "D", text: "159" },
    ],
    answer: "D",
    explanation: "Each number is (previous number × 2) + 1: 4×2+1=9, 9×2+1=19, 19×2+1=39, 39×2+1=79. Next is 79×2+1 = 158 + 1 = 159 (or increments 5, 10, 20, 40, 80: 79+80=159).",
  },
  {
    id: 17,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "All squares are rectangles. Some rectangles are blue. Which statement is necessarily true?",
    options: [
      { key: "A", text: "All squares are blue." },
      { key: "B", text: "Some squares are blue." },
      { key: "C", text: "No squares are blue." },
      { key: "D", text: "None of A, B or C is necessarily true." },
    ],
    answer: "D",
    explanation: "The blue rectangles might not include any squares, or might include some or all. We cannot definitely conclude A, B, or C.",
  },
  {
    id: 18,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "A is taller than B. B is taller than C. D is taller than A. Who is the tallest?",
    options: [
      { key: "A", text: "A" },
      { key: "B", text: "B" },
      { key: "C", text: "C" },
      { key: "D", text: "D" },
    ],
    answer: "D",
    explanation: "Combining the heights: D > A > B > C. Therefore, D is the tallest.",
  },
  {
    id: 19,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "In a code, CAT is written as 3-1-20, using each letter's position in the English alphabet. How would DOG be written?",
    options: [
      { key: "A", text: "4-15-7" },
      { key: "B", text: "4-14-7" },
      { key: "C", text: "5-15-7" },
      { key: "D", text: "4-15-8" },
    ],
    answer: "A",
    explanation: "Alphabet positions: D = 4, O = 15, G = 7. Thus DOG is encoded as 4-15-7.",
  },
  {
    id: 20,
    section: "SECTION B",
    sectionTitle: "Logical reasoning",
    question: "Three boxes are labelled “Apples”, “Oranges” and “Mixed”. Every label is incorrect. Each box contains either only apples, only oranges, or a mixture of both. You may draw one fruit from one box without looking inside. Which box should you draw from to identify all three boxes' contents?",
    options: [
      { key: "A", text: "The box labelled Apples" },
      { key: "B", text: "The box labelled Oranges" },
      { key: "C", text: "The box labelled Mixed" },
      { key: "D", text: "Any box works equally well" },
    ],
    answer: "C",
    explanation: "Drawing from the box labelled 'Mixed' determines its exact contents (since its label is wrong, it cannot be mixed; it must be either all apples or all oranges). Once that box is identified, the remaining two boxes can be deduced immediately because neither matches its label.",
  },

  // ========================================================
  // SECTION C: Analytical and data interpretation (Q21 - Q30)
  // ========================================================
  {
    id: 21,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    hasTable: true,
    tableContext: "Use the Weekly sales table: Monday: 20, Tuesday: 30, Wednesday: 25, Thursday: 45, Friday: 30.",
    question: "How many units were sold in total during the five days?",
    options: [
      { key: "A", text: "140" },
      { key: "B", text: "145" },
      { key: "C", text: "150" },
      { key: "D", text: "155" },
    ],
    answer: "C",
    explanation: "Total units = 20 + 30 + 25 + 45 + 30 = 150 units.",
  },
  {
    id: 22,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    hasTable: true,
    tableContext: "Use the Weekly sales table: Monday: 20, Tuesday: 30, Wednesday: 25, Thursday: 45, Friday: 30.",
    question: "What was the average number of units sold per day?",
    options: [
      { key: "A", text: "25" },
      { key: "B", text: "30" },
      { key: "C", text: "35" },
      { key: "D", text: "40" },
    ],
    answer: "B",
    explanation: "Average units sold = Total units / Number of days = 150 / 5 = 30 units per day.",
  },
  {
    id: 23,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    hasTable: true,
    tableContext: "Use the Weekly sales table: Monday: 20, Tuesday: 30, Wednesday: 25, Thursday: 45, Friday: 30.",
    question: "What was the percentage increase in sales from Monday to Thursday?",
    options: [
      { key: "A", text: "100%" },
      { key: "B", text: "115%" },
      { key: "C", text: "125%" },
      { key: "D", text: "150%" },
    ],
    answer: "C",
    explanation: "Monday sales = 20, Thursday sales = 45. Increase = 45 − 20 = 25. Percentage increase = (25 / 20) × 100% = 125%.",
  },
  {
    id: 24,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    hasTable: true,
    tableContext: "Use the Weekly sales table: Monday: 20, Tuesday: 30, Wednesday: 25, Thursday: 45, Friday: 30.",
    question: "If each unit sold earns a profit of ₹40, what was the total profit on Wednesday's sales?",
    options: [
      { key: "A", text: "₹800" },
      { key: "B", text: "₹1,000" },
      { key: "C", text: "₹1,200" },
      { key: "D", text: "₹1,500" },
    ],
    answer: "B",
    explanation: "Wednesday sales = 25 units. Profit = 25 × ₹40 = ₹1,000.",
  },
  {
    id: 25,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    question: "A company has 200 customers. Of these, 60% use its mobile app. Of the app users, 25% also use its website. How many customers use both?",
    options: [
      { key: "A", text: "20" },
      { key: "B", text: "30" },
      { key: "C", text: "50" },
      { key: "D", text: "120" },
    ],
    answer: "B",
    explanation: "App users = 60% of 200 = 120. Customers who use both = 25% of 120 = 30.",
  },
  {
    id: 26,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    question: "A test has 80 questions. A student answers 75% of them and gets 80% of the attempted questions correct. How many answers are correct?",
    options: [
      { key: "A", text: "40" },
      { key: "B", text: "48" },
      { key: "C", text: "60" },
      { key: "D", text: "64" },
    ],
    answer: "B",
    explanation: "Questions attempted = 75% of 80 = 60. Correct answers = 80% of 60 = 48.",
  },
  {
    id: 27,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    question: "A shop's revenue increases from ₹50,000 to ₹65,000. What is the percentage increase?",
    options: [
      { key: "A", text: "15%" },
      { key: "B", text: "20%" },
      { key: "C", text: "25%" },
      { key: "D", text: "30%" },
    ],
    answer: "D",
    explanation: "Increase = ₹65,000 − ₹50,000 = ₹15,000. Percentage increase = (15,000 / 50,000) × 100% = 30%.",
  },
  {
    id: 28,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    question: "A machine produces 120 components in 4 hours. At the same constant rate, how many components will 3 identical machines produce in 5 hours?",
    options: [
      { key: "A", text: "300" },
      { key: "B", text: "360" },
      { key: "C", text: "450" },
      { key: "D", text: "600" },
    ],
    answer: "C",
    explanation: "Rate of 1 machine = 120 / 4 = 30 components/hour. Rate of 3 machines = 3 × 30 = 90 components/hour. In 5 hours = 90 × 5 = 450 components.",
  },
  {
    id: 29,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    question: "A class has 40 students. The average score is 70. If the average score of 10 students is 90, what is the average score of the remaining 30 students?",
    options: [
      { key: "A", text: "60" },
      { key: "B", text: "63 1/3" },
      { key: "C", text: "65" },
      { key: "D", text: "66 2/3" },
    ],
    answer: "B",
    explanation: "Total score of 40 students = 40 × 70 = 2,800. Score of 10 students = 10 × 90 = 900. Total of remaining 30 = 2,800 − 900 = 1,900. Average = 1,900 / 30 = 63 1/3 (or 63.33).",
  },
  {
    id: 30,
    section: "SECTION C",
    sectionTitle: "Analytical and data interpretation",
    question: "A business spends 40% of its monthly revenue on salaries and 25% on operating expenses. If its revenue is ₹2,00,000, how much remains after these two expenses?",
    options: [
      { key: "A", text: "₹50,000" },
      { key: "B", text: "₹60,000" },
      { key: "C", text: "₹70,000" },
      { key: "D", text: "₹80,000" },
    ],
    answer: "C",
    explanation: "Total percentage spent = 40% + 25% = 65%. Remaining percentage = 100% − 65% = 35%. Remaining amount = 35% of ₹2,00,000 = ₹70,000.",
  },

  // =========================================================================
  // SECTION D: Computational thinking and problem-solving (Q31 - Q40)
  // =========================================================================
  {
    id: 31,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "Consider the following instructions:\nSet x = 4.\nMultiply x by 3.\nSubtract 5 from the result.\nWhat is the final value of x?",
    options: [
      { key: "A", text: "5" },
      { key: "B", text: "7" },
      { key: "C", text: "9" },
      { key: "D", text: "12" },
    ],
    answer: "B",
    explanation: "Step 1: x = 4. Step 2: 4 × 3 = 12. Step 3: 12 − 5 = 7.",
  },
  {
    id: 32,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "A program adds the numbers 1, 2, 3 and 4 to a running total, starting at zero. What is the final total?",
    options: [
      { key: "A", text: "8" },
      { key: "B", text: "9" },
      { key: "C", text: "10" },
      { key: "D", text: "12" },
    ],
    answer: "C",
    explanation: "0 + 1 + 2 + 3 + 4 = 10.",
  },
  {
    id: 33,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "A system follows this rule: if a student's score is at least 50, display “Pass”; otherwise, display “Fail”. What does it display for a score of exactly 50?",
    options: [
      { key: "A", text: "Fail" },
      { key: "B", text: "Pass" },
      { key: "C", text: "No output" },
      { key: "D", text: "An error" },
    ],
    answer: "B",
    explanation: "'At least 50' means ≥ 50. Since 50 is equal to 50, the condition is met and 'Pass' is displayed.",
  },
  {
    id: 34,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "What is the decimal value of the binary number 10110₂?",
    options: [
      { key: "A", text: "18" },
      { key: "B", text: "20" },
      { key: "C", text: "22" },
      { key: "D", text: "24" },
    ],
    answer: "C",
    explanation: "1×2⁴ + 0×2³ + 1×2² + 1×2¹ + 0×2⁰ = 16 + 0 + 4 + 2 + 0 = 22.",
  },
  {
    id: 35,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "An algorithm must find the largest number in this list:\n7, 2, 9, 4, 6\nWhat should the algorithm return?",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "6" },
      { key: "C", text: "7" },
      { key: "D", text: "9" },
    ],
    answer: "D",
    explanation: "The maximum element among 7, 2, 9, 4, 6 is 9.",
  },
  {
    id: 36,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "An unsorted list contains 100 unique items. You search sequentially from the beginning for a target that happens to be the last item. How many comparisons are required?",
    options: [
      { key: "A", text: "1" },
      { key: "B", text: "10" },
      { key: "C", text: "50" },
      { key: "D", text: "100" },
    ],
    answer: "D",
    explanation: "Sequential (linear) search tests each item one by one starting from index 1. To reach the 100th item, exactly 100 comparisons are required.",
  },
  {
    id: 37,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "You need to identify duplicate entries in a list of customer IDs. Which approach is most reliable?",
    options: [
      { key: "A", text: "Check only the first and last entries." },
      { key: "B", text: "Compare each entry with every other entry." },
      { key: "C", text: "Assume entries are unique unless they look similar." },
      { key: "D", text: "Remove entries that contain numbers." },
    ],
    answer: "B",
    explanation: "Comparing every entry with every other entry (e.g., using a hash set or pairwise comparison) guarantees that any duplicate pair anywhere in the list will be detected.",
  },
  {
    id: 38,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "A delivery service wants to determine the shortest route between several locations. Which information is most useful to the algorithm?",
    options: [
      { key: "A", text: "The colour of each vehicle" },
      { key: "B", text: "Distances or travel costs between locations" },
      { key: "C", text: "The names of the drivers only" },
      { key: "D", text: "The number of letters in each location's name" },
    ],
    answer: "B",
    explanation: "Shortest route algorithms (like Dijkstra's or TSP solvers) require edge weights representing distances or travel costs between location vertices.",
  },
  {
    id: 39,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "An automated system gives incorrect results because its input data contains many missing values. What is the most appropriate first step?",
    options: [
      { key: "A", text: "Ignore the errors and deploy the system." },
      { key: "B", text: "Increase the number of users." },
      { key: "C", text: "Inspect the missing data and decide how to handle it." },
      { key: "D", text: "Change the system's name." },
    ],
    answer: "C",
    explanation: "In data engineering and AI, missing data must be audited first (data profiling) to decide on imputation, removal, or fallback strategies before processing.",
  },
  {
    id: 40,
    section: "SECTION D",
    sectionTitle: "Computational thinking and problem-solving",
    question: "You are designing a process that recommends books based on a person's reading preferences. Which approach is most sensible?",
    options: [
      { key: "A", text: "Recommend the same book to everyone." },
      { key: "B", text: "Recommend books randomly without considering preferences." },
      { key: "C", text: "Use relevant information about previous preferences to rank suitable books." },
      { key: "D", text: "Recommend only the longest books." },
    ],
    answer: "C",
    explanation: "A recommendation algorithm scores and ranks candidate items using historical user preferences, genres, and ratings.",
  },
];

/**
 * Calculates score and detailed section breakdown
 */
export const gradeAptitudeV2Submission = (userAnswers = {}) => {
  let totalScore = 0;
  const sectionBreakdown = {
    SECTION_A: { name: "Numerical aptitude", score: 0, total: 10 },
    SECTION_B: { name: "Logical reasoning", score: 0, total: 10 },
    SECTION_C: { name: "Analytical & data interpretation", score: 0, total: 10 },
    SECTION_D: { name: "Computational thinking & problem-solving", score: 0, total: 10 },
  };

  const detailedAnswers = aptitudeV2Questions.map((q) => {
    const selectedKey = userAnswers[q.id] || null;
    const isCorrect = selectedKey === q.answer;
    if (isCorrect) {
      totalScore += 1;
      if (q.id <= 10) sectionBreakdown.SECTION_A.score += 1;
      else if (q.id <= 20) sectionBreakdown.SECTION_B.score += 1;
      else if (q.id <= 30) sectionBreakdown.SECTION_C.score += 1;
      else sectionBreakdown.SECTION_D.score += 1;
    }

    const selectedOpt = q.options.find((o) => o.key === selectedKey);
    const correctOpt = q.options.find((o) => o.key === q.answer);

    return {
      questionId: q.id,
      section: q.section,
      sectionTitle: q.sectionTitle,
      question: q.question,
      selectedAnswerKey: selectedKey,
      selectedAnswerText: selectedOpt ? selectedOpt.text : "Not Answered",
      correctAnswerKey: q.answer,
      correctAnswerText: correctOpt ? correctOpt.text : "",
      isCorrect,
      explanation: q.explanation || "",
    };
  });

  const percentage = Number(((totalScore / aptitudeV2Questions.length) * 100).toFixed(1));

  let performanceRating = "Developing";
  if (percentage >= 85) performanceRating = "Exceptional (Advanced)";
  else if (percentage >= 70) performanceRating = "Proficient (High)";
  else if (percentage >= 50) performanceRating = "Moderate (Eligible)";

  return {
    score: totalScore,
    totalQuestions: aptitudeV2Questions.length,
    percentage,
    performanceRating,
    sectionBreakdown,
    detailedAnswers,
  };
};
