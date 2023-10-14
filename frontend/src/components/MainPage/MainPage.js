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
    let i = 0;
    let offset = 0;
    const len = words.length;

    let forwards = true;
    let skip_count = 0;
    let skip_delay = 15;
    const speed = 70;
    return setInterval(()=> {
      if (forwards){
        if(offset >= words[i].length){
          ++skip_count;
          if(skip_count === skip_delay){
            forwards = false;
            skip_count = 0;
          }
        }
      } else {
        if (offset === 0){
          forwards = true;
          i++;
          offset = 0;
          if(i >= len){
            i = 0;
          }
        }
      }
      part = words[i].substr(0, offset);
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