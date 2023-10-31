let LISTED_BOOKS = [];

if (!localStorage.getItem("Data_Buku"))
{
    let DicodingAcademy = new Book("Belajar FrontEnd Dasar Bagi Pemula", "Dicoding Academy", 2022, true);
    addBook(DicodingAcademy);
    localStorage.setItem("Data_Buku", JSON.stringify(LISTED_BOOKS))
}
else
    LISTED_BOOKS = JSON.parse(localStorage.getItem("Data_Buku"));

function Book(title, author, years, hasBeenRead){
    this.title = title;
    this.author = author;
    this.years = years;
    this.hasBeenRead = hasBeenRead;
}

// PAGE NAV
const LISTINGS = document.querySelector("#daftar-buku");
LISTINGS.addEventListener("click", e => {
    displayBooks();
    selectLink(LISTINGS);
    //Apabila kita tidak memperbaharui Buku maka tidak dapat disunting.
    updateListedBooks();
});
const BOOKS_READ = document.querySelector("#sudah-dibaca");
BOOKS_READ.addEventListener("click", e => {
    displayBooks(LISTED_BOOKS.filter(book => book.hasBeenRead));
    selectLink(BOOKS_READ);
    //Apabila kita tidak memperbaharui Buku maka tidak dapat disunting.
    updateListedBooks();
});
const BOOKS_PENDING = document.querySelector("#belum-belum");
BOOKS_PENDING.addEventListener("click", e => {
    displayBooks(LISTED_BOOKS.filter(book => !book.hasBeenRead));
    selectLink(BOOKS_PENDING);
    //Apabila kita tidak memperbaharui Buku maka tidak dapat disunting.
    updateListedBooks();
});

let currentPage = LISTINGS;

function selectLink(link){
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


function fillForm(form, obj, indx){
    let title = form.querySelector("#input-judul") || "";
    let author = form.querySelector("#input-pengarang") || "";
    let years = form.querySelector("#input-tahun") || "";
    let hasBeenRead = form.querySelector("#input-baca") || "";
    let index = form.querySelector("#index-input") || "";

    title.value = obj.title;
    author.value = obj.author;
    years.value = obj.years;
    hasBeenRead.checked = obj.hasBeenRead;
    index.value = indx;
}

const ADD_BOOK_FORM = document.querySelector("#add-form");
const EDIT_BOOK_FORM = document.querySelector("#edit-form");
const REMOVE_BOOK_FORM = document.querySelector("#remove-form");

ADD_BOOK_FORM.addEventListener("submit", e => {
    //Don't let form close
    e.preventDefault();
    submitForm(ADD_BOOK_FORM);
    ADD_BOOK_FORM.reset();
    currentPage.click();
});

EDIT_BOOK_FORM.addEventListener("submit", e => {
    //Don't let form close
    e.preventDefault();
    updateForm(EDIT_BOOK_FORM);
    currentPage.click();
});

REMOVE_BOOK_FORM.addEventListener("submit", e => {
    //Don't let form close
    e.preventDefault();
    removeForm(REMOVE_BOOK_FORM);
    currentPage.click();
    //Close 
    let bg = REMOVE_BOOK_FORM.parentElement;

    //Close form
    REMOVE_BOOK_FORM.style.cssText = "display: none;";
    bg.style.cssText = "display: none;";
});


function updateListedBooks(){
    LISTED_BOOKS.forEach(book => {
        let bookIndex = LISTED_BOOKS.indexOf(book);
        const CURRENT_BOOK = document.querySelector(`#book${bookIndex}`) 

        if(CURRENT_BOOK){
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
        }
    })

    localStorage.setItem("Data_Buku", JSON.stringify(LISTED_BOOKS));
}


function submitForm(form){
    let title = form.querySelector("#input-judul").value;
    let author = form.querySelector("#input-pengarang").value;
    let years = form.querySelector("#input-tahun").value;
    let hasBeenRead = form.querySelector("#input-baca").checked;

    const newBook = new Book(title, author, years, hasBeenRead);
    addBook(newBook);

    makeNotification("Buku Baru ditambahkan");
}

function updateForm(form){
    let title = form.querySelector("#input-judul").value;
    let author = form.querySelector("#input-pengarang").value;
    let years = form.querySelector("#input-tahun").value;
    let hasBeenRead = form.querySelector("#input-baca").checked;
    let index = Number(form.querySelector("#index-input").value);

    //Update every property
    let book = LISTED_BOOKS[index];
    book.title = title;
    book.author = author;
    book.years = years;
    book.hasBeenRead = hasBeenRead;
    
    makeNotification("Buku tersunting");
}

function removeForm(form){
    let index = Number(form.querySelector("#index-input").value);
    LISTED_BOOKS.splice(index, 1);

    makeNotification("Buku terhapus");
}


function makeNotification(msg){
    const NOTIFICATION_HTML = document.createElement("div");
    NOTIFICATION_HTML.innerHTML = msg;
    NOTIFICATION_HTML.classList.add("notification");

    document.body.appendChild(NOTIFICATION_HTML);
    //Wait 2 seconds and delete element
    setTimeout(() => {document.body.removeChild(NOTIFICATION_HTML)}, 5000);
}


function launchForm(form){
    let bg = form.parentElement;
    let closeBtn = form.querySelector(".close-btn");

    form.style.cssText = "display: show;";
    bg.style.cssText = "display: show;";

    //Close form
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



let scroll = window.requestAnimationFrame || function(callback) {window.setTimeout(callback, 1000/60)}

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


function addBook(bookObj){
    LISTED_BOOKS.push(bookObj)
}



function displayBooks(booksArray){
    const BOOKS_WRAPPER = document.querySelector("#books-wrapper");
    //Clear books html
    BOOKS_WRAPPER.innerHTML = "";

    if(arguments.length === 0)
    {
        booksArray = LISTED_BOOKS;
    }

    if(booksArray.length === 0)
    {
        BOOKS_WRAPPER.innerHTML = "Kamu tidak memiliki Daftar Buku."
    }

    booksArray.forEach(book => {
        const HTML_BOOK = 
        `<div id="book${LISTED_BOOKS.indexOf(book)}" class="book-item">
            <header class="book-title">
			<img src="images/cover.svg" alt="cover">
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
                </div>
            </header>
            ${book.isbn? `<section class="book-cover">
            <img src="http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false" alt=" ">
        </section>`: ''}
            <footer class="book-footer">
                <p><b>Tahun : ${book.years}</b></p>
                <p><b>${book.hasBeenRead? "sudah dibaca": "belum dibaca"}</b></p>
            </footer>
        </div>`;

        BOOKS_WRAPPER.innerHTML += HTML_BOOK;
    })    
}



