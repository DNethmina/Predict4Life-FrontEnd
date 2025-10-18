import Sidebar, { SidebarItem } from "./widgets/sidebar/sidebar";
import {
    Lifebuoy,
    receipt,
    Boxes,
    Package,
    UserCircle,
    BarChart3,
    LayoutDashboard,
    Setting,
} from "lucide-react";

export default function App() {
  return (
    <main className="App">
      <Sidebar>
        <SidebarItem 
        icon={<LayoutDashboard size={20}/>} 
        label="Dashboard" 
        alert />
        <SidebarItem icon={<BarChart3 size={20}/>}text="Statistics" />
        <SidebarItem icon={<UserCircle size={20}/>}text="Users" />
        <SidebarItem icon={<Boxes size={20}/>}text="Inventory" />
        <SidebarItem icon={<Package size={20}/>}text="Orders" alert/>
        <SidebarItem icon={<Receipt size={20}/>}text="Billings" />
        <hr className="my-3"/>
        <SidebarItem icon={<Setting size={20}/>}text="Settings" />
        <SidebarItem icon={<Lifebuoy size={20}/>}text="Help" />
      </Sidebar>
    </main>
  );
}