import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {BsGithub, BsLinkedin} from 'react-icons/bs'

function Footer(){

    return(
        <footer>
            <div className="left-footer"></div>
            <div className="center-footer">
                <h1>Copyright &copy; 2023 ChatAi</h1>
            </div>
            
            <div className="right-footer">
                <div className="footer-links">
                    <Link>< BsGithub/></Link>
                    <Link>< BsLinkedin/></Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer;