const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  }
  else{
    if (color === 1){
      return (
        <div className = "error">
          {message}
        </div>
      )
    } else {
      return (
        <div className = "errorRed">
          {message}
        </div>
      )
    }
  }
}

export default Notification