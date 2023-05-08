import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearPostErrors, composePost } from '../../store/posts';
import PostBox from './PostBox';

function PostCompose () {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const dispatch = useDispatch();
  const author = useSelector(state => state.session.user);
  const newPost = useSelector(state => state.entities.posts.new);
  const errors = useSelector(state => state.errors.posts);
  const fileRef = useRef(null);

  useEffect(() => {
    return () => dispatch(clearPostErrors());
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(composePost(text, images));
    fileRef.current.value = null;
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
      <form className="composePost" onSubmit={handleSubmit}>
        <input 
          type="textarea"
          value={text}
          onChange={update}
          placeholder="Write your post..."
        />
        <label>
          Images to Upload
          <input
            type="file"
            ref={fileRef}
            accept=".jpg, .jpeg, .png"
            multiple
            onChange={updateFiles} />
        </label>
        <div className="errors">{errors && errors.text}</div>
        <input type="submit" value="Submit" />
      </form>
      <div className="post-preview">
        <h3>Post Preview</h3>
        {(text || imageUrls.length !== 0) ?                  // <-- MODIFY THIS LINE
            <PostBox post={{text, author, imageUrls}} /> : // <-- MODIFY THIS LINE
            undefined}
      </div>
      {/* <PostBox post={{text: newPost?.text}} /> */}
    </>
  )
}

export default PostCompose;