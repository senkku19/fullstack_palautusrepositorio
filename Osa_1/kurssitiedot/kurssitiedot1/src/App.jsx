const Header = (header) => {
  console.log(header)
  return (
    <div>
      <h1> {header.name} </h1>
    </div>
  )
}

const Content = (content) => {
  return (
    <div>
      <Part part = {content.parts[0]} />
      <Part part = {content.parts[1]}  />
      <Part part = {content.parts[2]} />
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p> {props.part.name} {props.part.exercise} 
      </p>
    </div>
  )
}

const Total = (total) => {
  console.log(total)
  return (
    <div>
      <p> Number of exercises {total.parts[0].exercise + total.parts[1].exercise + total.parts[2].exercise} </p>
    </div>
  )
}

const App = () => {
  const course =  {
    name : 'Half Stack application development',
    parts : [  
      {
    name: 'Fundamentals of React',
    exercise: 10
  },
  {
    name: 'Using props to pass data',
    exercise: 7
  },

  {
    name: 'State of a component',
    exercise: 7
  }]
}
  

  return (
    <div>
      <Header name = {course.name}/>
      <Content parts = {course.parts} />
      <Total parts = {course.parts} />
    </div>
  )
}

export default App