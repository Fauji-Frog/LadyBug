# LadyBug – BookMatch Backend & Database Development

Team LadyBug's collaborative development repository for the Live Coding Assessment.
This branch (`feature/nipun`) contains the **Backend and Database Development** for **BookMatch** – a university textbook exchange platform connecting students who want to sell or find used textbooks.

---

## 🛠️ Technology Stack
- **Runtime Environment:** Node.js (v18+)
- **Web Framework:** Express.js (v5)
- **Database:** MongoDB (Local or MongoDB Atlas)
- **Object Data Modeling (ODM):** Mongoose (v9)
- **Environment Management:** dotenv
- **Cross-Origin Requests:** cors

---

## 📁 Project Structure

```text
LadyBug/ (feature/nipun)
├── .env.example          # Sample environment variables template
├── .gitignore            # Git ignore list (node_modules, .env)
├── package.json          # Project manifest and scripts
├── server.js             # Main server entry point
├── test-api.js           # Automated validation and alias test suite
├── README.md             # Complete documentation and API guide
└── src/
    ├── config/
    │   └── db.js         # MongoDB connection with error resilience
    ├── models/
    │   ├── Student.js       # Student profile model
    │   ├── Book.js          # Master book catalog with aliases
    │   ├── AvailableBook.js # Seller textbook listings
    │   ├── WantedBook.js    # Buyer requested textbooks
    │   └── Match.js         # Textbook match records for integration
    ├── routes/
    │   ├── studentRoutes.js # Student registration and lookup routes
    │   ├── bookRoutes.js    # Book catalog, aliases, and search routes
    │   ├── listingRoutes.js # Available and wanted textbook listings
    │   ├── matchRoutes.js   # Match records API
    │   └── authRoutes.js    # Student authentication routes
    ├── utils/
    │   └── bookHelper.js    # Title normalization & alias lookup logic
    └── seed.js              # Sample data seeder (books, aliases, students)
```

---

## 🚀 How to Run the Backend

### 1. Prerequisites
- **Node.js** installed (`node -v` to check)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/bookmatch`) **OR** a cloud connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 2. Configure Environment Variables
Create a `.env` file in the project root (you can copy `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bookmatch
NODE_ENV=development
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed the Database with Sample Data
Run the seeder script to populate initial books (e.g. *Thomas Calculus*, *CLRS Algorithms*), verified aliases, sample students, and active listings:
```bash
npm run seed
```

### 5. Start the Server
- **Standard start:**
  ```bash
  npm start
  ```
- **Development mode (with auto-reload on file changes):**
  ```bash
  npm run dev
  ```

The server will start listening at:
```
http://localhost:5000
```

### 6. Run Automated Tests
```bash
npm test
```

---

## 🧠 Database Models Explained in Simple Language

### A. Student Model (`src/models/Student.js`)
Stores university student accounts.
- `name` (String, Required): Full name of the student.
- `email` (String, Required, Unique): University email used for identification.
- `contact` (String, Required): Phone number or messaging handle.
- `createdAt` / `updatedAt`: Auto-generated timestamps.

### B. Book Model (`src/models/Book.js`)
The master catalog of textbook titles.
- `bookId` (String, Required, Unique): A clean, human-readable identifier (e.g., `BOOK-1001`).
- `title` (String, Required): The official textbook title.
- `author` (String, Required): Primary author name.
- `aliases` (Array of Strings): Alternative names students use (e.g., `["Calculus Book", "Thomas' Calculus"]`).

### C. AvailableBook Model (`src/models/AvailableBook.js`)
Represents a physical textbook being offered by a student seller.
- `studentId` (ObjectId, Required): Reference to the seller.
- `bookId` (String, Required): Connects this listing to the master Book record.
- `title` & `author`: Textbook title and author.
- `edition` (String, Required): Specific edition (e.g., "14th Edition").
- `condition` (String, Required): Validated condition (`New`, `Like New`, `Good`, `Fair`, `Poor`).
- `price` (Number, Required): Non-negative selling price (e.g., `45.00`).
- `status` (String): Listing state (`Available`, `Reserved`, `Sold`).

### D. WantedBook Model (`src/models/WantedBook.js`)
Represents a textbook requested by a student buyer.
- `studentId` (ObjectId, Required): Reference to the buyer.
- `bookId` (String, Required): Connects to the master Book record.
- `title` & `author`: Textbook title and author.
- `edition` (String, Required): Desired edition.
- `status` (String): Request state (`Active`, `Closed`).
*(Note: Wanted listings do not have a price requirement).*

