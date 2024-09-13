import axios from 'axios'
import { useState, useEffect } from 'react'

const Language = ( {language} ) => <li>{language}</li>

const CountryName = ( {country, setFilteredCountries} ) => <>{country.name.common}<button onClick={() => setFilteredCountries([country])}>Show</button><br/></>

const Country = ( {country} ) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        const api_key = import.meta.env.VITE_API_KEY
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api_key}`
        axios
            .get(url)
            .then((response) => setWeather(response.data))
            .catch(error => console.log(`error fetching weather data:`, error))
    }, [])

    if (weather) {
        return (
            <>
            <h2>{country.name.common}</h2>
            <p>{country.capital ? `Capital: ${country.capital[0]}` : 'Capital: Not available'}<br/>
                Area: {country.area}</p>
            <h3>Languages:</h3>
            <ul>
                {Object.values(country.languages).map((language, index) => (
                <Language language={language} key={index} />
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
            <h3>Weather in {country.capital}</h3>
            <p>temperature {(weather.main.temp - 273.15).toFixed(1)} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`weather icon`} />
            <p>wind {weather.wind.speed} m/s</p>
            </>
        )}
    }

const Countries = ( {countries, setFilteredCountries} ) => {
  if (countries && countries.length > 10) {
    return (<p>Too many matches, specify another filter</p>)
  }
  else if (countries && countries.length === 1) {
    return (<Country country={countries[0]} setFilteredCountries={setFilteredCountries}/>)
  }
  else if (countries && countries.length !== 0) {
    return (countries.map((country) => <CountryName country={country} setFilteredCountries={setFilteredCountries} key={country.name.common} />))
  }
}

export default Countries