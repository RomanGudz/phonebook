import localStorage from './script/modules/serviceStorage.js';
import * as render from './script/modules/render.js';
import control from './script/modules/control.js';
import './scss/index.scss';

const {
  hoverRow,
  sortTable,
  modalControl,
  deleteControl,
  formControl,
} = control;

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
    } = render.renderPhoneBook(app, title);
    const allRow = render.renderContacts(list,
      localStorage.getStorageContacts('contacts'));
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
