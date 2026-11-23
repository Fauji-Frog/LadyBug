/**
 * BookMatch - Comprehensive Test Suite
 * Tests all 10 test cases specified in Project Requirement 10
 */

const AvailableBook = require('./models/AvailableBook');
const WantedBook = require('./models/WantedBook');
const Match = require('./models/Match');
const matchingService = require('./services/matchingService');
const matchController = require('./controllers/matchController');

const mongoose = require('mongoose');

// In-Memory Data Store for Tests
const db = {
  availableBooks: [],
  wantedBooks: [],
  matches: []
};

function generateId() {
  return new mongoose.Types.ObjectId();
}

// Set up Mongoose Model Mocks to run against our in-memory data store
function setupMocks() {
  // AvailableBook Mocks
  AvailableBook.create = async (doc) => {
    const record = { _id: generateId(), ...doc };
    db.availableBooks.push(record);
    return record;
  };

  AvailableBook.find = async (query = {}) => {
    return db.availableBooks.filter((book) => {
      if (query.status && book.status !== query.status) return false;
      return true;
    });
  };

  // WantedBook Mocks
  WantedBook.create = async (doc) => {
    const record = { _id: generateId(), ...doc };
    db.wantedBooks.push(record);
    return record;
  };

  WantedBook.find = async (query = {}) => {
    return db.wantedBooks.filter((book) => {
      if (query.status && book.status !== query.status) return false;
      return true;
    });
  };

  // Match Mocks
  Match.findOne = async (query = {}) => {
    return db.matches.find((m) => {
      if (query.availableBook && String(m.availableBook) !== String(query.availableBook)) return false;
      if (query.wantedBook && String(m.wantedBook) !== String(query.wantedBook)) return false;
      return true;
    }) || null;
  };

  Match.countDocuments = async () => {
    return db.matches.length;
  };

  Match.prototype.save = async function () {
    if (!this._id) {
      this._id = generateId();
    }
    db.matches.push(this);
    return this;
  };

  Match.find = function (query = {}) {
    let results = db.matches.filter((m) => {
      if (query.$or) {
        return query.$or.some((cond) => {
          if (cond.buyerId && m.buyerId === cond.buyerId) return true;
          if (cond.sellerId && m.sellerId === cond.sellerId) return true;
          return false;
        });
      }
      return true;
    });

    const chain = {
      populate(field) {
        results = results.map((item) => {
          const doc = item.toObject ? item.toObject() : { ...item };
          if (field === 'availableBook') {
            doc.availableBook = db.availableBooks.find((b) => String(b._id) === String(item.availableBook)) || item.availableBook;
          }
          if (field === 'wantedBook') {
            doc.wantedBook = db.wantedBooks.find((b) => String(b._id) === String(item.wantedBook)) || item.wantedBook;
          }
          return doc;
        });
        return chain;
      },
      sort() {
        return chain;
      },
      then(resolve) {
        resolve(results);
      }
    };
    return chain;
  };
}

// Helper mock response
function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
}

