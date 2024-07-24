import { useState, Children } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";
import { asideLinks } from './SidebarData';
import './Sidebar.css';

function Sidebar() {
    const [openItems, setOpenItems] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleItem = (id) => {
        setOpenItems(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const Each = ({ render, of }) =>
        Children.toArray(of.map((item, index) => render(item, index)));

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="toggle-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                <FaBars />
            </div>
            <div className="inner-block">
                <Each of={asideLinks} render={(item) =>
                    <div className="sidebar-link" key={item.id}>
                        {item.hasChild ? 
                            <div className="link-head" onClick={() => toggleItem(item.id)}>
                                <div className="link-content">
                                    {item.icon}
                                    {!isCollapsed && <div className="title">{item.title}</div>}
                                </div>
                                {!isCollapsed && (openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />)}
                            </div> :
                            <Link to={item.link} className="link-head">
                                <div className="link-content">
                                    {item.icon}
                                    {!isCollapsed && <div className="title">{item.title}</div>}
                                </div>
                            </Link>
                        }
                        {item.hasChild && openItems[item.id] && 
                            <div className="sidebar-subList">
                                {item.child ? 
                                    <Each of={item.child} render={(child) => 
                                        <NavLink to={child.link} className="sidebar-subLink">
                                            <span className='flex items-center text-sm'>
                                                {child.icon}&nbsp;{!isCollapsed && child.title}
                                            </span>
                                        </NavLink>
                                    } /> : ''}
                            </div>
                        }
                    </div>
                } />
            </div>
        </aside>
    );
}

export default Sidebar;
