import { Sidebar } from "../organismos/Sidebar.jsx";
import { SideBarUser } from "../organismos/SideBarUser.jsx";

const Header = (props) => {
    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-900 w-full h-20 flex justify-between shadow-3xl shadow-gray-900 border-b-2 border-gray-300 fixed top-0 left-0 z-50">
            <Sidebar />
            <h2 className="text-white text-2xl font-bold flex items-center">
                {props.title}
            </h2>
            <SideBarUser />
        </div>
    );
};

export default Header;

