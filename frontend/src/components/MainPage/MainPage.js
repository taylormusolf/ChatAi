import Footer from '../Footer/Footer';
import {useState, useEffect} from 'react';

function MainPage() {
  const[header, setHeader] = useState('');


  useEffect(()=>{
    const interval = wordAnimation();
    return ()=> clearInterval(interval);
  }, [])
  
  const wordAnimation = function (){
    const words = ['anyone', 'an ai assistant','famous people', 'characters', 'ai friends'];
    let part;
    let i = 0; //keep track of place in words array
    let offset = 0; //keep track of place in current word
    const len = words.length; //reference point for end of words array

    let forwards = true; //if true moves forward through current word, if false then backward
    let skip_count = 0; //count to build up to skip_delay
    let skip_delay = 15; //delay time before starting to move backward through word str
    const speed = 70; //interval speed for function call
    return setInterval(()=> {
      if (forwards){
        if(offset >= words[i].length){ //reached the end of the current word str
          ++skip_count;
          if(skip_count === skip_delay){ //if the delay
            forwards = false;
            skip_count = 0;
          }
        }
      } else {
        if (offset === 0){ //resets moving forward through word str to start new word
          forwards = true;
          i++;
          offset = 0;
          if(i >= len){ //restarts to back at the beginning of word array if at end
            i = 0;
          }
        }
      }
      part = words[i].substr(0, offset); //creates substring based on current word and offset
      if (skip_count === 0){
        if (forwards){
          offset++;
        } else {
          offset--;
        }
      }
      setHeader(part);
    },speed);
  };

  //above function for a typing text animation is credited to https://alvarotrigo.com/blog/css-text-animations/



  return (
    <div className='main-container'>
      <div className='splash-content'>
        <div className='splash-header-container'>
          <h1 className='splash-header'>chat</h1>
          <h1 className='splash-header second'>with</h1>
          <h1 className='splash-header third'>{header}</h1>
        </div>
        
        {/* <img className='splash-img' src={img} alt='splash'></img> */}
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;