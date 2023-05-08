import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPosts, clearPostErrors } from '../../store/posts';
import PostBox from '../Posts/PostBox';

function Profile () {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const userPosts = useSelector(state => Object.values(state.entities.posts.user))
  
  useEffect(() => {
    dispatch(fetchUserPosts(currentUser._id));
    return () => dispatch(clearPostErrors());
  }, [currentUser, dispatch]);

  if (userPosts.length === 0) {
    return <div>{currentUser.username} has no Posts</div>;
  } else {
    return (
      <>
      <div className='posts-container'>
        <h2>All of {currentUser.username}'s Posts</h2>
        <div className='posts'>
          {userPosts.map(post => (
            <PostBox
              key={post._id}
              post={post}
              text={post.text}
            />
          ))}
          </div>
        </div>
      </>
    );
  }
}

export default Profile;