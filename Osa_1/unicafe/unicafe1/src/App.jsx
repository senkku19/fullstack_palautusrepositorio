import { useState } from 'react'

const Header = (header) => {
  return (
    <div>
      <h1> {header.name} </h1>
    </div>
  )
}

const Content = (content) => {
  return (
    <tr>
      <td>{content.name}</td>
      <td>{content.value}</td>
    </tr>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value, symbol}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
    <td>{symbol}</td>
  </tr>
)

const Statistics = ({allClicks, average, positive, good, bad, neutral}) => {
  if (allClicks === 0){
    return(
      <div>
        <table>
          <tbody>
             <Content name="good" value={good} />
              <Content name="neutral" value={neutral} />
              <Content name="bad" value={bad} />
          </tbody>
        </table>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <table>
          <tbody>
             <Content name="good" value={good} />
              <Content name="neutral" value={neutral} />
              <Content name="bad" value={bad} />
              <StatisticLine text="all" value = {allClicks} symbol=""/>
              <StatisticLine text="average" value = {average} symbol=""/>
              <StatisticLine text = "positive" value = {positive} symbol="%"/>
          </tbody>
        </table>
  
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [allClicks, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);
  const handleGoodClick = () => {
    setAll((allClicks) => allClicks + 1);
    setGood((good) => good + 1);
    setAverage((average) => (average + 1) / (good + neutral + bad + 1));
    setPositive((positive) => ((good + 1) / (good + neutral + bad + 1)) * 100);
  };
  
  const handleNeutralClick = () => {
    setAll((allClicks) => allClicks + 1);
    setAverage((average) => (average) / (good + neutral + bad + 1));
    setNeutral((neutral) => neutral + 1);
    setPositive((positive) => ((good) / (good + neutral + bad + 1)) * 100);
  };
  
  const handleBadClick = () => {
    setAll((allClicks) => allClicks + 1);
    setAverage((average) => (good-1) / (good + neutral + bad + 1));
    setBad((bad) => bad + 1);
    setPositive((positive) => ((good) / (good + neutral + bad + 1)) * 100);
  };

  const headers = ['give feedback', 'statistics'];

  return (
    <div>
      <Header name={headers[0]} />
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <Header name={headers[1]} />
      <Statistics allClicks={allClicks} average={average} positive={positive} good = {good} bad = {bad} neutral={neutral} />
    </div>
  )
}

export default App