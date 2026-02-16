import SearchIcon from '../assets/SearchIcon';
import useGlobalStore from '../store/globalStore.js';

const Input = ({ className='' }) => {

  const theme = useGlobalStore((state) => state.theme);

  return (
    <div className={`relative w-full flex justify-center items-center rounded-3xl ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}>
      <div className='absolute top-1/2 left-2.5 transform -translate-y-1/2 w-6 '>
        <SearchIcon />
      </div>
      <input type="text" name="search" placeholder='Search or start a new chat' autoComplete='off' className={`w-full py-2 pl-10 pr-5 text-base font-medium rounded-inherit ${theme === "light" ? "bg-lightNav" : "bg-darkNav"} ${className}`} />
    </div>
  )
}

export default Input;