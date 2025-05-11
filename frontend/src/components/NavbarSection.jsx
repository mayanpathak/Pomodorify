import { SettingsIcon, CheckBoxIcon } from "../assets/Icons";
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";

export default function NavbarSection () {

    const openModal = () => {
        document.getElementById('my_modal_1').showModal();
      };

      const navigate = useNavigate();

    return (
        <>
        {/* -- bg-base100 */}
        <div className="navbar ">
            <div className="navbar-start">
                {/* -- dropdown<div></div>*/}
                {/* ++ text-whtie >*/}
                <a className="btn btn-ghost text-xl text-white">
                <CheckBoxIcon ClassProp={"text-white"} />   
                Pomodorify</a>
            </div>
            {/* -- navbar-center<div></div>*/}
            <div className="navbar-end">
                {/* ++ bg-transparent group hover:bg-slate-50 hover:text-zinc-700  btn border-slate-50 rounded-full text-white */}
                <a onClick={openModal} className="bg-transparent group hover:bg-slate-50 hover:text-zinc-700 border-none btn border-slate-500 text-white ">
                {/* <SettingsIcon ClassProp={"text-white group-hover:text-zinc-700"} />     */}
                <SettingsIcon  ClassProp={"text-white group-hover:text-zinc-700"} />    
                Settings</a>

            </div>
            <div>
            <a onClick={() => {navigate("/dashboard")}} className="bg-transparent group hover:bg-slate-50 hover:text-zinc-700 border-none btn border-slate-500 text-white ml-4 ">
                {/* <SettingsIcon ClassProp={"text-white group-hover:text-zinc-700"} />     */}
                Dashboard</a>
            </div>
            <div>
            <a onClick={() => {navigate("/")}} className="bg-transparent group hover:bg-slate-50 hover:text-zinc-700 border-none btn border-slate-500 text-white ml-4 ">
                {/* <SettingsIcon ClassProp={"text-white group-hover:text-zinc-700"} />     */}
                Home</a>
            </div>
                <SettingsModal />
            </div>
        </>

    );
}

