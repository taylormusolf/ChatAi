import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {BsGithub, BsLinkedin} from 'react-icons/bs'

function Footer(){

    return(
        <footer>
            <div className="footer-container">
                <div className="left-footer"></div>
                <div className="center-footer">
                    <h1>Copyright &copy; 2023 ChatAi</h1>
                </div>
                
                <div className="right-footer">
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