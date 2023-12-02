import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const MostVotes = (votes) => {
  if (votes.value !== 0) {
  return(
    <div>
      <Content text = {votes.name}/>
      <Info value = {votes.value}/>
    </div>
  ) } return (
    <div>
      <p> There are no votes yet </p>
    </div>
  )
}

const Header = (header) => {
  return (
  <div>
    <h1>{header.name}</h1>
  </div>
  )
}

const Content = (content) => {
  return (
    <div>
      <p> {content.text} </p>
    </div>
  )
}

const Info = (info) => {
  return (
    <div>
      <p> has {info.value} votes </p>
    </div>
  )

}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(Math.floor((Math.random() * 8) + 1))
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const mostVotesIndex = votes.indexOf(Math.max(...votes));

  const handleRandomClick = () => {
    setSelected((selected) => Math.floor(Math.random() * anecdotes.length));
  };
  const handleVoteClick = () => {
    const newVotes = [...votes]; 
    newVotes[selected] += 1; 
    setVotes(newVotes); 
  };


  return (
    <div>
      <Header name = "Anecdote of the day"/>
      <Content text = {anecdotes[selected]}/>
      <Info value = {votes[selected]}/>
      <Button handleClick={handleRandomClick} text = "next anecdote" />
      <Button handleClick={handleVoteClick} text = "votes" />
      <Header name = "Anecdote with most votes"/>
      <MostVotes value = {votes[mostVotesIndex]} name = {anecdotes[mostVotesIndex]}/>
    </div>
  )
}

export default App