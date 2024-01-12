import ReactDOM from 'react-dom/client'

import App from './App'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

import axios from 'axios'

const promise = axios.get('http://localhost:3001/persons')
console.log(promise)
