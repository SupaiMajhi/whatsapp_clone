import Header from './Header';
import MainContent from './MainContent.jsx';
import InputBox from './InputBox';

// Store imports
import useGlobalStore from "../store/globalStore.js";

const ChatBox = () => {

  const theme = useGlobalStore((state) => state.theme);
  
  return (
    <div className={`size-full flex-center flex-col`}>
      <div className='w-full h-[calc(100%-95%)] max-h-[calc(100%-95%)]'>
        {/** HEADER */}
        <Header />
      </div>
      <div className={`relative w-full h-[calc(100%-5%)] max-h-[calc(100%-5%)] flex flex-col justify-center items-center ${theme === "light" ? "bg-lightNav text-black" : "bg-darkNav text-white"}`}>
        {/** MAIN CONTENT */}
        <div className='w-full h-[calc(100%-6%)] max-h-[calc(100%-6%)]'>
          <MainContent />
        </div>

        {/** INPUT BOX */}
        <div className='w-full h-[calc(100%-94%)] max-h-[calc(100%-94%)] flex justify-center items-center px-4'>
          <InputBox />
        </div>
      </div>
    </div>
  )
}

export default ChatBox;
