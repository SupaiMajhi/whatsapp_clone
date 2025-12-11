import NoChatLogo from '../assets/NoChatLogo';
import Button from '../components/Button';

const Advertise = () => {
  return (
    <div className='w-full h-full flex-column'>
        <div className='flex-column'>
            <div className='w-[230px] mb-5'><NoChatLogo /></div>
            <div className='flex-column mb-7'>
                <h1 className='heading text-white'>Download WhatsApp fow Windows</h1>
                <p className='box-heading text-white font-semibold'>Make calls, share your screen and get a faster experience when you download the Windows app.</p>
            </div>
            <Button className='green-btn px-3 py-2 font-semibold'>
                Download
            </Button>
        </div>
        <div className='mt-20 text'>
            <p>Your personal messages are end-to-end ecrypted</p>
        </div>
    </div>
  )
}

export default Advertise;