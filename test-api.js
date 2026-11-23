const assert = require('assert');
const { normalizeTitle, escapeRegex } = require('./src/utils/bookHelper');
const Student = require('./src/models/Student');
const Book = require('./src/models/Book');
const AvailableBook = require('./src/models/AvailableBook');
const WantedBook = require('./src/models/WantedBook');
const Match = require('./src/models/Match');

console.log('==================================================');
console.log(' Running BookMatch Automated Validation Tests     ');
console.log('==================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } catch (error) {
    console.error(`[FAIL] ${testName}`);
    console.error(`       Error: ${error.message}`);
  }
}

// -----------------------------------------------------------------
// Test Suite 1: Title Normalization & Alias Rule Verification
// -----------------------------------------------------------------
console.log('--- Test Suite 1: Alias & Title Normalization Rules ---');

runTest('Rule 1: Converts title to lowercase', () => {
  const result = normalizeTitle('THOMAS CALCULUS');
  assert.strictEqual(result, 'thomas calculus');
});

runTest('Rule 2: Trims leading and trailing spaces', () => {
  const result = normalizeTitle('   Thomas Calculus   ');
  assert.strictEqual(result, 'thomas calculus');
});

runTest('Rule 3: Collapses multiple consecutive whitespace characters into a single space', () => {
  const result = normalizeTitle('Thomas     Calculus   14th   Edition');
  assert.strictEqual(result, 'thomas calculus 14th edition');
});

runTest('Rule 4: Handles empty or invalid inputs gracefully', () => {
  assert.strictEqual(normalizeTitle(''), '');
  assert.strictEqual(normalizeTitle(null), '');
  assert.strictEqual(normalizeTitle(undefined), '');
});

runTest('Rule 5: Escapes regex special characters safely', () => {
  const result = escapeRegex("Thomas' (Calculus) [Vol. 1] + Notes*");
  assert.strictEqual(result, "Thomas' \\(Calculus\\) \\[Vol\\. 1\\] \\+ Notes\\*");
});

// -----------------------------------------------------------------
// Test Suite 2: Model Validations
// -----------------------------------------------------------------
console.log('\n--- Test Suite 2: Mongoose Model Schema Validations ---');

runTest('Student Model: Requires name, email, and contact', () => {
  const student = new Student({});
  const err = student.validateSync();
  assert.ok(err.errors.name, 'Name should be required');
  assert.ok(err.errors.email, 'Email should be required');
  assert.ok(err.errors.contact, 'Contact should be required');
});

runTest('Student Model: Validates email format', () => {
  const invalidStudent = new Student({
    name: 'John Doe',
    email: 'not-an-email',
    contact: '1234567890'
  });
  const err = invalidStudent.validateSync();
  assert.ok(err.errors.email, 'Email format should fail validation');
});

runTest('Book Model: Requires bookId, title, and author', () => {
  const book = new Book({});
  const err = book.validateSync();
  assert.ok(err.errors.bookId, 'bookId should be required');
  assert.ok(err.errors.title, 'title should be required');
  assert.ok(err.errors.author, 'author should be required');
});

runTest('Book Model: Defaults aliases to an empty array', () => {
  const book = new Book({
    bookId: 'BOOK-101',
    title: 'Thomas Calculus',
    author: 'George B. Thomas'
  });
  assert.ok(Array.isArray(book.aliases));
  assert.strictEqual(book.aliases.length, 0);
});

runTest('AvailableBook Model: Requires price and rejects negative prices', () => {
  const negativePriceBook = new AvailableBook({
    studentId: '507f1f77bcf86cd799439011',
    bookId: 'BOOK-1001',
    title: 'Thomas Calculus',
    author: 'George B. Thomas',
    edition: '14th Edition',
    condition: 'Good',
    price: -10
  });
  const err = negativePriceBook.validateSync();
  assert.ok(err.errors.price, 'Negative price should be rejected');
});

runTest('AvailableBook Model: Requires valid condition enum', () => {
  const invalidConditionBook = new AvailableBook({
    studentId: '507f1f77bcf86cd799439011',
    bookId: 'BOOK-1001',
    title: 'Thomas Calculus',
    author: 'George B. Thomas',
    edition: '14th Edition',
    condition: 'DamagedBeyondRepair', // Invalid condition
    price: 30
  });
  const err = invalidConditionBook.validateSync();
  assert.ok(err.errors.condition, 'Invalid condition should be rejected');
});

runTest('WantedBook Model: Does NOT require price and defaults status to Active', () => {
  const wanted = new WantedBook({
    studentId: '507f1f77bcf86cd799439011',
    bookId: 'BOOK-1001',
    title: 'Thomas Calculus',
    author: 'George B. Thomas',
    edition: '14th Edition'
  });
  const err = wanted.validateSync();
  assert.strictEqual(err, undefined, 'WantedBook should validate without price');
  assert.strictEqual(wanted.status, 'Active');
});

runTest('Match Model: Validates buyer, seller, listings, bookId, and edition', () => {
  const match = new Match({
    buyerId: '507f1f77bcf86cd799439011',
    sellerId: '507f1f77bcf86cd799439012',
    availableBookId: '507f1f77bcf86cd799439013',
    wantedBookId: '507f1f77bcf86cd799439014',
    bookId: 'BOOK-1001',
    edition: '14th Edition'
  });
  const err = match.validateSync();
  assert.strictEqual(err, undefined, 'Match model should validate correctly');
  assert.strictEqual(match.status, 'Pending');
});

// -----------------------------------------------------------------
// Test Summary
// -----------------------------------------------------------------
console.log('\n==================================================');
console.log(` Test Results: ${passedTests} / ${totalTests} Passed`);
console.log('==================================================\n');

if (passedTests === totalTests) {
  console.log('All automated validation tests completed successfully!');
  process.exit(0);
} else {
  console.error('Some tests failed. Please review errors above.');
  process.exit(1);
}
