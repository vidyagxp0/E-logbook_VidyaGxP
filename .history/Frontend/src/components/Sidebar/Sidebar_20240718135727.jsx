import { useState, useEffect, Children } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { asideLinks } from './SidebarData';
import './Sidebar.css'; // Assuming you have some custom styles

function Sidebar() {
    const [openItems, setOpenItems] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {}, [openItems]);

    const toggleItem = (id) => {
        setOpenItems(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const Each = ({ render, of }) =>
      Children.toArray(of.map((item, index) => render(item, index)))

    return (
        <aside className="flex flex-col h-full">
            <button 
                className="md:hidden p-4 text-white bg-blue-600" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                Menu
            </button>
            <div 
                className={`inner-block bg-gray-800 text-white h-full p-4 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block`}
            >
                <Each of={asideLinks} render={(item) =>
                    <div className="sidebar-link mb-2" key={item.id}>
                        {item.hasChild ? 
                            <div className="link-head flex justify-between items-center cursor-pointer" onClick={() => toggleItem(item.id)}>
                                <div className="flex items-center">
                                    {item.icon}
                                    <div className="title ml-2">{item.title}</div>
                                </div>
                                {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                            </div> :
                            <Link to={item.link} className="link-head flex items-center">
                                {item.icon}
                                <div className="title ml-2">{item.title}</div>
                            </Link>
                        }
                        {item.hasChild && openItems[item.id] && 
                            <div className="sidebar-subList ml-4 mt-2">
                                {item.child ? 
                                    <Each of={item.child} render={(child) => 
                                        <NavLink to={child.link} className="sidebar-subLink flex items-center text-sm mb-1">
                                            {child.icon}&nbsp;{child.title}
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
