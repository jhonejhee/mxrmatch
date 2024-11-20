import React from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "components/ui/menubar";

function MenuBar() {
    return (
        <Menubar className="border shadow">

            <MenubarMenu>
                <MenubarTrigger className="relative rounded hover:bg-black hover:text-white transition duration-200 ease-in-out focus:bg-white focus:text-black data-[state=open]:bg-black data-[state=open]:text-white">Dashboard</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Save...</MenubarItem>
                    <MenubarItem>Load...</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger className="relative rounded hover:bg-black hover:text-white transition duration-200 ease-in-out focus:bg-white focus:text-black data-[state=open]:bg-black data-[state=open]:text-white">Group</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Add Group</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}

export default MenuBar;
  