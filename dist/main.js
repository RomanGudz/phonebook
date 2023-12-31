(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const {
  getStorageContacts,
  setStorageContact,
  removeStorageContact,
  sortTableStorage,
} = require('./serviceStorage');


const {
  createRow,
} = require('./createElements');

const hoverRow = (allRow, logo) => {
  const text = logo.textContent;
  allRow.forEach(contact => {
    contact.addEventListener('mouseenter', () => {
      logo.textContent = contact.phoneLink.textContent;
    });
    contact.addEventListener('mouseleave', () => {
      logo.textContent = text;
    });
  });
};

const sortTable = (columnName, list, app) => {
  const nameAndSurnameSelect = app.querySelectorAll('th');
  const rows = Array.from(list.querySelectorAll('tr'));
  const columnIndex = Array.from(nameAndSurnameSelect).indexOf(columnName);
  const sortOrder = columnName.dataset.sortRow === 'abs' ? 1 : -1;
  list.append(...(rows.sort((rowA, rowB) => {
    const valueA = rowA.cells[columnIndex].innerHTML;
    const valueB = rowB.cells[columnIndex].innerHTML;
    return sortOrder * (valueA > valueB ? 1 : -1);
  })));
  sortTableStorage(list);
  columnName.dataset.sortRow = (sortOrder === 1) ? 'desc' : 'abs';
};

const modalControl = (btnAdd, formOverlay) => {
  const openModal = () => {
    formOverlay.classList.add('is-visible');
  };
  const closeModal = () => {
    formOverlay.classList.remove('is-visible');
  };

  btnAdd.addEventListener('click', openModal);

  formOverlay.addEventListener('click', e => {
    const target = e.target;
    if (target === formOverlay || target.closest('.close')) {
      closeModal();
    }
  });
  return {
    closeModal,
  };
};

const deleteControl = (btnDel, list) => {
  btnDel.addEventListener('click', () => {
    document.querySelectorAll('.delete').forEach(del => {
      del.classList.add('is-visible');
    });
  });

  list.addEventListener('click', e => {
    const target = e.target;
    const phone = target.closest('.contact');
    console.log('phone: ', phone);
    console.log(target.closest('.contact').children[3].textContent);
    if (target.closest('.del-icon')) {
      removeStorageContact(phone.querySelector('a').textContent);
      phone.remove();
    }
  });
};

const addContactPage = (contact, list) => {
  list.append(createRow(contact));
};

const formControl = (form, list, closeModal) => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newContact = Object.fromEntries(formData);
    setStorageContact(newContact, getStorageContacts('contacts'));
    addContactPage(newContact, list);
    form.reset();
    closeModal();
  });
};

