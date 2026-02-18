import useGlobalStore from "../store/globalStore.js";

const PrimaryButton = ({ className='', children, ...props }) => {

  const theme = useGlobalStore((state) => state.theme);

  return (
    <button 
      className={`${className} px-2 py-2 cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  )
}

export default PrimaryButton;