import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearTweetErrors, composeTweet } from '../../store/tweets';
import TweetBox from './TweetBox';

function TweetCompose () {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const dispatch = useDispatch();
  const newTweet = useSelector(state => state.entities.tweets.new);
  const errors = useSelector(state => state.errors.tweets);

  useEffect(() => {
    return () => dispatch(clearTweetErrors());
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(composeTweet(text, images));
    setImages([]);
    setImageUrls([]);       
    setText('');
  };

  const update = e => setText(e.currentTarget.value);

  const updateFiles = async e => {
    const files = e.target.files;
    setImages(files);
    if (files.length !== 0) {
      let filesLoaded = 0;
      const urls = [];
      Array.from(files).forEach((file, index) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          urls[index] = fileReader.result;
          if (++filesLoaded === files.length) 
            setImageUrls(urls);
        }
      });
    }
    else setImageUrls([]);
  }

  return (
    <>
      <form className="composeTweet" onSubmit={handleSubmit}>
        <input 
          type="textarea"
          value={text}
          onChange={update}
          placeholder="Write your tweet..."
        />
        <label>
          Images to Upload
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            multiple
            onChange={updateFiles} />
        </label>
        <div className="errors">{errors && errors.text}</div>
        <input type="submit" value="Submit" />
      </form>
      {/* <div className="tweet-preview">
        <h3>Tweet Preview</h3>
        {(text || imageUrls.length !== 0) ?                  // <-- MODIFY THIS LINE
            <TweetBox tweet={{text, author, imageUrls}} /> : // <-- MODIFY THIS LINE
            undefined}
      </div> */}
      <TweetBox text={newTweet?.text} />
    </>
  )
}

export default TweetCompose;