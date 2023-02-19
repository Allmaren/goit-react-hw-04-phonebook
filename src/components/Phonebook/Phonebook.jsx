import { Component } from 'react';
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
export class Phonebook extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('contact'));
    if (contacts && contacts.length) {
      this.setState({ contacts });
    }
  }

  componentDidUpdate(prevState) {
    const { contacts } = this.state;
    if (prevState.contacts.length !== contacts.length) {
      localStorage.setItem('contact', JSON.stringify(contacts));
    }
  }

  addContact = ({ name, number }) => {
    if (this.isDublicate(name)) {
      return alert(`${name} is already in contacts.`);
    }

    this.setState(prevState => {
      const { contacts } = prevState;

      const newContact = {
        id: nanoid(),
        name,
        number,
      };

      return { contacts: [newContact, ...contacts] };
    });
  };

  removeContact = id => {
    this.setState(({ contacts }) => {
      const newContacts = contacts.filter(contact => contact.id !== id);
      return { contacts: newContacts };
    });
  };

  isDublicate(name) {
    const normalizedContact = name.toLowerCase();
    const { contacts } = this.state;
    const result = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizedContact;
    });
    return Boolean(result);
  }

  getFilteredContacts() {
    const { filter, contacts } = this.state;
    if (!filter) {
      return contacts;
    }
    const normalizeFilter = filter.toLowerCase();

    const result = contacts.filter(({ name }) => {
      return name.toLowerCase().includes(normalizeFilter);
    });

    return result;
  }

  handleFilter = e => {
    this.setState({ filter: e.target.value });
  };

  render() {
    const { addContact, removeContact } = this;
    const items = this.getFilteredContacts();
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
            <Filter inputValue={this.handleFilter} />
            {isEmpty && (
              <ContactList removeContact={removeContact} items={items} />
            )}
            {!isEmpty && <NoContacts>No contacts in phonebooks</NoContacts>}
          </Block>
        </Wrapper>
      </>
    );
  }
}
