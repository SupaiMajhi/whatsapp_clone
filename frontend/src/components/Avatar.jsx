
const Avatar = ({ className = '', url}) => {
  return (
    <div>
      <div className="avatar">
        <div className={`rounded-full ${className}`}>
          <img src={url} />
        </div>
      </div>
    </div>
  );
}

export default Avatar;