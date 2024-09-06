import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ( {name, value, percentage} ) => <tr><td>{name}</td><td>{value}{percentage}</td></tr>

const Statistics = ( {good, bad, neutral} ) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  if (all === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  
  return(
    <table>
      <tbody>
        <StatisticLine name='Good' value={good}/>
        <StatisticLine name='Neutral' value={neutral}/>
        <StatisticLine name='Bad' value={bad}/>
        <StatisticLine name='All' value={all}/>
        <StatisticLine name='Average' value={average}/>
        <StatisticLine name='positive' value={positive} percentage='%'/>
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodHandler = () => setGood(good + 1)
  const neutralHandler = () => setNeutral(neutral + 1)
  const badHandler = () => setBad(bad + 1)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={goodHandler} text='Good'/>
      <Button onClick={neutralHandler} text='Neutral'/>
      <Button onClick={badHandler} text='Bad'/>
      <h1>Statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral}/>
      
    </div>
  )
}

export default App