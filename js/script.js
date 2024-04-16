let LISTED_BOOKS = JSON.parse(localStorage.getItem("Data_Buku")) || [];

if (!localStorage.getItem("Data_Buku")) {
    let DicodingAcademy = new Book(+new Date(), "Belajar FrontEnd Dasar Bagi Pemula", "Dicoding Academy", 2024, false);
    addBook(DicodingAcademy);
    localStorage.setItem("Data_Buku", JSON.stringify(LISTED_BOOKS))
} else
    LISTED_BOOKS = JSON.parse(localStorage.getItem("Data_Buku"));

function Book(id, title, author, years, isComplete) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.years = years;
    this.isComplete = isComplete;
}

// PAGE NAV
const LISTINGS = document.querySelector("#daftar-buku");
LISTINGS.addEventListener("click", e => {
    displayBooks();
    selectLink(LISTINGS);
    updateListedBooks();
});
const BOOKS_READ = document.querySelector("#sudah-dibaca");
BOOKS_READ.addEventListener("click", e => {
    displayBooks(LISTED_BOOKS.filter(book => book.isComplete));
    selectLink(BOOKS_READ);
    updateListedBooks();
});
const BOOKS_PENDING = document.querySelector("#belum-belum");
BOOKS_PENDING.addEventListener("click", e => {
    displayBooks(LISTED_BOOKS.filter(book => !book.isComplete));
    selectLink(BOOKS_PENDING);
    updateListedBooks();
});

let currentPage = LISTINGS;

function selectLink(link) {
    const NAVLINKS = [LISTINGS, BOOKS_READ, BOOKS_PENDING];
    NAVLINKS.forEach(link => link.classList.remove("selected-page"));
    link.classList.add("selected-page");
    currentPage = link;
}

//Start at listings
LISTINGS.click();

// BOOK CRUD

//Adding a book

const ADD_BOOK_BTN = document.querySelector("#add-btn");

ADD_BOOK_BTN.addEventListener("click", e => {
    launchForm(ADD_BOOK_FORM);
})

// Menambahkan event listener untuk setiap tombol pindah buku
const MOVE_BOOK_BTNS = document.querySelectorAll('.move-btn');
MOVE_BOOK_BTNS.forEach(btn => {
    btn.addEventListener('click', () => {
        const bookId = btn.parentNode.parentNode.id.replace('book', ''); // Mendapatkan ID buku
        const bookIndex = LISTED_BOOKS.findIndex(book => book.id === parseInt(bookId)); // Temukan indeks buku dalam array LISTED_BOOKS

        // Ubah status buku (isComplete) sesuai dengan status sebelumnya
        LISTED_BOOKS[bookIndex].isComplete = !LISTED_BOOKS[bookIndex].isComplete;

        // Panggil kembali fungsi displayBooks() untuk merender ulang daftar buku
        displayBooks();
        updateListedBooks();
    });
});

function fillForm(form, obj, indx) {
    let title = form.querySelector("#input-judul") || "";
    let author = form.querySelector("#input-pengarang") || "";
    let years = form.querySelector("#input-tahun") || "";
    let isComplete = form.querySelector("#input-baca") || "";
    let index = form.querySelector("#index-input") || "";

    title.value = obj.title;
    author.value = obj.author;
    years.value = obj.years;
    isComplete.checked = obj.isComplete;
    index.value = indx;
}

const ADD_BOOK_FORM = document.querySelector("#add-form");
const EDIT_BOOK_FORM = document.querySelector("#edit-form");
const REMOVE_BOOK_FORM = document.querySelector("#remove-form");

ADD_BOOK_FORM.addEventListener("submit", e => {
    e.preventDefault();
    submitForm(ADD_BOOK_FORM);
    ADD_BOOK_FORM.reset();
    currentPage.click();
});

EDIT_BOOK_FORM.addEventListener("submit", e => {
    e.preventDefault();
    updateForm(EDIT_BOOK_FORM);
    currentPage.click();
});

REMOVE_BOOK_FORM.addEventListener("submit", e => {
    e.preventDefault();
    removeForm(REMOVE_BOOK_FORM);
    currentPage.click();
});

function updateListedBooks() {
    LISTED_BOOKS.forEach(book => {
        let bookIndex = LISTED_BOOKS.indexOf(book);
        const CURRENT_BOOK = document.querySelector(`#book${book.id}`)

        if (CURRENT_BOOK) {
            const EDIT_BOOK_BTN = CURRENT_BOOK.querySelector(".edit-btn");
            EDIT_BOOK_BTN.addEventListener("click", e => {
                launchForm(EDIT_BOOK_FORM);
                fillForm(EDIT_BOOK_FORM, book, bookIndex);
            })

            const REMOVE_BOOK_BTN = CURRENT_BOOK.querySelector(".remove-btn");
            REMOVE_BOOK_BTN.addEventListener("click", e => {
                launchForm(REMOVE_BOOK_FORM);
                fillForm(REMOVE_BOOK_FORM, book, bookIndex);
            })

            // Update event listener for move button
            const MOVE_BOOK_BTN = CURRENT_BOOK.querySelector(".move-btn");
            MOVE_BOOK_BTN.addEventListener("click", () => {
                book.isComplete = !book.isComplete; // Toggle status
                displayBooks(); // Render updated books
                updateListedBooks(); // Update event listeners
            });
        }
    })

    localStorage.setItem("Data_Buku", JSON.stringify(LISTED_BOOKS));
}