module.exports = {
  hoverRow,
  sortTable,
  modalControl,
  deleteControl,
  formControl,
};
},{"./createElements":2,"./serviceStorage":4}],2:[function(require,module,exports){
'use strict';
const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add('container');

  return container;
};

const createHeader = () => {
  const header = document.createElement('header');
  header.classList.add('header');
  const headerContainer = createContainer();
  header.append(headerContainer);

  header.headerContainer = headerContainer;

  return header;
};

const createLogo = title => {
  const h1 = document.createElement('h1');
  h1.classList.add('logo');
  h1.textContent = `Телефонный справочник ${title}`;

  return h1;
};

const createMain = () => {
  const main = document.createElement('main');
  const mainContainer = createContainer();
  main.append(mainContainer);
  main.mainContainer = mainContainer;

  return main;
};

const createButtonsGroup = params => {
  const btnWrapper = document.createElement('div');
  btnWrapper.classList.add('btn-wrapper');

  const btns = params.map(({ className, type, text }) => {
    const button = document.createElement('button');
    button.type = type;
    button.classList = className;
    button.textContent = text;
    return button;
  });
  btnWrapper.append(...btns);
  return {
    btnWrapper,
    btns,
  };
};

const createTable = () => {
  const table = document.createElement('table');
  table.classList.add('table', 'table-striped');

  const thead = document.createElement('thead');
  thead.insertAdjacentHTML('beforeend', `
    <tr>
    <th class="delete">Удалить</th>
    <th>Имя</th>
    <th>Фамилия</th>
    <th>Телефон</th>
    </tr>
    `);
  const tbody = document.createElement('tbody');
  table.append(thead, tbody);
  table.tbody = tbody;

  return table;
};

const createForm = () => {
  const overlay = document.createElement('div');
  overlay.classList.add('form-overlay');

  const form = document.createElement('form');
  form.classList.add('form');
  form.insertAdjacentHTML('beforeend', `
    <button class="close" type="button"></button>
    <h2 class="form-title">Добавить контакт</h2>
    <div class="form-group">
      <label class="form-label" for="name">Имя:</label>
      <input class="form-input" name="name" 
      id="name" type="text" required>
    </div>
    <div class="form-group">
      <label class="form-label" for="surname">Фамилия:</label>
      <input class="form-input" name="surname" 
      id="surname" type="text" required>
    </div>
    <div class="form-group">
      <label class="form-label" for="phone">Телефон:</label>
      <input class="form-input" name="phone" 
      id="phone" type="number" required>
    </div>
    `);
  const buttonGroup = createButtonsGroup([
    {
      className: 'btn btn-primary mr-3',
      type: 'submit',
      text: 'Добавить',
    },
    {
      className: 'btn btn-danger',
      type: 'reset',
      text: 'Отмена',
    },
  ]);
  form.append(...buttonGroup.btns);
  overlay.append(form);
  return {
    overlay,
    form,
  };
};

const createFooter = (title) => {
  const footer = document.createElement('footer');
  footer.classList.add('footer');
  footer.innerHTML = `Все права защищены &copy;${title}`;

  return footer;
};

const createRow = ({ name, surname, phone }) => {
  const tr = document.createElement('tr');
  tr.classList.add('contact');
  const tdDel = document.createElement('td');
  tdDel.classList.add('delete');
  const buttonDel = document.createElement('button');
  buttonDel.classList.add('del-icon');
  tdDel.append(buttonDel);
  const tdName = document.createElement('td');
  tdName.textContent = name;
  const tdSurname = document.createElement('td');
  tdSurname.textContent = surname;
  const tdPhone = document.createElement('td');
  const phoneLink = document.createElement('a');
  phoneLink.href = `tel:${phone}`;
  phoneLink.textContent = phone;
  tr.phoneLink = phoneLink;
  tdPhone.append(phoneLink);
  const buttonEdit = document.createElement('button');
  buttonEdit.classList.add('btn', 'btn-primary');
  buttonEdit.textContent = 'Изменить';
  tr.append(tdDel, tdName, tdSurname, tdPhone, buttonEdit);

  return tr;
};

module.exports = {
  createHeader,
  createLogo,
  createMain,
  createButtonsGroup,
  createTable,
  createForm,
  createFooter,
  createRow,
}

},{}],3:[function(require,module,exports){
'use strict';
const {
  getStorageContacts,
} = require('./serviceStorage');


const {
  createHeader,
  createLogo,
  createMain,
  createButtonsGroup,
  createTable,
  createForm,
  createFooter,
  createRow,
} = require('./createElements');

const renderPhoneBook = (app, title) => {
  const header = createHeader();
  const logo = createLogo(title);
  const main = createMain();
  const buttonGroup = createButtonsGroup([
    {
      className: 'btn btn-primary mr-3 js-add',
      type: 'button',
      text: 'Добавить',
    },
    {
      className: 'btn btn-danger',
      type: 'button',
      text: 'Удалить',
    },
  ]);
  const table = createTable();
  const { form, overlay } = createForm();
  const footer = createFooter(title);
  header.headerContainer.append(logo);
  main.mainContainer.append(buttonGroup.btnWrapper,
    table, overlay, footer);
  app.append(header, main);

  return {
    list: table.tbody,
    logo,
    btnAdd: buttonGroup.btns[0],
    btnDel: buttonGroup.btns[1],
    formOverlay: overlay,
    form,
  };
};

const renderContacts = (elem) => {
  const allRow = getStorageContacts('contacts').map(createRow);
  elem.append(...allRow);
  return allRow;
};

module.exports = {
  renderPhoneBook,
  renderContacts,
}
},{"./createElements":2,"./serviceStorage":4}],4:[function(require,module,exports){
'use strict';

const getStorageContacts = (contacts) => {
  const data = localStorage.getItem(contacts);
  if (data === 'undefined') {
    return [];
  } else {
    return JSON.parse(data);
  }
};
const setStorageContact = (obj, data) => {
  data.push(obj);
  localStorage.setItem('contacts', JSON.stringify(data));
};

const removeStorageContact = (phone) => {
  let data = getStorageContacts('contacts');
  data = data.filter(item => item.phone !== phone);
  localStorage.setItem('contacts', JSON.stringify(data));
};

const sortTableStorage = (table) => {
  const array = Array.from(table.querySelectorAll('tr'));
  const data = [];
  array.forEach((elem) => {
    const el = elem.querySelectorAll('td');
    const newObj = {
      name: el[1].textContent,
      surname: el[2].textContent,
      phone: el[3].textContent,
    };
    return data.push(newObj);
  });
  localStorage.setItem('contacts', JSON.stringify(data));
};

module.exports = {
  getStorageContacts,
  setStorageContact,
  removeStorageContact,
  sortTableStorage,
}
},{}],5:[function(require,module,exports){
'use strict';
const {
  getStorageContacts,
} = require('./modules/serviceStorage');

const {
  renderPhoneBook,
  renderContacts,
} = require('./modules/render');

const {
  hoverRow,
  sortTable,
  modalControl,
  deleteControl,
  formControl,
} = require('./modules/control');


{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const {
      list,
      logo,
      btnAdd,
      formOverlay,
      btnDel,
      form,
    } = renderPhoneBook(app, title);
    const allRow = renderContacts(list, getStorageContacts('contacts'));
    const { closeModal } = modalControl(btnAdd, formOverlay);

    hoverRow(allRow, logo);
    deleteControl(btnDel, list);
    formControl(form, list, closeModal);
    app.addEventListener('click', e => {
      const target = e.target;
      sortTable(target, list, app);
    });
  };

  window.phoneBookInit = init;
}

},{"./modules/control":1,"./modules/render":3,"./modules/serviceStorage":4}]},{},[5]);