### E. Match Model (`src/models/Match.js`)
Stores match records between a buyer and a seller. Designed for seamless integration with the matching module.
- `buyerId` & `sellerId`: References to the two students.
- `availableBookId` & `wantedBookId`: References to the specific listings.
- `bookId` & `edition`: Shared Book ID and edition used by the matching module.
- `status`: State of the match (`Pending`, `Accepted`, `Completed`, `Cancelled`).

---

## 🔍 Manual Alias & Title Resolution System

Requirement 3 specifies a manual alias management system without AI or fuzzy guessing.

### How It Works:
1. When a student enters a book title (e.g., `"  Thomas   Calculus  "` or `"calculus book"`):
   - It is converted to lowercase: `"thomas calculus"` / `"calculus book"`.
   - Extra spaces and trailing whitespace are removed: `text.trim().toLowerCase().replace(/\s+/g, ' ')`.
2. The database searches both the `title` field and the `aliases` array for an exact case-insensitive match:
   ```javascript
   Book.findOne({
     $or: [
       { title: { $regex: /^thomas calculus$/i } },
       { aliases: { $regex: /^thomas calculus$/i } }
     ]
   });
   ```
3. **If found:** The existing `bookId` (e.g., `BOOK-1001`) is returned and reused.
4. **If not found:** The student or system can create a new Book record with a new `bookId`.
5. Two different titles are **never** assumed to be the same without an explicit verified alias.

---

## 🔗 Complete List of REST API Endpoints

### 1. Student APIs

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/students` | Register a new student | `{"name": "Alex Johnson", "email": "alex@university.edu", "contact": "+1-555-0101"}` |
| `GET` | `/api/students` | Get all registered students | None |
| `GET` | `/api/students/:id` | Get student details by MongoDB ID | None |

### 2. Book Catalog & Search APIs

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Get all books in catalog | None |
| `POST` | `/api/books` | Create a new book with aliases | `{"title": "Thomas Calculus", "author": "George Thomas", "aliases": ["Calculus Book"]}` |
| `POST` | `/api/books/resolve-title` | Check title against aliases and return Book ID | `{"title": "calculus book"}` |
| `GET` | `/api/books/search?q=calculus` | Search books by title or alias keyword | None (query parameter `q`) |
| `GET` | `/api/books/:id` | Get book by MongoDB ID or Book ID | None |
| `PUT` | `/api/books/:id` | Update title, author, or aliases | `{"aliases": ["Calculus Book", "Thomas' Calculus"]}` |
| `DELETE` | `/api/books/:id` | Remove a book from catalog | None |

### 3. Available Book Listing APIs (Sellers)

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/listings/available` | Create a seller listing | `{"studentId": "<ID>", "title": "Thomas Calculus", "author": "George Thomas", "edition": "14th", "condition": "Good", "price": 45}` |
| `GET` | `/api/listings/available` | List all available textbooks | Optional query filters: `?status=Available`, `?bookId=BOOK-1001` |
| `PUT` | `/api/listings/available/:id` | Update listing (price, status, condition) | `{"price": 40, "status": "Reserved"}` |
| `DELETE` | `/api/listings/available/:id` | Delete an available listing | None |

### 4. Wanted Book Listing APIs (Buyers)

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/listings/wanted` | Create a buyer wanted request | `{"studentId": "<ID>", "title": "Thomas Calculus", "author": "George Thomas", "edition": "14th"}` |
| `GET` | `/api/listings/wanted` | List all wanted textbooks | Optional query filters: `?status=Active`, `?bookId=BOOK-1001` |
| `PUT` | `/api/listings/wanted/:id` | Update wanted listing (status, edition) | `{"status": "Closed"}` |
| `DELETE` | `/api/listings/wanted/:id` | Delete a wanted listing | None |

### 5. Matching Integration APIs

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/matches` | Record a match between buyer and seller | `{"buyerId": "...", "sellerId": "...", "availableBookId": "...", "wantedBookId": "...", "bookId": "BOOK-1001", "edition": "14th"}` |
| `GET` | `/api/matches` | Get all matches | None |

---

## 📦 Consistent JSON Response Format

**Successful Response Example:**
```json
{
  "success": true,
  "message": "Book added successfully",
  "data": {
    "bookId": "BOOK-1001",
    "title": "Thomas Calculus",
    "author": "George B. Thomas",
    "aliases": ["Calculus Book", "Thomas' Calculus"]
  }
}
```

**Error Response Example:**
```json
{
  "success": false,
  "message": "Book condition is required and must be one of: New, Like New, Good, Fair, Poor"
}
```
