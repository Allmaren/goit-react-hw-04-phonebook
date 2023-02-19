import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import ContactList from './ContactList/ContactList.jsx';
import Filter from './ContactFilter/ContactFilter.jsx';
import ContactForm from './Form/ContactForm.jsx';
import {
  Wrapper,
  Block,
  NoContacts,
  TitleContact,
  Title,
} from './Phonebook.styled.js';

export const Phonebook = () => {
  const [contacts, setContacts] = useState(() => {
    const contacts = JSON.parse(localStorage.getItem('contact'));
    return contacts ? contacts : [];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contact', JSON.stringify(contacts));
  }, [contacts]);

  const isDublicate = name => {
    const normalizedContact = name.toLowerCase();
    const result = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizedContact;
    });
    return Boolean(result);
  };

  const addContact = ({ name, number }) => {
    if (isDublicate(name)) {
      return alert(`${name} is already in contacts.`);
    }

    setContacts(prevContacts => {
      const newContact = {
        id: nanoid(),
        name,
        number,
      };

      return [newContact, ...prevContacts];
    });
    return true;
  };

  const removeContact = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const handleFilter = ({ target }) => setFilter(target.value);

  const getFilteredContacts = () => {
    if (!filter) {
      return contacts;
    }
    const normalizeFilter = filter.toLowerCase();

    const result = contacts.filter(({ name }) => {
      return name.toLowerCase().includes(normalizeFilter);
    });

    return result;
  };

  const items = getFilteredContacts();
  const isEmpty = Boolean(items.length);

  return (
    <>
      <Wrapper>
        <Block>
          <Title>Phonebook</Title>
          <ContactForm onSubmit={addContact} />
        </Block>
        <Block>
          <TitleContact>Contacts</TitleContact>
          <Filter inputValue={handleFilter} />
          {isEmpty && (
            <ContactList removeContact={removeContact} items={items} />
          )}
          {!isEmpty && <NoContacts>No contacts in phonebooks</NoContacts>}
        </Block>
      </Wrapper>
    </>
  );
};
