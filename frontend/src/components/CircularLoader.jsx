import CircularProgress from '@mui/material/CircularProgress';

const CircularLoader = ({ className='' }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
        <CircularProgress />
    </div>
  )
}

export default CircularLoader;