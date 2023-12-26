import {
  getStorageContacts,
  setStorageContact,
  removeStorageContact,
  sortTableStorage,
} from './serviceStorage.js';
import { createRow as createElemntRow } from './createElements.js';

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
  list.append(createElemntRow(contact));
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

export default {
  hoverRow,
  sortTable,
  modalControl,
  deleteControl,
  formControl,
}