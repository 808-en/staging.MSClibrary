const searchInput = document.getElementById('searchInput');
const genreSelect = document.getElementById('genreSelect');
const bookList = document.getElementById('bookList');
const addBookButton = document.querySelector('.add-button');
const addBookOverlay = document.getElementById('addBookOverlay');
const closeAddBookForm = document.getElementById('closeAddBookForm');
const addBookForm = document.getElementById('addBookForm');

function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreSelect.value;
    const books = bookList.querySelectorAll('.book-profile');

    books.forEach(book => {
        const title = book.dataset.title.toLowerCase();
        const genre = book.dataset.genre;
        const synopsis = book.querySelector('p:nth-child(3)').textContent.toLowerCase();
        const author = book.querySelector('p:nth-child(2)').textContent.toLowerCase();

        const titleMatch = title.includes(searchTerm);
        const synopsisMatch = synopsis.includes(searchTerm);
        const authorMatch = author.includes(searchTerm);
        const genreMatch = selectedGenre === "" || genre === selectedGenre;

        if ((titleMatch || synopsisMatch || authorMatch) && genreMatch) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    });
}

searchInput.addEventListener('input', filterBooks);
genreSelect.addEventListener('change', filterBooks);

// --- Handling the "Add+" button and form ---
let addBookRedirected = false;

// Check if the user was redirected back from the login page
function checkLoginRedirect() {
    const wasRedirected = localStorage.getItem('addBookRedirected');
    if (wasRedirected === 'true') {
        localStorage.removeItem('addBookRedirected'); // Clear the flag
        addBookOverlay.style.display = 'flex'; // Show the add book form
    }
}

addBookButton.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.setItem('redirectAfterLogin', 'library.html'); // Tell login where to go back
    localStorage.setItem('showAddBookForm', 'true'); // Tell the redirect to show the form
    window.location.href = 'login.html';
});

closeAddBookForm.addEventListener('click', () => {
    addBookOverlay.style.display = 'none';
});

addBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // --- Here you would typically handle the form submission ---
    const bookCover = document.getElementById('bookCover').value;
    const bookTitle = document.getElementById('bookTitle').value;
    const genre = document.getElementById('genre').value;
    const author = document.getElementById('author').value;
    const synopsis = document.getElementById('synopsis').value;

    const newBook = document.createElement('div');
    newBook.classList.add('book-profile');
    newBook.dataset.genre = genre;
    newBook.dataset.title = bookTitle;
    newBook.innerHTML = `
        <h3>${bookTitle}</h3>
        <p><strong>Author:</strong> ${author}</p>
        <p><strong>Synopsis:</strong> ${synopsis}</p>
        <p><span class="genre">Genre:</span> ${genre}</p>
        <p><span class="grade-level">Grade Level:</span> N/A</p>
    `;

    bookList.appendChild(newBook);
    addBookOverlay.style.display = 'none';
    addBookForm.reset();

    // Optionally, you could save the new book data to localStorage or a server
    const existingBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
    existingBooks.push({ bookCover, bookTitle, genre, author, synopsis });
    localStorage.setItem('libraryBooks', JSON.stringify(existingBooks));
});

// Check for login redirect when the page loads
window.onload = checkLoginRedirect;