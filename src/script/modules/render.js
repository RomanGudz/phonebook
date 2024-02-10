import localStorage from './serviceStorage';
import createElement from './createElements';
const {
  createHeader,
  createLogo,
  createMain,
  createButtonsGroup,
  createTable,
  createForm,
  createFooter,
  createRow,
  createImgLogo,
} = createElement;

export const renderPhoneBook = (app, title) => {
  const header = createHeader();
  const imgLogo = createImgLogo();
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
  header.headerContainer.append(imgLogo, logo);
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
  const allRow = localStorage.getStorageContacts('contacts').map(createRow);
  elem.append(...allRow);
  return allRow;
};
