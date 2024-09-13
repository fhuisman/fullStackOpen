import { useState, useEffect } from 'react'
import countriesService from './service/countries'
import Countries from './components/Countries'
import Filter from './components/Filter'

function App() {
  const [allCountries, setAllCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then((initialCountries) => {
        setAllCountries(initialCountries)
      })
  }, [])

  useEffect(() => {
    const newFilteredCountries = allCountries.filter(country => {
      const regex = new RegExp(filter, 'i')
      return (regex.test(country.name.common))
    })
    setFilteredCountries(newFilteredCountries)
  }, [filter])


  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      <Filter filter={filter} onChange={handleFilterChange} />
      <Countries countries={filteredCountries} setFilteredCountries={setFilteredCountries}/>
    </div>
  )
}

export default App
