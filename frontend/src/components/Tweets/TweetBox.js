import './TweetBox.css'

function TweetBox ({ tweet: { text, author, imageUrls }}) {
  const { username, profileImageUrl } = author;
  const images = imageUrls?.map((url, index) => {
    return <img className="tweet-image" key ={url} src={url} alt={`tweetImage${index}`} />
  });
  return (
    <div className="tweet">
      <h3>
        {profileImageUrl ?
          <img className="profile-image" src={profileImageUrl} alt="profile"/> :
          undefined
        }
        {username}
      </h3>
      <p>{text}</p>
      {images}
    </div>
  );
}

export default TweetBox;