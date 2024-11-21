import React, { useContext } from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "components/ui/menubar";
import { Switch } from "components/ui/switch";
import { Sun, Moon } from 'lucide-react';
import { GlobalContext } from 'context/GlobalContext';

function MenuBar() {
    const {dark, setDark, soundBoard, setSoundBoard} = useContext(GlobalContext);

    return (
        <Menubar className="border shadow flex justify-between">
            <div className="flex">
                <MenubarMenu>
                    <MenubarTrigger className="relative rounded">Dashboard</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>Save...</MenubarItem>
                        <MenubarItem>Load...</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger className="relative rounded">Group</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>Add Group</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </div>

            <MenubarMenu>
                <div className="flex items-center space-x-2 px-2">
                    <Switch
                        id="airplane-mode"
                        checked={dark}
                        onCheckedChange={setDark}
                    />
                    {dark ? 
                    <Moon className='w-5 h-5 dark:text-zinc-50'/> :
                    <Sun className='w-5 h-5 dark:text-zinc-800'/>
                    }
                </div>
            </MenubarMenu>
        </Menubar>
    );
}

export default MenuBar;
  