async function runTests() {
  console.log('====================================================');
  console.log('      BookMatch Backend - 10 Test Cases Suite       ');
  console.log('====================================================\n');

  setupMocks();

  let passedTests = 0;
  const totalTests = 10;

  try {
    // -----------------------------------------------------------------
    // TEST 1: Same Book ID + same edition = Match
    // -----------------------------------------------------------------
    const avail1 = await AvailableBook.create({
      bookId: 'BOOK101',
      bookTitle: 'Thomas Calculus',
      edition: '12th',
      price: 500,
      sellerId: 'STU01',
      sellerName: 'Student A',
      status: 'Available'
    });

    const want1 = await WantedBook.create({
      bookId: 'BOOK101',
      bookTitle: 'Thomas Calculus',
      edition: '12th',
      maxPrice: 600,
      buyerId: 'STU02',
      buyerName: 'Student B',
      status: 'Active'
    });

    const res1 = await matchingService.findAndCreateMatches();
    const match1 = await Match.findOne({ availableBook: avail1._id, wantedBook: want1._id });

    if (match1 && match1.bookTitle === 'Thomas Calculus' && match1.price === 500 && match1.notificationStatus === 'Unread') {
      console.log('✓ PASSED [Test 1]: Same Book ID + same edition = Match (Created with Unread notification).');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 1]: Same Book ID + same edition did not create match.');
    }

    // -----------------------------------------------------------------
    // TEST 2: Same Book ID + different edition = No Match
    // -----------------------------------------------------------------
    const avail2 = await AvailableBook.create({
      bookId: 'BOOK102',
      bookTitle: 'Data Structures',
      edition: '3rd',
      price: 400,
      sellerId: 'STU03',
      sellerName: 'Student C',
      status: 'Available'
    });

    const want2 = await WantedBook.create({
      bookId: 'BOOK102',
      bookTitle: 'Data Structures',
      edition: '4th', // Different edition
      maxPrice: 400,
      buyerId: 'STU04',
      buyerName: 'Student D',
      status: 'Active'
    });

    await matchingService.findAndCreateMatches();
    const match2 = await Match.findOne({ availableBook: avail2._id, wantedBook: want2._id });

    if (!match2) {
      console.log('✓ PASSED [Test 2]: Same Book ID + different edition = No Match.');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 2]: Match was incorrectly created for different editions.');
    }

    // -----------------------------------------------------------------
    // TEST 3: Missing or unknown edition = No Match
    // -----------------------------------------------------------------
    const avail3 = await AvailableBook.create({
      bookId: 'BOOK103',
      bookTitle: 'Algorithms',
      edition: 'Unknown',
      price: 450,
      sellerId: 'STU05',
      sellerName: 'Student E',
      status: 'Available'
    });

    const want3 = await WantedBook.create({
      bookId: 'BOOK103',
      bookTitle: 'Algorithms',
      edition: 'Unknown',
      maxPrice: 500,
      buyerId: 'STU06',
      buyerName: 'Student F',
      status: 'Active'
    });

    await matchingService.findAndCreateMatches();
    const match3 = await Match.findOne({ availableBook: avail3._id, wantedBook: want3._id });

    if (!match3) {
      console.log('✓ PASSED [Test 3]: Missing or unknown edition = No Match.');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 3]: Match was incorrectly created for Unknown edition.');
    }

    // -----------------------------------------------------------------
    // TEST 4: Different prices = Match
    // -----------------------------------------------------------------
    const avail4 = await AvailableBook.create({
      bookId: 'BOOK104',
      bookTitle: 'Operating Systems',
      edition: '9th',
      price: 700, // Seller price 700
      sellerId: 'STU07',
      sellerName: 'Student G',
      status: 'Available'
    });

    const want4 = await WantedBook.create({
      bookId: 'BOOK104',
      bookTitle: 'Operating Systems',
      edition: '9th',
      maxPrice: 300, // Buyer price 300
      buyerId: 'STU08',
      buyerName: 'Student H',
      status: 'Active'
    });

    await matchingService.findAndCreateMatches();
    const match4 = await Match.findOne({ availableBook: avail4._id, wantedBook: want4._id });

    if (match4 && match4.price === 700) {
      console.log('✓ PASSED [Test 4]: Different prices = Match (Seller price 700 successfully preserved).');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 4]: Match was not created when prices differed.');
    }

    // -----------------------------------------------------------------
    // TEST 5: Sold or unavailable book = No Match
    // -----------------------------------------------------------------
    const avail5 = await AvailableBook.create({
      bookId: 'BOOK105',
      bookTitle: 'Computer Networks',
      edition: '5th',
      price: 550,
      sellerId: 'STU09',
      sellerName: 'Student I',
      status: 'Sold' // Sold
    });

    const want5 = await WantedBook.create({
      bookId: 'BOOK105',
      bookTitle: 'Computer Networks',
      edition: '5th',
      maxPrice: 600,
      buyerId: 'STU10',
      buyerName: 'Student J',
      status: 'Active'
    });

    await matchingService.findAndCreateMatches();
    const match5 = await Match.findOne({ availableBook: avail5._id, wantedBook: want5._id });

    if (!match5) {
      console.log('✓ PASSED [Test 5]: Sold or unavailable book = No Match.');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 5]: Match was incorrectly created for a Sold book.');
    }

    // -----------------------------------------------------------------
    // TEST 6: Inactive wanted listing = No Match
    // -----------------------------------------------------------------
    const avail6 = await AvailableBook.create({
      bookId: 'BOOK106',
      bookTitle: 'Artificial Intelligence',
      edition: '4th',
      price: 650,
      sellerId: 'STU11',
      sellerName: 'Student K',
      status: 'Available'
    });

    const want6 = await WantedBook.create({
      bookId: 'BOOK106',
      bookTitle: 'Artificial Intelligence',
      edition: '4th',
      maxPrice: 700,
      buyerId: 'STU12',
      buyerName: 'Student L',
      status: 'Inactive' // Inactive
    });

    await matchingService.findAndCreateMatches();
    const match6 = await Match.findOne({ availableBook: avail6._id, wantedBook: want6._id });

    if (!match6) {
      console.log('✓ PASSED [Test 6]: Inactive wanted listing = No Match.');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 6]: Match was incorrectly created for an Inactive wanted book.');
    }

    // -----------------------------------------------------------------
    // TEST 7: Existing match = No duplicate
    // -----------------------------------------------------------------
    const countBefore = await Match.countDocuments();
    const dupResult = await matchingService.findAndCreateMatches();
    const countAfter = await Match.countDocuments();

    if (countBefore === countAfter && dupResult.matchesCreated === 0 && dupResult.matchesSkipped > 0) {
      console.log(`✓ PASSED [Test 7]: Existing match = No duplicate (Skipped ${dupResult.matchesSkipped} duplicates).`);
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 7]: Duplicate match was created.');
    }

    // -----------------------------------------------------------------
    // TEST 8: Buyer can retrieve their matches
    // -----------------------------------------------------------------
    const reqBuyer = { params: { studentId: 'STU02' } };
    const resBuyer = createMockRes();
    await matchController.getStudentMatches(reqBuyer, resBuyer);

    if (
      resBuyer.statusCode === 200 &&
      resBuyer.body.success === true &&
      resBuyer.body.data.length > 0 &&
      resBuyer.body.data[0].buyerId === 'STU02'
    ) {
      console.log('✓ PASSED [Test 8]: Buyer (STU02) can retrieve their matches.');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 8]: Buyer could not retrieve their matches.');
    }

    // -----------------------------------------------------------------
    // TEST 9: Seller can retrieve their matches
    // -----------------------------------------------------------------
    const reqSeller = { params: { studentId: 'STU01' } };
    const resSeller = createMockRes();
    await matchController.getStudentMatches(reqSeller, resSeller);

    if (
      resSeller.statusCode === 200 &&
      resSeller.body.success === true &&
      resSeller.body.data.length > 0 &&
      resSeller.body.data[0].sellerId === 'STU01'
    ) {
      console.log('✓ PASSED [Test 9]: Seller (STU01) can retrieve their matches.');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 9]: Seller could not retrieve their matches.');
    }

    // -----------------------------------------------------------------
    // TEST 10: Running matching API multiple times does not create duplicates
    // -----------------------------------------------------------------
    const totalBeforeApi = await Match.countDocuments();
    const resApi1 = createMockRes();
    const resApi2 = createMockRes();

    await matchController.runMatching({}, resApi1);
    await matchController.runMatching({}, resApi2);

    const totalAfterApi = await Match.countDocuments();

    if (
      totalBeforeApi === totalAfterApi &&
      resApi1.body.summary.matchesCreated === 0 &&
      resApi2.body.summary.matchesCreated === 0
    ) {
      console.log('✓ PASSED [Test 10]: Running matching API multiple times does not create duplicates.');
      passedTests++;
    } else {
      console.error('✗ FAILED [Test 10]: Multiple matching API runs created duplicate records.');
    }

    console.log('\n====================================================');
    console.log(`FINAL RESULT: ${passedTests}/${totalTests} Tests Passed successfully!`);
    console.log('====================================================\n');

    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (err) {
    console.error('Unexpected error running tests:', err);
    process.exit(1);
  }
}

runTests();
