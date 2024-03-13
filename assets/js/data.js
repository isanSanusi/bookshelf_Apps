const DataBook = [
  { id: "judul", type: "text", label: "Judul Buku", value: "" },
  { id: "penulis", type: "text", label: "Penulis Buku", value: "" },
  { id: "tahun", type: "text", label: "Tahun Rilis", value: "" },
  { id: "done", type: "checkbox", label: "tandai sudah selesai ", value: "" },
  { id: "onSubmit", type: "submit", label: "", value: "" },
];
const lemariBuku = [];
const ALERT_MSG = "alert-pop";
const CREATE_MSG = "create-book";
const READ_BOOKS = "render-book";
const DELETE_MSG = "deleted-book";
const STORAGE_KEY = "LIBRARY_APPS";
DataBook.forEach((data) => {
  document.getElementById("input_book").innerHTML += `
      <div class="input_group">
        <label for="${data.id}">${data.label}</label>
        <input type="${data.type}" id="${data.id}" value="${data.value}" />
      </div>`;
});
const formTitle = document.querySelector(".title_form");
const modal = document.querySelector(".box_modal");
const flash = document.querySelector(".flash_msg");
const alert = document.querySelector(".alert_delete");
const form = document.querySelector(".container_form");
const submitForm = document.getElementById("input_book");
const submitButton = document.getElementById("onSubmit");
const handlerHideForm = () => {
  modal.style.display = "none";
  form.style.display = "none";
};
const handlerShowForm = () => {
  modal.style.display = "flex";
  form.style.display = "flex";
};
const handlerHideAlert = () => {
  modal.style.display = "none";
  alert.style.display = "none";
};
const handlerShowAlert = () => {
  modal.style.display = "flex";
  alert.style.display = "flex";
};

