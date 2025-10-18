import { Children } from "react";
import { useState } from "react";
import { ChevronFirst, moreVertical } from "lucide-react";
import { createContext } from "react";

const SidebarContext = createContext()
export default function Sidebar({ Children}) {
    const[expanded, setExpanded] = useState (true);
    return (
        <aside classname="h-screen">
            <nav classname="h-full flex-col bg-white corder-r shadow-sm">
                <div className="p-u pb-2 flex justify-between items-center">
                    <img src="https://img.logoipsum.com/243.svg" alt="" className={'overflow-hidden transition-all ${expanded ? "w-32": "w-0}'}/>
                    <button onClick={()=>setExpanded(curr=>curr)}className="p-1.5 rounded-lg bg-gray-30 hover:bg-gray-100">
                        {expanded?<ChevronFirst/>: <ChevronFirst/>}
                    </button>

                </div>

                <SidebarContext.Provider value={{expanded}}>

                <ul className="flex-1 px-3">{ Children}</ul>
                
                </SidebarContext.Provider>

                <div className="border-t flex p-3">
                    <img src="https://img.logoipsum.com/243.svg" alt="" className="w-10 h-10 rounded-md"/>
                    <div className={
                        'flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-32 ml-3": "w-0}"}'
                        }>
                            <div className="leading-4">
                                <h4 className="font-semibold">John Doe</h4>
                                <span className="text-xs text-gray-600">Johndoe@gmsil.com</span>
                            </div>
                            <moreVertical size={20}/>
                    </div>
                </div>
            </nav>

        </aside>
    )
}


export function SidebarItem({ icon: Icon, label, active }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li className={'relative flex items-center px-3 py-2 my-1 font-medium rounded-md curser-pointer transition-colors group ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800": "hover:bg-indigo-50 text-gray-600" }'
        }>
            {icon}
            <span className={'overflow-hidden transition-all ${expanded ? "w-32 ml-3": "w-0}'}>{text}</span>
            {alert && <div className={'absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}'}/>}

            {active && <div className={'absolute left-full rounded-md px-2 py-1 ml-6> bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0'}>
                {text}</div>}
        </li>
    )
}