import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Contact = ({ contact }) => {
  return (
    <div>
      <p>{contact.name} {contact.number}</p>
    </div>
  )
}

const Notification = ({message, color}) => {
  if (message === null) {
    return null
  }
  else{
    if (color === 1){
      return (
        <div className = "error">
          {message}
        </div>
      )
    } else {
      return (
        <div className = "errorRed">
          {message}
        </div>
      )
    }
  }
}

const Filter = ({searchName, handleFilterChange}) => {
  return(
    <div>
      <form>
      <div>
          filter shown with: <input
            value={searchName}
            onChange={handleFilterChange}
          />
          
        </div>
      </form>
    </div>
  )

}

const PersonForm = ({newName, handleNameChange, newNumber, handleNumberChange, addContact}) => {

return (
  <div>
     <form onSubmit={addContact}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  </div>
)
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [colorOfNotification, setColorOfNotification] = useState(null);
  
  useEffect(() => {
    console.log('effect')
    personService 
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

    console.log('render', persons.length, 'persons')

    const deleteContact = (event, id) => {
      event.preventDefault()
      const contactToDelete = persons.find(person => person.id === id)
      if (window.confirm("Do you really want to delete this contact?")) {
        personService
          .deletePerson(id)
          .then(() => {
            setPersons(persons.filter(person => person.id !== id))
            setColorOfNotification(2)
            setErrorMessage(`${contactToDelete.name} was deleted from the phonebook.`)
            setTimeout(() => {
             setErrorMessage(null)
            }, 5000)
          })
        
      }
    };
    

  const addContact = (event) => {
    event.preventDefault();
    const contactExists = persons.some(person => person.name === newName)
    if (contactExists){
      if(window.confirm(`${newName} is already added to the phonebook. Would you like to update their phonenumber?`)) {
        const updateInfo = persons.find(person => person.name === newName)
        const updatedObject = { ...updateInfo, number: newNumber };
        personService
        .update(updateInfo.id, updatedObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== updateInfo.id ? person : returnedPerson))
          setColorOfNotification(1)
          setErrorMessage(`${newName} number was changed`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setColorOfNotification(2)
          setErrorMessage(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(n => n.id !== updateInfo.id))
        })
      }
    } else{
    const contactObject = {
      name: newName,
      number : newNumber
    }

    personService
      .create(contactObject)
      .then(returnedPersons => {
        setPersons(persons.concat(returnedPersons));
        setNewName('');
        setNewNumber('');
      })

      setErrorMessage(`${newName} was added to the phonebook.`)
      setColorOfNotification(1)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
  }
  };

  const handleFilterChange = (event) => {
    setSearchName(event.target.value);
  };


  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const filteredContacts = persons.filter(person =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );


  const contactsToShow = searchName ? filteredContacts : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={colorOfNotification} />
      <Filter searchName={searchName} handleFilterChange={handleFilterChange} />
    
      <h3>add a new</h3>
      <PersonForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} addContact={addContact} />
    
      <h3>Numbers</h3>
      {contactsToShow.map(person => (
        <div key={person.id} style={{ display: 'flex', alignItems: 'center' }}>
          <Contact contact={person} />
          <button type="submit" style={{ marginLeft: '10px' }} onClick={(event) => deleteContact(event, person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default App;
