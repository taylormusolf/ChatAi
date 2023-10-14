import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { searchChatBots, receiveSearchChatBots } from "../../store/chatbots";
import { createChat } from "../../store/chat";
import {Link , useHistory} from "react-router-dom";
import loadingGif from "../../assets/loading.gif"
import {AiFillStar} from 'react-icons/ai'




const ChatBotSearch = () =>{
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const result = useSelector(state => state.entities.chatBots?.search);
    const chatted = useSelector(state => state.entities.chatBots?.chatted )

    useEffect(()=> {
        if(search.length >= 2){
            setLoading(true);
            dispatch(searchChatBots(search)).then(()=> setLoading(false))
        } else {
            dispatch(receiveSearchChatBots({chatbots: []}))
        }
    }, [search, dispatch])

    const clickHandler = (chatBotId) => (e)=>{
        dispatch(createChat({chatBotId}));
        history.push(`/chatbots/${chatBotId}`)
    } 

    return(
        <div className="search-wrapper">
            <div className="search-container">
                <input className="search-input" type="text" placeholder="Search for Chatbot by Name" onChange={(e)=> setSearch(e.target.value)}/>
                {loading ? <img src={loadingGif} alt='loading gif'/> :
                    <ul>
                        {Object.values(result).map((bot)=>{
                            return (
                                <li className='search-result-details' key={bot._id}>
                                    <img className='search-result-image' src={bot.profileImageUrl} alt={bot.name}/>
                                    <div className='search-result-subdetails'>
                                        <li>{bot.name}</li>
                                        {/* {bot.description ? <li>{bot.description}</li>: null} */}
                                        {bot.featured ? <li><strong className='star'><AiFillStar/></strong>Featured Chatbot<strong className='star'><AiFillStar/></strong></li>: null}
                                        {bot.author.username !== 'admin' ? <li>Created by: {bot.author.username}</li>: null}
                                        <div className='search-chat-button'>{chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button">Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button"> Start Chat</button>}</div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                }
            </div>
        </div>
    )


}


export default ChatBotSearch;