function submitForm(form) {
    let title = form.querySelector("#input-judul").value;
    let author = form.querySelector("#input-pengarang").value;
    let years = parseInt(form.querySelector("#input-tahun").value);
    let isComplete = form.querySelector("#input-baca").checked;

    const newBook = new Book(+new Date(), title, author, years, isComplete);
    addBook(newBook);

    makeNotification("Buku Baru ditambahkan");
}

function updateForm(form) {
    let title = form.querySelector("#input-judul").value;
    let author = form.querySelector("#input-pengarang").value;
    let years = parseInt(form.querySelector("#input-tahun").value);
    let isComplete = form.querySelector("#input-baca").checked;
    let index = Number(form.querySelector("#index-input").value);

    let book = LISTED_BOOKS[index];
    book.title = title;
    book.author = author;
    book.years = years;
    book.isComplete = isComplete;

    makeNotification("Buku tersunting");
}

function removeForm(form) {
    let index = Number(form.querySelector("#index-input").value);
    LISTED_BOOKS.splice(index, 1);

    makeNotification("Buku terhapus");
}

function makeNotification(msg) {
    const NOTIFICATION_HTML = document.createElement("div");
    NOTIFICATION_HTML.innerHTML = msg;
    NOTIFICATION_HTML.classList.add("notification");

    document.body.appendChild(NOTIFICATION_HTML);
    setTimeout(() => { document.body.removeChild(NOTIFICATION_HTML) }, 5000);
}

function launchForm(form) {
    let bg = form.parentElement;
    let closeBtn = form.querySelector(".close-btn");

    form.style.cssText = "display: show;";
    bg.style.cssText = "display: show;";

    closeBtn.addEventListener("click", e => {
        form.style.cssText = "display: none;";
        bg.style.cssText = "display: none;";
    })
}

let menuItems = document.getElementsByClassName('menu-item')

Array.from(menuItems).forEach((item, index) => {
    item.onclick = (e) => {
        let currMenu = document.querySelector('.menu-item.active')
        currMenu.classList.remove('active')
        item.classList.add('active')
    }
})


let scroll = window.requestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60) }

let elToShow = document.querySelectorAll('.animasi-scroll')

isElInViewPort = (el) => {
    let rect = el.getBoundingClientRect()

    return (
        (rect.top <= 0 && rect.bottom >= 0)
        ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) && rect.top <= (window.innerHeight || document.documentElement.clientHeight))
        ||
        (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    )
}

loop = () => {
    elToShow.forEach((item, index) => {
        if (isElInViewPort(item)) {
            item.classList.add('start')
        } else {
            item.classList.remove('start')
        }
    })

    scroll(loop)
}

loop()

function addBook(bookObj) {
    LISTED_BOOKS.push(bookObj)
}

// Menambahkan event listener untuk input pencarian
document.getElementById('search-box').addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();
    const filteredBooks = LISTED_BOOKS.filter(book => book.title.toLowerCase().includes(searchText));
    displayBooks(filteredBooks);
});

function displayBooks(booksArray = LISTED_BOOKS) {
    const BOOKS_WRAPPER = document.querySelector("#books-wrapper");
    BOOKS_WRAPPER.innerHTML = "";

    if (booksArray.length === 0) {
        BOOKS_WRAPPER.innerHTML = "Kamu tidak memiliki Daftar Buku.";
        return;
    }

    booksArray.forEach(book => {
        const HTML_BOOK =
            `<div id="book${book.id}" class="book-item">
            <header class="book-title">
                <img src="images/cover.gif" alt="cover">
                <div class="title">
                    <h2><b>${book.title}</b></h1>
                </div>
                <div class="author">
                    <p>Pengarang : <b>${book.author}</b></p>
                </div>
                <div class="edit">
                    <button class="icon-btn edit-btn">
                        <img src="images/sunting.svg" alt="sunting">
                    </button>
                    <button class="icon-btn remove-btn">
                        <img src="images/hapus.svg" alt="hapus">
                    </button>
                    <button class="icon-btn move-btn">
                        <img src="images/main-icon.svg" alt="pindah">
                    </button>
                </div>
            </header>
            ${book.isbn ? `<section class="book-cover">
            <img src="http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false" alt=" ">
        </section>` : ''}
            <footer class="book-footer">
                <p><b>Tahun : ${book.years}</b></p>
                <p><b>${book.isComplete ? "sudah dibaca" : "belum dibaca"}</b></p>
            </footer>
        </div>`;

        BOOKS_WRAPPER.innerHTML += HTML_BOOK;
    })
}
