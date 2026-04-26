import { IoMdMoon } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaRegMoon } from "react-icons/fa6";

const NavBar = () => {
  const [mode, setMode] = useState(false);

  useEffect(() => {
    if (mode) {
      document.body.style.backgroundColor = "#1a1a1a";
      document.body.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  }, [mode]);

  return (
    <div className="nav flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-[120px] h-[60px] md:h-[70px]">
      <div className="logo">
        <h3 className="text-[20px] md:text-[25px] font-bold bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
          Web Builder
        </h3>
      </div>

      <div className="icons flex items-center gap-[10px] md:gap-[15px]">
        <div onClick={() => setMode(!mode)}>
          <i className="icon">
            {mode ? <IoMdMoon /> : <FaRegMoon />}
          </i>
        </div>
        <i className="icon">
          <FaUser />
        </i>
      </div>
    </div>
  );
};

export default NavBar;