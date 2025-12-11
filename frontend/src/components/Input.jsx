import SearchIcon from '../assets/SearchIcon';

const Input = ({ className='' }) => {
  return (
    <div className='relative w-full flex justify-center items-center'>
      <div className='icon-center'>
        <SearchIcon className='w-5 text-baseClr' />
      </div>
      <input type="text" name="search" placeholder='Search or start a new chat' className={`${className}`} />
    </div>
  )
}

export default Input;