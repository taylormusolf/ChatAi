import './PostBox.css'
import {useLocation} from 'react-router-dom'

function PostBox ({ post: { text, author, imageUrls }}) {
  const { username, profileImageUrl } = author;
  const location = useLocation();
  const images = imageUrls?.map((url, index) => {
    return <img className="post-image" key ={url} src={url} alt={`postImage${index}`} />
  });
  return (
    <div className="post">
      <div className='post-author'>
        <h3>{location.pathname !== '/profile' ? username : undefined}</h3>
        {profileImageUrl && location.pathname !== '/profile' ?
          <img className="profile-image" src={profileImageUrl} alt="profile"/> :
          undefined
        }
       
      </div>
      <p>{text}</p>
      {images}
    </div>
  );
}

export default PostBox;