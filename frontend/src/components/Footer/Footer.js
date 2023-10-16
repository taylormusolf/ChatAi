import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {BsGithub, BsLinkedin} from 'react-icons/bs'
import {AiOutlineMail, AiFillBug} from 'react-icons/ai'

function Footer(){

    return(
        <footer>
            <div className="footer-container">
                <div className="left-footer">
                    <h1>Suggestions for improvement?</h1>
                    <div className="footer-links">
                        <a href = "mailto: tcmusolf@gmail.com"><AiOutlineMail /></a>
                        <a href = "mailto: tcmusolf@gmail.com"><AiFillBug /></a>
                    </div>

                </div>
                <div className="center-footer">
                    <h1>Copyright &copy; 2023 ChatAi</h1>
                    <h1>Powered by OpenAI</h1>
                </div>
                
                <div className="right-footer">
                    <h1>Developed by Taylor Musolf</h1>
                    <div className="footer-links">
                        <Link to={{pathname:'https://github.com/taylormusolf/aibot_creator'}} target='_blank'>< BsGithub/></Link>
                        <Link to={{pathname:'https://www.linkedin.com/in/taylor-musolf'}} target='_blank'>< BsLinkedin/></Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;