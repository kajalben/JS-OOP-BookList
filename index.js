// An object-oriented book-list!

// Create a class BookList
// Create another class called Book

// BookLists should have the following properties:
// An array of all the Books
// Number of books marked as read
// Number of books marked not read yet
// A reference to the next book to read (book object)
// A reference to the current book being read (book object)
// A reference to the last book read (book object)

// Each Book should have several properties:
// Title
// Genre
// Author
// Read (true or false)
// Read date, can be blank, otherwise needs to be a JS Date() object

// Every Booklist should have a few methods:

// .add(book)
// should add a book to the books list.

// .finishCurrentBook()
// should mark the book that is currently being read as "read"
// Give it a read date of new Date(Date.now())
// Change the last book read to be the book that just got finished

// Change the current book to be the next book to be read
// Change the next book to be read property to be the first unread book you find in the list of books

// Booklists and Books might need more methods than that. Try to think of more that might be useful.

class BookList {
  #secretList = [];
  #password = null;
  constructor(name) {
    this._name = name
    this._allBooks = [];
    this._nextBook = null;
    this._currentBook = null;
    this._lastBook = null;
  }

  get allBooks() {
    return this._allBooks;
  }

  get currentBook() {
    return this._currentBook
      ? console.log(`You are currently reading: ${this._currentBook._title}`)
      : console.log("You're not reading any book at the moment");
  }

  get lastBook() {
    if (!this._lastBook)
      console.log("You haven't been reading much lately you naughty geek!");
    else
      return console.log(
        `The last book you read was: ${this._lastBook._title}. You finished it on ${this._lastBook._endReadDate}`
      );
  }

  get booksToRead() {
    const booksToRead = this._allBooks.filter((b) => !b._read)
    if (!booksToRead.length) return console.log('Oh! You have read all the books from your list!')
    console.log(`You currently have ${booksToRead.length} books to read! Why not choose one now?`);
  }

  get booksRead() {
    const booksRead = this._allBooks.filter((b) => b._read)
    if (!booksRead.length) return console.log('You have not yet read any books from your list!')
    return this._allBooks.filter((b) => b._read);
  }

  add(book) {
    this._allBooks.push(book);
  }

  chooseBookToRead() {
    if (this._currentBook) {
      return console.log(
        `You are already reading ${this._currentBook._title} since ${this._currentBook._startReadDate}`
      );
    }
    const booksNotReadYet = this.allBooks.filter((b) => !b.read);
    let bookToRead = prompt(
      `Please choose one of the following books to read: \n\n${booksNotReadYet.reduce(
        (acc, book, idx) => {
          return (acc += `${idx + 1} - "${book._title}" by ${book._author} \n`);
        },
        ""
      )}
    `
    );
    bookToRead = parseInt(bookToRead, 10);
    if (
      !bookToRead ||
      typeof bookToRead !== "number" ||
      bookToRead > booksNotReadYet.length ||
      bookToRead <= 0
    )
      alert("You need to select the id of one book");
      this.setCurrent(booksNotReadYet[bookToRead - 1]);
  }

  setCurrent(book) {
    if (this._currentBook === book)
      console.log(
        `You are already reading ${book._title} since ${book._startReadDate}`
      );
    else if (this._currentBook)
      console.log(
        `You can't add this book as the current book before finishing ${this._currentBook._title}`
      );
    else {
      book._startReadDate = new Date(Date.now());
      this._currentBook = book;
      console.log(`Yay! You just started reading ${book._title}`);
    }
  }

  finishCurrentBook() {
    if (!this._currentBook)
      console.log("You're not reading any book right now...");
    else {

      const calculateElapsedTime = (start, end) => {
        const diff = end - start;
        return Math.round(diff / 1000 / 60);
      };

      this._currentBook._read = true;
      this._currentBook._endReadDate = new Date(Date.now());
      this._lastBook = this._currentBook;
      const cb = this._currentBook;
      this._currentBook = null;
      const askForNext = prompt(
        `You've successfully finished reading ${
          cb._title
        }! Congrats! It took you ${calculateElapsedTime(
          cb._startReadDate,
          cb._endReadDate
        )} minutes!\n\nNow, would you like to select the next book to read ? Say "yes" or "no"`
      );
      if (askForNext === "yes" || askForNext === "y") {
        const booksLeft = this._allBooks.filter((b) => !b._read);
        if (!booksLeft.length)
          alert("Oups, you have read all your books already!");
        else {
          let question =
            "Cool! Which book would you like to read next ? You still have those left to read: \n";
          booksLeft.forEach(
            (b, i) => (question += `\n - ${b._title} - enter ${i} \n`)
          );
          const askWhich = prompt(question);
          this.setCurrent(booksLeft[parseInt(askWhich, 10)]);
        }
      } else {
        console.log("Ok, take your time before picking up your next book :)");
      }
    }
  }