submitButton.addEventListener("click", () => handlerHideForm());
document.querySelector(".add_book").addEventListener("click", () => {
  formTitle.innerText = "Tambahkan Buku baru";
  submitButton.value = "Submit";
  handlerShowForm();
});
document.querySelector(".close_btn").addEventListener("click", () => {
  handlerHideForm();
  submitForm.reset();
});
document.getElementById("search_book").addEventListener("input", () => {
  document.dispatchEvent(new Event(READ_BOOKS));
});
document.addEventListener("DOMContentLoaded", () => {
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewBook();
  });
  isStorageExist() && loadDataFromStorage();
});
document.addEventListener(READ_BOOKS, () => {
  const progressReadBook = document.getElementById("progress_read");
  const completeReadBook = document.getElementById("complete_read");
  const searchInput = document.getElementById("search_book");
  const word = searchInput.value.trim().toLowerCase();
  progressReadBook.innerHTML = "";
  completeReadBook.innerHTML = "";
  for (const book of lemariBuku) {
    if (book.title.toLowerCase().includes(word)) {
      const bookItems = macBooks(book);
      if (!book.isCompleted) {
        progressReadBook.append(bookItems);
      } else {
        completeReadBook.append(bookItems);
      }
    }
  }
});
const submitValue = () => {
  const title = document.getElementById("judul").value;
  const author = document.getElementById("penulis").value;
  const yearValue = document.getElementById("tahun").value;
  const isCompleted = document.getElementById("done").checked;
  const year = parseInt(yearValue);
  if (title === "" || author === "" || year === "") {
    document.dispatchEvent(new Event(ALERT_MSG));
    handlerShowForm();
    return;
  }
  return { title, author, year, isCompleted };
};
const addNewBook = () => {
  const valueOnSubmit = submitValue();
  if (!valueOnSubmit) return;
  const generateId = generatedID();
  const bookDetail = bookDetails(generateId, ...Object.values(valueOnSubmit));
  lemariBuku.push(bookDetail);
  document.dispatchEvent(new Event(READ_BOOKS));
  document.dispatchEvent(new Event(CREATE_MSG));
  saveData();
};
const generatedID = () => +new Date();
const bookDetails = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};
const macBooks = (bookDetail) => {
  const container = document.createElement("div");
  container.classList.add("book", "shadow");
  container.setAttribute("id", `todo-${bookDetail.id}`);
  container.innerHTML = `
    <div class="cover">
      <h3 class="title">${bookDetail.title}</h3>
      <div class="info">
        <p>Author : ${bookDetail.author}</p>
        <p>Release : ${bookDetail.year}</p>
      </div>
    </div>`;

  const action = document.createElement("div");
  action.classList.add("action");
  const boxOpstions = document.createElement("div");
  boxOpstions.classList.add("box_options");

  const optionsButton = document.createElement("button");
  optionsButton.classList.add("button-options");
  optionsButton.innerText = "Options";
  optionsButton.addEventListener("mouseleave", () => {
    boxOpstions.style.display = "none";
  });
  optionsButton.addEventListener("mouseover", () => {
    boxOpstions.style.display = "flex";
  });
  boxOpstions.addEventListener("mouseover", () => {
    boxOpstions.style.display = "flex";
  });
  boxOpstions.addEventListener("mouseleave", () => {
    boxOpstions.style.display = "none";
  });
  action.append(optionsButton);

  const trashButton = document.createElement("button");
  trashButton.classList.add("trash-button");
  trashButton.innerText = "Delete";
  trashButton.addEventListener("click", () => {
    handlerShowAlert();
  });
  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.innerText = "Edit";
  editButton.addEventListener("click", () => {
    formTitle.innerText = "Update buku mu";
    document.getElementById("onSubmit").value = "Update";
    handlerShowForm();
    editBook(bookDetail.id);
  });
  boxOpstions.append(trashButton, editButton);

  const boxConfirm = document.querySelector(".button");
  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("no");
  cancelBtn.innerText = "No";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("yes");
  deleteButton.innerText = "Yes";
  cancelBtn.addEventListener("click", () => handlerHideAlert());
  deleteButton.addEventListener("click", () => {
    document.dispatchEvent(new Event(DELETE_MSG));
    removeBook(bookDetail.id);
    handlerHideAlert();
  });
  boxConfirm.innerHTML = "";
  boxConfirm.append(deleteButton, cancelBtn);
  container.append(boxOpstions, action);

  if (bookDetail.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.innerText = "Undo";
    undoButton.addEventListener("click", () => undoBook(bookDetail.id));
    action.appendChild(undoButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.innerText = "move";
    checkButton.addEventListener("click", () => markAsRead(bookDetail.id));
    action.appendChild(checkButton);
  }
  return container;
};

const editBook = (bookId) => {
  const targetBook = findBook(bookId);
  document.getElementById("judul").value = targetBook.title;
  document.getElementById("penulis").value = targetBook.author;
  document.getElementById("tahun").value = targetBook.year;
  document.getElementById("done").checked = targetBook.isCompleted;
  if (targetBook) {
    const valueOnSubmit = submitValue();
    targetBook.title = valueOnSubmit.title;
    targetBook.author = valueOnSubmit.author;
    targetBook.year = valueOnSubmit.year;
    targetBook.isCompleted = valueOnSubmit.isCompleted;
    saveData();
    document.dispatchEvent(new Event(READ_BOOKS));
    submitForm.addEventListener("submit", () => {
      removeBook(bookId);
      return;
    });
  }
};
const removeBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  lemariBuku.splice(bookTarget, 1);
  document.dispatchEvent(new Event(READ_BOOKS));
  saveData();
};
const undoBook = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(READ_BOOKS));
  saveData();
};
const markAsRead = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(READ_BOOKS));
  saveData();
};
const findBook = (bookId) => {
  const foundBook = lemariBuku.find((book) => book.id === bookId);
  return foundBook !== undefined ? foundBook : null;
};
const findBookIndex = (bookId) => {
  const bookIndex = lemariBuku.findIndex((book) => book.id === bookId);
  return bookIndex !== -1 ? bookIndex : -1;
};

const moved = () => {
  flash.style.opacity = "1";
  flash.style.left = "-50px";
  setTimeout(() => {
    flash.style.left = "-360px";
  }, 2000);
  submitForm.reset();
};

document.addEventListener(CREATE_MSG, () => {
  flash.innerText = "Buku berhasil di simpan!";
  flash.style.backgroundColor = "var(--ready)";
  moved();
});

document.addEventListener(DELETE_MSG, () => {
  flash.innerText = "yah bukunya di hapus!";
  flash.style.backgroundColor = "var(--danger)";
  moved();
});

document.addEventListener(ALERT_MSG, () => {
  flash.innerText = "Harap isi semua data!";
  flash.style.backgroundColor = "var(--danger)";
  moved();
});

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(lemariBuku);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};
const isStorageExist = () => typeof Storage !== "undefined";
const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const datas = JSON.parse(serializedData);
  if (datas !== null) {
    datas.forEach((data) => lemariBuku.push(data));
  }
  document.dispatchEvent(new Event(READ_BOOKS));
};
