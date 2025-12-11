
const Button = ({ className='', handleOnClick, children }) => {
  return (
    <button className={`${className}`} onClick={handleOnClick}>{children}</button>
  )
}

export default Button;