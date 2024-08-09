$(document).ready(() => {
  const $bookForm = $('#book-form');
  const $bookList = $('#book-list');
  const $bookCount = $('#book-count');
  const $filterGenre = $('#filter-genre');
  const $filterStatus = $('#filter-status');
  const $clearBooksBtn = $('#clear-books');
  const $refreshPageBtn = $('#refresh-page');
  const $sortSelect = $('#sort-select');
  const $sortOrderBtn = $('#sort-order-btn');

  let books = JSON.parse(localStorage.getItem('books')) || [];
  let sortOrderAsc = true;

  const renderBooks = (booksToRender) => {
    $bookList.empty();
    booksToRender.forEach((book, index) => {
      const $li = $(`
        <li>
          <p><b>Название:</b> ${book.title}; <b>Автор:</b> ${book.author} - <b>Год:</b> (${book.year}) - <b>Жанр:</b> ${book.genre}<br/>
          <b>Статус:</b> ${book.status}</p>
          <div>
            <button class="edit-book" data-index="${index}">Редактировать</button>
            <button class="delete-book" data-index="${index}">Удалить</button>
          </div>
        </li>
      `);
      $bookList.append($li);
    });
    $bookCount.text(`Всего книг: ${booksToRender.length}`);
  };

  const saveBooks = () => {
    localStorage.setItem('books', JSON.stringify(books));
  };

  const sortBooks = (booksToSort, sortBy, orderAsc) => {
    return booksToSort.sort((a, b) => {
      let comparison = 0;
      if (a[sortBy] > b[sortBy]) {
        comparison = 1;
      } else if (a[sortBy] < b[sortBy]) {
        comparison = -1;
      }
      return orderAsc ? comparison : -comparison;
    });
  };

  $bookForm.on('submit', (e) => {
    e.preventDefault();
    const newBook = {
      title: $('#title').val(),
      author: $('#author').val(),
      year: $('#year').val(),
      genre: $('#genre').val(),
      status: $('#status').val(),
    };
    books.push(newBook);
    saveBooks();
    renderBooks(books);
    $bookForm[0].reset();
  });

  $bookList.on('click', '.edit-book', function () {
    const index = $(this).data('index');
    const book = books[index];
    $('#title').val(book.title);
    $('#author').val(book.author);
    $('#year').val(book.year);
    $('#genre').val(book.genre);
    $('#status').val(book.status);
    books.splice(index, 1);
    saveBooks();
    renderBooks(books);
  });

  $bookList.on('click', '.delete-book', function () {
    const index = $(this).data('index');
    books.splice(index, 1);
    saveBooks();
    renderBooks(books);
  });

  $filterGenre.on('input', () => {
    const filteredBooks = books.filter((book) =>
      book.genre.toLowerCase().includes($filterGenre.val().toLowerCase()),
    );
    renderBooks(filteredBooks);
  });

  $filterStatus.on('change', () => {
    const filteredBooks = books.filter(
      (book) =>
        book.status === $filterStatus.val() || $filterStatus.val() === '',
    );
    renderBooks(filteredBooks);
  });

  $clearBooksBtn.on('click', () => {
    books = [];
    saveBooks();
    renderBooks(books);
  });

  $refreshPageBtn.on('click', () => {
    location.reload();
  });

  $sortSelect.on('change', () => {
    const sortBy = $sortSelect.val();
    const sortedBooks = sortBooks(books, sortBy, sortOrderAsc);
    renderBooks(sortedBooks);
  });

  $sortOrderBtn.on('click', () => {
    sortOrderAsc = !sortOrderAsc;
    const sortBy = $sortSelect.val();
    const sortedBooks = sortBooks(books, sortBy, sortOrderAsc);
    renderBooks(sortedBooks);
    $sortOrderBtn.text(sortOrderAsc ? 'По возрастанию' : 'По убыванию');
  });

  renderBooks(books);
});
