import { FaRegDotCircle } from "react-icons/fa";
import "@styles/Admin/NavItem.css";
import { useLocation, Link } from "react-router-dom";

type NavItemProps = {
    title: string;
    name: string;
}

function NavItem({ title, name }: NavItemProps){

    const location = useLocation().pathname.split("/").pop();

    return (
        <Link to={`/admin/${name}`} className={location === name ? "NavItem active" : "NavItem"}>
            <FaRegDotCircle />
            <h3>{title}</h3>
        </Link>
    )
}

export default NavItem;