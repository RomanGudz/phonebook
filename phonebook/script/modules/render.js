import { getStorageContacts } from './serviceStorage.js';
import {
  createHeader,
  createLogo,
  createMain,
  createButtonsGroup,
  createTable,
  createForm,
  createFooter,
  createRow,
} from './createElements.js';

export const renderPhoneBook = (app, title) => {
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

export const renderContacts = (elem) => {
  const allRow = getStorageContacts('contacts').map(createRow);
  elem.append(...allRow);
  return allRow;
};
