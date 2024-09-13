import { useState, useEffect } from 'react'
import personsService from './service/persons'

const Filter = ( {filter, onChange} ) => <div>filter shown with<input name='filter' type='text' value={filter} onChange={onChange}/></div>
const PersonForm = ( {newName, handleNameChange, newNumber, handleNumberChange, addPerson} ) => {
  return (
    <>
      <form>
        <div>
          name: <input name='name' value={newName} onChange={handleNameChange} autoComplete='off'/>
        </div>
        <div>
          number: <input name='number' value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button
            onClick={addPerson}
            type="submit">add
          </button>
        </div>
      </form>
    </>
  )
}
const Person = ( {person, removePerson} ) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td><button onClick={() => removePerson(person)}>'Delete'</button></td></tr>
  )
}
const Persons = ( {personsToShow, removePerson} ) => {
  return (
    <>
      <table>
        <tbody>
          {personsToShow.map((person) => <Person key={person.name} person={person} removePerson={removePerson}/>)}
        </tbody>
      </table>
    </>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState( {message: null, type: 'notification'} )

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.some((person) => person.name === newName)) {
      if (confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.find(person => person.name === newName)
        personsService
          .update(oldPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== oldPerson.id ? p : returnedPerson))
          })
          .then(notification => {
            setNotification( { message: `Changed ${newPerson.name}`, type: 'notification' } )
            setTimeout(() => {
              setNotification( {message: null} )
            }, 5000)
          })
          .catch(notification => {
            setNotification( { message: `Information of ${newPerson.name} has already been removed from the server`, type: 'error'} )
            setPersons(persons.filter((person) => oldPerson.id !== person.id))
            setTimeout(() => {
              setNotification( {message: null} )
            }, 5000)
          })
        }
    }
    else {
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .then(notification => {
          setNotification( {message: `Added ${newPerson.name}`, type: 'notification'} )
          setTimeout(() => {
            setNotification( {message: null} )
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const removePerson = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(person.id)
        .then(removedPerson => {
          setNotification( {message: `Deleted ${removedPerson.name}`, type: 'notification'} )
        })
        .catch(notification => {
          setNotification( { message: `Information of ${person.name} has already been removed from the server`, type: 'error'} )
        })
        setPersons(persons.filter((existingPerson) => person.id !== existingPerson.id))
        setTimeout(() => {
          setNotification( {message: null} )
        }, 5000)
    }
  }

  const personsToShow = persons.filter((person) => {
    const regex = new RegExp(filter, 'i')
    return (regex.test(person.name))
  })

 
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App