
const Avatar = ({ className = ''}) => {
  return (
    <div>
      <div className="avatar">
        <div className={`rounded-full ${className}`}>
          <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
        </div>
      </div>
    </div>
  );
}

export default Avatar;