  recommendBook() {
    const randomBook = (max) => Math.floor(Math.random() * max);
    if (!this._allBooks.length)
      console.log("Your booklist is empty, cannot recommend one...");
    else if (!this._allBooks.filter((b) => !b._read))
      console.log("You've read all the books in your list! Why not add some?");
    else {
      const booksLeft = this._allBooks.filter(
        (b) => !b._read && this._currentBook !== b
      );
      const randomSelectedBook = booksLeft[randomBook(booksLeft.length)];
      console.log(
        `Why not try ${randomSelectedBook._title} written by ${randomSelectedBook._author} ? Sounds like a good ${randomSelectedBook._genre} book!`
      );
    }
  }

  recommendSimilarBooks(book) {
    const similar = this.allBooks.filter(b => b._genre === book._genre && b._title !== book._title);
    if (!similar.length) return console.log('There are no books of the same genre in your collection');
    const similarResult = similar.reduce((acc, s) => {
      return acc + " " + `- ${s._title}`
    }, "")
    console.log(`The following book(s) in your library share the same genre:\n${similarResult}`)
  }

  bookInfo(book = this) {
    console.log(`
    Name: ${book._title}
    Genre: ${book._genre}
    Author: ${book._author}
    `)
  }

  // The following methods make use of Class Fields; which are quite new, and still not widely
  // supported by browsers (and only Node 12+) /!\ so use with caution /!\
  // They allow to set really private (language enforced) properties & methods within a class
  // https://www.sitepoint.com/javascript-private-class-fields/
  // https://javascript.info/private-protected-properties-methods
  // For more widely supported (but not as secure & harder to use) ways of setting "privacy" within a class
  // please check out Symbols and WeakMaps (https://curiosity-driven.org/private-properties-in-javascript)

  addSecret(book) {
    if (!this.#password) {
      alert("You need to set a password to use the secret book list...");
      const isPasswordSet = this.setPassword();
      if (isPasswordSet)
        alert("The book has been successfully added to your secret list");
    }
    this.#secretList.push(book);
  }

  setPassword() {
    const askForNewPw = () => {
      const newPw = prompt("Please enter a new password");
      if (!newPw) {
        alert("You need to enter a password");
        return false;
      } else {
        this.#password = newPw;
        alert("New password set successfully");
        return true;
      }
    };
    if (!this.#password) {
      return askForNewPw();
    } else {
      const oldPw = prompt("Please enter your old password");
      if (oldPw === this.#password) {
        return askForNewPw();
      } else alert("Sorry, passwords don't match...");
    }
  }

  get secretList() {
    const pw = prompt(
      "Please enter your password to access the secret book list"
    );
    if (!pw || !this.#password || pw !== this.#password)
      alert("You cannot access this private data");
    else return this.#secretList;
  }
}

// BOOK CHILD CLASS
class Book extends BookList {
  constructor(title, genre, author) {
    super();
    this._title = title;
    this._genre = genre;
    this._author = author;
    this._read = false;
    this._startReadDate = null;
    this._endReadDate = null;
  }
  recommendSimilarBooks(bookList) {
    bookList.recommendSimilarBooks(this)
  }
}

// BOOK INSTANCES TO INJECT INTO THE BOOKLIST
const autumn = new Book(
  "The Autumn of the Patriarch",
  "Novel",
  "Gabriel García Márquez"
);
const foundation = new Book(
  "Foundation",
  "Science-fiction",
  "Isaac Asimov"
  );
  const dune = new Book(
    "Dune",
    "Science-fiction",
    "Frank Herbert"
    );
const sapiens = new Book(
  "Sapiens: A Brief History of Humankind",
  "Non-fiction",
  "Yuval Noah Harari"
);
const endgame = new Book("Endgame", "Play", "Samuel Beckett");
const road = new Book("On the Road", "Novel", "Jack Kerouac");
const sisyphus = new Book("The Myth of Sisyphus", "Essay", "Albert Camus");

const booksHeld = [foundation, dune, sapiens, autumn, endgame, road, sisyphus];

// INSTANTIATION OF THE BOOKLIST
const myLibrary = new BookList("My favorite books");
// INJECTINT THE BOOKLIST WITH SOME BOOK INSTANCES
booksHeld.forEach((b) => myLibrary.add(b));
