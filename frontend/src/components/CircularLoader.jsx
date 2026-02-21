import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const CircularLoader = ({ className="" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <CircularProgress />
    </div>
  )
}

export default CircularLoader;