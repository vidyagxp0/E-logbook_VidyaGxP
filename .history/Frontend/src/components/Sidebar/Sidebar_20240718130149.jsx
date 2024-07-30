import { useState, useEffect, Children } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { asideLinks } from "./SidebarData";
import "./Sidebar.css";

function Sidebar() {
  const [openItems, setOpenItems] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {}, [openItems]);

  const toggleItem = (id) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const Each = ({ render, of }) =>
    Children.toArray(of.map((item, index) => render(item, index)));

  return (
    <aside
      className={`fixed z-50 bg-gray-800 text-white h-full transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="inner-block p-4">
        <button
          className="md:hidden mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaChevronDown className={`${isSidebarOpen ? "rotate-180" : ""}`} />
        </button>
        <Each
          of={asideLinks}
          render={(item) => (
            <div className="sidebar-link mb-2" key={item.id}>
              {item.hasChild ? (
                <div
                  className="link-head flex justify-between items-center cursor-pointer p-2"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <div className="title ml-2">{item.title}</div>
                  </div>
                  {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              ) : (
                <Link
                  to={item.link}
                  className="link-head flex items-center p-2"
                >
                  {item.icon}
                  <div className="title ml-2">{item.title}</div>
                </Link>
              )}
              {item.hasChild && openItems[item.id] && (
                <div className="sidebar-subList pl-6">
                  {item.child ? (
                    <Each
                      of={item.child}
                      render={(child) => (
                        <NavLink
                          to={child.link}
                          className="sidebar-subLink block p-2 text-sm"
                        >
                          <span className="flex items-center">
                            {child.icon}&nbsp;{child.title}
                          </span>
                        </NavLink>
                      )}
                    />
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          )}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
