
const Avatar = ({ className = '', url}) => {
  return (
    <div>
      <div className="avatar">
        <div className={`rounded-full ${className}`}>
          <img src={url} className="rounded-inherit w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Avatar;