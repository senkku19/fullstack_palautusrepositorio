import React, { useState, useEffect } from 'react'
import axios from 'axios'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = ({searchCountry, handleFilterChange}) => {
  return(
    <div>
      <form>
      <div>
          find countries <input
            value={searchCountry}
            onChange={handleFilterChange}
          />
          
        </div>
      </form>
    </div>
  )

}

const Content = ({countriesToShow}) => {
  
  const [selectedCountry, setSelectedCountry] = useState(null);

  const showCountryDetails = (country) => {
    setSelectedCountry(country);
  }

  if (countriesToShow.length > 10) {
    return (
      <p> Too many matches, specify another filter</p>
    )
  } if (countriesToShow.length === 1){
    return (
      <CountryDetails country ={countriesToShow[0]} />
    )

  }
  
  if (selectedCountry ){
    return (
      <div>
        <CountryDetails country ={selectedCountry} />
      </div>
    )
  }

  return (
    countriesToShow.map(country =>(
      <p key = {country.cca2}>
        {country.name.common}
        <button type="submit" style={{ marginLeft: '10px' }} onClick={() => showCountryDetails(country)}>show</button>
      </p>
  ))
  )
}

const CountryDetails = ({country}) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    weatherService
      .fetchWeatherData(country.capital[0])
      .then(response => {
        setWeatherData(response);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }, [country.capital]); 

  if (!weatherData) {
    return <p>Fetching data...</p>; 
  }

  console.log(weatherData)

  return (
      <div >
        <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <h2>languages:</h2>
        <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>
             {value}
          </li>
        ))}
        </ul>
        <img src = {country.flags.png} />
        <h1>Weather in {country.capital}</h1>
        <p>temperature {weatherData.main.temp} Celsius</p>
        <img src = {`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
        <p>wind {weatherData.wind.speed} m/s</p>
        </div>
  )

}

const App = () => {
  const [value, setValue] = useState('');
  const [rates, setRates] = useState({});
  const [country, setCountry] = useState('');
  const [searchCountry, setSearchCountry] = useState('')
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState([])

  useEffect(() => {

    console.log('effect')
      countryService
        .getAll()
        .then(initialCountries => {
          setCountries(initialCountries)
        })

  }, []);

  console.log('render', countries.length, 'countries')


  const handleChange = event => {
    setValue(event.target.value);
  };


  const onSearch = event => {
    event.preventDefault();
    setCountry(value);
  };
  const handleFilterChange = (event) => {
    setSearchCountry(event.target.value);
  }
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchCountry.toLowerCase())
  )


  const countriesToShow = searchCountry ? filteredCountries : countries;

  return (
    <div>
      <Filter searchCountry={searchCountry} handleFilterChange={handleFilterChange} />
      <Content countriesToShow={countriesToShow} />
    </div>
  )
}

export default App;
