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

export default {
  getStorageContacts,
  setStorageContact,
  removeStorageContact,
  sortTableStorage,
}
