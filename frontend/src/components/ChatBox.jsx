import Header from '../components/Header';
import MainContent from './mainContent';
import InputBox from './InputBox';

const ChatBox = () => {

  return (
    <div className='w-full h-full flex flex-col items-center'>
        <Header />
        <div className='relative w-full h-full cpadding bg-primaryBg'>
          <MainContent />
          <InputBox />
        </div>
    </div>
  )
}

export default ChatBox;