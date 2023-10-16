import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBots, fetchUserChatBots } from "../../store/chatbots";
import {Link , useHistory} from "react-router-dom";
import { createChat } from "../../store/chat";
import { Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination, Scrollbar} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/bundle';
import loadingGif from "../../assets/loading.gif";
import Footer from "../Footer/Footer";


function ChatBotIndex(){
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const chatBots = useSelector(state => state.entities.chatBots.all ?  state.entities.chatBots.all : {}  )
  const currentUser = useSelector(state => state.session.user);
  const userChatBots = useSelector(state => state.entities.chatBots.user ?  state.entities.chatBots.user : {}  )
  const chatted = useSelector(state => state.entities.chatBots?.chatted )
  useEffect(()=>{
    setLoading(true);
      dispatch(fetchChatBots()).then(()=> setLoading(false))
      dispatch(fetchUserChatBots(currentUser._id))
  }, [dispatch, currentUser])

  const clickHandler = (chatBotId) => (e)=>{
    dispatch(createChat({chatBotId}));
    history.push(`/chatbots/${chatBotId}`)
  } 

  // const breakpoints = {
  //   // when window width is >= 320px
  //   1250: {
  //     slidesPerView: 9,
  //     // spaceBetween: .25,
  //     slidesPerGroup: 7
  //   },
  //   1100: {
  //     slidesPerView: 8,
  //     slidesPerGroup: 6
  //     // spaceBetween: 5
  //   },
  //   950: {
  //     slidesPerView: 7,
  //     slidesPerGroup: 5
  //     // spaceBetween: 10
  //   },
  //   850: {
  //     slidesPerView: 6,
  //     slidesPerGroup: 4
  //     // spaceBetween: 10
  //   },
  //   700: {
  //     slidesPerView: 5,
  //     slidesPerGroup: 4
  //     // spaceBetween: 10
  //   },
  //   550: {
  //     slidesPerView: 4,
  //     slidesPerGroup: 3
  //     // spaceBetween: 10
  //   },
  //   400: {
  //     slidesPerView: 3,
  //     slidesPerGroup: 2
  //     // spaceBetween: 10
  //   },
  //   100: {
  //     slidesPerView: 2,
  //     slidesPerGroup: 1
  //     // spaceBetween: 10
  //   }
  // }
  {return loading ? <img className='loading-img' src={loadingGif}/> :
    <>
      <div className="chatbots-index-container">
        <div className="featured-container">
          <h1>Featured Chatbots</h1>
          <Swiper
          modules={[Navigation, Pagination, Scrollbar]}
          className="swiper"
          spaceBetween={10}
          speed={700}
          autoHeight={true}
          centerInsufficientSlides={true}
          slidesPerGroupAuto={true}
          slidesPerView='auto'
          // centeredSlides={true}
          // breakpoints={breakpoints}
          navigation
          //  pagination={{ clickable: true }}
          scrollbar={{ draggable: true, dragSize: 50, snapOnRelease: true}}
          //  onSlideChange={() => console.log('slide change')}
          //  onSwiper={(swiper) => console.log(swiper)}
          >
            {Object.values(chatBots).map((bot, i)=>{
              return bot.featured ? (
                <SwiperSlide key={bot._id}>
                  <ul className="chatbots-index-details" >
                    <li title={bot.name}>{bot.name}</li>
                    <img src={bot.profileImageUrl} alt={bot.name}/>
                    {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button">Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button"> Start Chat</button>}
                  </ul>
                </SwiperSlide>
              ): null
            })}
          </Swiper>
        </div>
        <div className="chatted-container">
          <h1>Recently Chatted Chatbots</h1>
          {chatted?.length ?
            <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            className="swiper"
            spaceBetween={10}
            speed={700}
            autoHeight={true}
            centerInsufficientSlides={true}
            // breakpoints={breakpoints}
            slidesPerGroupAuto={true}
            slidesPerView='auto'
            navigation
            scrollbar={{ draggable: true, dragSize: 50, snapOnRelease: true}}
            >
              {chatted.map((idx, i)=>{
                const bot = chatBots[idx]
                if (!bot) return null;
                return(
                  <SwiperSlide key={bot._id}>
                    <ul className="chatbots-index-details" >
                      <li title={bot.name}>{bot.name}</li>
                      <img src={bot.profileImageUrl} alt={bot.name}/>
                      {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button">Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button"> Start Chat</button>}
                    </ul>
                  </SwiperSlide>
                )
              })}
            </Swiper>: <div className="no-chatbot-message"> No Chatbots Chatted Yet!</div>
          }
        </div>
        <div className="created-container">
          <h1>Created Chatbots</h1>
          {Object.values(userChatBots).length ?
            <Swiper
              modules={[Navigation, Pagination, Scrollbar]}
              className="swiper"
              spaceBetween={10}
              speed={700}
              autoHeight={true}
              centerInsufficientSlides={true}
              slidesPerGroupAuto={true}
              slidesPerView='auto'
              // breakpoints={breakpoints}
              navigation
              scrollbar={{ draggable: true, dragSize: 50, snapOnRelease: true}}
            >
              {Object.values(userChatBots).map((bot, i)=>{
                return(
                  <SwiperSlide key={bot._id}>
                    <ul className="chatbots-index-details" >
                      <li title={bot.name}>{bot.name}</li>
                      <img src={bot.profileImageUrl} alt={bot.name}/>
                      {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button">Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button"> Start Chat</button>}
                    </ul>
                  </SwiperSlide>
                )
              })}
            </Swiper> : <div className="no-chatbot-message"> No Chatbots Created Yet!</div>
          }
        </div>


      </div>
      <Footer />
    </>  
  }

  
  

}

export default ChatBotIndex;