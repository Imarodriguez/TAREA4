import * as React from 'react';


// Componente para la búsqueda de contactos
function ContactSearch({ onSearch }) {
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <div>
      <label htmlFor="search">Buscar por nombre o apellido:</label>
      <input type="text" id="search" onChange={handleSearch} placeholder="Ingrese nombre o apellido" />
    </div>
  );
}

 // Componente para mostrar una fila de contacto
  function ContactRow({ contact }) {
  return (
    <tr>
      <td>{contact.nombre}</td>
      <td>{contact.apellido}</td>
      <td>{contact.telefono}</td>
    </tr>
  );
}

// Componente para mostrar el listado de contactos
function ContactList({ contacts }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Teléfono</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact, index) => (
          <ContactRow key={index} contact={contact} />
        ))}
      </tbody>
    </table>
  );
}

// Componente para agregar nuevos contactos
function AddContactForm({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const nombre = event.target.nombre.value;
    const apellido = event.target.apellido.value;
    const telefono = event.target.telefono.value;

    onSubmit({ nombre, apellido, telefono });

    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nombre">Nombre:</label>
      <input type="text" id="nombre" required /><br />
      <label htmlFor="apellido">Apellido:</label>
      <input type="text" id="apellido" required /><br />
      <label htmlFor="telefono">Teléfono:</label>
      <input type="text" id="telefono" required /><br />
      <button type="submit">Agregar</button>
    </form>
  );
}

  // Componente padre que contiene el listado de contactos, el formulario para agregar nuevos contactos y la búsqueda de contactos
  export default function Agenda() {
    const [contacts, setContacts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
      fetch('http://www.raydelto.org/agenda.php')
        .then(response => response.json())
        .then(data => {
          setContacts(data);
        });
    }, []);

    const handleAddContact = (newContact) => {
      setContacts(prevContacts => [...prevContacts, newContact]);
      fetch('http://www.raydelto.org/agenda.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newContact)
      })
      .then(response => response.json())
      .then(data => {
                          });
    };

    const handleSearchContacts = (searchTerm) => {
      setSearchTerm(searchTerm.toLowerCase());
    };

    const filteredContacts = contacts .filter(contact =>
      contact.nombre.toLowerCase().includes(searchTerm) ||
      contact.apellido.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5); // Limitar a los primeros 5 contactos

    return (
      <div>
        <h1>Agenda Web</h1>
        <h2>Agregar nuevo contacto</h2>
        <AddContactForm onSubmit={handleAddContact} />
        <h2>Listado de contactos</h2>
        <ContactSearch onSearch={handleSearchContacts} />
        <ContactList contacts={filteredContacts} />
      </div>
    );
  }

 






