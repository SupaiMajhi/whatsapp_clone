import Header from '../components/Header';
import MainContent from './mainContent';
import InputBox from './InputBox';

// Store imports
import useGlobalStore from "../store/globalStore.js";

const ChatBox = () => {

  console.log('chatbox')

  const theme = useGlobalStore((state) => state.theme);
  
  return (
    <div className={`relative w-full h-full flex flex-col justify-center items-center`}>
      <div className='w-full h-[calc(100%-90%)] max-h-[calc(100%-90%)]'>
        <Header />
      </div>
      <div className={`relative w-full h-[calc(100%-10%)] max-h-[calc(100%-10%)] flex flex-col justify-center items-center ${theme === "light" ? "bg-lightNav text-black" : "bg-darkNav text-white"}`}>
        {/** MAIN CONTENT */}
        <div className='w-full h-[calc(100%-10%)] max-h-[calc(100%-10%)]'>
          <MainContent />
        </div>

        {/** INPUT BOX */}
        <div className='w-full h-[calc(100%-90%)] max-h-[calc(100%-90%)] flex justify-center items-center px-4'>
          <InputBox />
        </div>
      </div>
    </div>
  )
}

export default ChatBox;