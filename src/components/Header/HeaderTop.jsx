import './Header.css'
import './HeaderTop.css';

function HeaderTop() {
    return (
        <>
            <div id='Header_Top' className='Header_Top'>
                <div className="header_inner">
                    <div className="left">
                        <div className="logo">
                            <img src="/logo1.png" alt="..." />
                            <img src="/logo.png" alt="..." />
                        </div>
                    </div>
                    <div className="center">
                        <div className="inputContainer">
                            <div className="inputInnerLeft">
                                <i className="ri-search-line"></i>
                            </div>
                            <div className="inputInnerRight">
                                <input type="search" />
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="bellLeft">
                            <i className="ri-notification-3-fill"></i>
                        </div>
                        <div className="profileRight">
                            <img src="./amit_guru.jpg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderTop
