document.addEventListener("DOMContentLoaded", function() {
	getBooks();
});

function getBooks() {
	fetch('http://localhost:3000/books')
	.then((r) => r.json())
	.then((books) => {
		for (book of books) {
			addBooks(book);
		}
	});
}

// add all the books to the list on left side
function addBooks(book) {
	const booklist = document.getElementById('list');
	const title = document.createElement('li');

	title.textContent = book.title;

	booklist.appendChild(title);

	title.addEventListener('click', () => {
		document.getElementById('show-panel').innerHTML = '';
		attachBook(book);
	});
}

// when book title is clicked, book info is added
function attachBook(book) {
	const theuser = 1; // Selected user (BY ID)

	const showpanel = document.getElementById('show-panel');
	const bookimg = document.createElement('img');
	const booktitle = document.createElement('b');
	const booksub = document.createElement('b');
	const author = document.createElement('b');
	const desc = document.createElement('p');
	const userlist = document.createElement('ul');
	const likebtn = document.createElement('button');

	bookimg.setAttribute('src', book.img_url);
	booktitle.innerHTML = `<br><br>${book.title}`;
	booksub.innerHTML = `<br><br>${book.subtitle}`;
	author.innerHTML = `<br><br>${book.author}`;
	desc.textContent = book.description;
	likebtn.textContent = 'LIKE';
	for (user of book.users) {
		attachUser(user, userlist);
		if (user.id === theuser) {
			likebtn.textContent = 'UNLIKE';
		}
	}

	showpanel.appendChild(bookimg);
	showpanel.appendChild(booktitle);
	showpanel.appendChild(booksub);
	showpanel.appendChild(author);
	showpanel.appendChild(desc);
	showpanel.appendChild(userlist);
	showpanel.appendChild(likebtn);

	// when the like button is clicked
	likebtn.addEventListener('click', () => {
		fetch(`http://localhost:3000/users/${theuser}`)
		.then((r) => r.json())
		.then((USER) => {
			if (likebtn.textContent === 'LIKE') {
				like(USER, book);
				likebtn.textContent = 'UNLIKE';
				showpanel.innerHTML = '';
				attachBook(book);
			}
			else {
				unlike(USER, book);
				likebtn.textContent = 'LIKE';
				showpanel.innerHTML = '';
				attachBook(book);
			}
		});
	});
}

// add the list of users who like the book
function attachUser(info, list) {
	const user = document.createElement('li');
	user.textContent = info.username;
	list.appendChild(user);
}

// when the book is liked
function like(user, book) {
	book.users.push(user);

	fetch(`http://localhost:3000/books/${book.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			users: book.users
		})
	});
}

// when the book is unliked
function unlike(user, book) {
	for (match of book.users) {
		if (match.id === user.id) {
			book.users.splice(book.users.indexOf(match));
		}
	}

	fetch(`http://localhost:3000/books/${book.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			users: book.users
		})
	});
}