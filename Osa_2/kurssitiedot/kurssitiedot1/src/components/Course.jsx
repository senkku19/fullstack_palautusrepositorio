const Course = ({course}) => (
  <div>
    <Header header = {course}  />
    <Content content={course} />
    <Total parts = {course.parts} />
  </div>
)

 

const Header = ({header}) => (
  <div>
    <h2> {header.name} </h2>
  </div>
)
        
     
const Content = ({content}) =>(
  <div>
     {content.parts.map(course =>
      <Part key={course.id} props= {course} />
    )}
  </div>
)
  
      
  
  const Part = ({props}) =>(
    <div>
      <p> {props.name} {props.exercises} </p>
    </div>
  ) 
    
const Total = total => {
  const totalAmount = total.parts.reduce(
    (prevCount, currentCount) => prevCount + currentCount.exercises, 
    0
    )

    return (
    <div>
    <p style = {{fontWeight: 'bold'}}>  total of {totalAmount} excersises </p>
    </div>
    )
    }

    
  
export default Course