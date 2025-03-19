// Display custom notification
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(notification);
        }, 500);
    }, 5000);
}

// Initial Book Data with Image URLs
const books = [
    // Fiction
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", cover: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg", dueDate: null },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", cover: "https://m.media-amazon.com/images/I/81gepf1eMqL.jpg", dueDate: null },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", cover: "https://m.media-amazon.com/images/I/81TLiZrasVL._UF1000,1000_QL80_.jpg", dueDate: null },
    
    // History
    { id: 4, title: "Sapiens", author: "Yuval Noah Harari", category: "History", cover: "https://m.media-amazon.com/images/I/713jIoMO3UL.jpg", dueDate: null },
    { id: 5, title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "History", cover: "https://m.media-amazon.com/images/I/61V8g4GgqdL._AC_UF1000,1000_QL80_.jpg", dueDate: null },
    { id: 6, title: "The Silk Roads", author: "Peter Frankopan", category: "History", cover: "https://m.media-amazon.com/images/I/A15++jTYXJL.jpg", dueDate: null },
   
    // Self-Help
    { id: 11, title: "Atomic Habits", author: "James Clear", category: "Self-Help", cover: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg", dueDate: null },
    { id: 13, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", category: "Self-Help", cover: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg", dueDate: null },
    { id: 15, title: "Think and Grow Rich", author: "Napoleon Hill", category: "Self-Help", cover: "https://m.media-amazon.com/images/I/71UypkUjStL.jpg", dueDate: null }
];

// Initialize localStorage with books if empty
if (!localStorage.getItem('books')) {
    localStorage.setItem('books', JSON.stringify(books));
}
if (!localStorage.getItem('borrowedBooks')) {
    localStorage.setItem('borrowedBooks', JSON.stringify([]));
}

// Display Available Books with Cover Image URLs
function displayBooks(bookArray = null) {
    const bookList = document.getElementById('bookList');
    if (!bookList) return;

    bookList.innerHTML = '';

    const storedBooks = bookArray || JSON.parse(localStorage.getItem('books')) || [];

    if (storedBooks.length === 0) {
        bookList.innerHTML = `<p>No books found!</p>`;
        return;
    }

    storedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title} cover" class="book-cover">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Category: ${book.category}</p>
            <button onclick="borrowBook(${book.id})">Borrow</button>
        `;
        bookList.appendChild(bookDiv);
    });
}

// Search Books by Title, Author, or Category
function searchBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    if (query === '') {
        displayBooks();
        return;
    }

    const books = JSON.parse(localStorage.getItem('books')) || [];

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
    );

    displayBooks(filteredBooks);
}

// Display Borrowed Books with Image URLs
function displayBorrowedBooksPage() {
    const borrowedBooksDiv = document.getElementById('borrowedBooks');
    if (!borrowedBooksDiv) return;

    borrowedBooksDiv.innerHTML = '';
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    if (borrowedBooks.length === 0) {
        borrowedBooksDiv.innerHTML = `<p>No books borrowed yet!</p>`;
        return;
    }

    borrowedBooks.forEach((book, index) => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('borrowed-book');

        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title} cover" class="book-cover">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Category: ${book.category}</p>
            <button class="return-btn" onclick="returnBook(${index})">Return</button>
        `;
        borrowedBooksDiv.appendChild(bookDiv);
    });
}

// Borrow a Book
function borrowBook(id) {
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    if (borrowedBooks.length >= 3) {
        showNotification('Borrowing limit reached!', 'warning');
        return;
    }

    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(book => book.id === id);

    if (book) {
        borrowedBooks.push(book);
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        showNotification(`${book.title} borrowed successfully!`, 'success');
    }

    displayBooks();
}

// Return Book
function returnBook(index) {
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    if (index >= 0 && index < borrowedBooks.length) {
        borrowedBooks.splice(index, 1);
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        showNotification('Book returned successfully!', 'success');
        displayBorrowedBooksPage();
    }
}

// Initialization
window.onload = () => {
    displayBooks();
    displayBorrowedBooksPage();
};
