import React, { useContext, useState } from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "components/ui/menubar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "components/ui/dialog"
import { Switch } from "components/ui/switch";
import { Sun, Moon } from 'lucide-react';
import { GlobalContext } from 'context/GlobalContext';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';

function MenuBar() {
    const {dark, setDark, soundBoard, setSoundBoard} = useContext(GlobalContext);
    const [isAddOpen, setIsAddOpen] = useState(false);

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
                        <MenubarItem onClick={() => setIsAddOpen(true)}>Add Group</MenubarItem>
                    </MenubarContent>
                    <AddGroupDialog isAddOpen={isAddOpen} setIsAddOpen={setIsAddOpen}/>
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

function AddGroupDialog({ isAddOpen, setIsAddOpen }) {
    const {soundBoard, setSoundBoard} = useContext(GlobalContext);
    const [userInput, setUserInput] = useState("");

    const handleAddGroup = (e) => {
        e.preventDefault()
        const newGroup = {
            name: userInput.trim(),
            sounds: [
                // { name: "Cheer", path: "", volume: 70, muted: false }
            ]
        };
        setSoundBoard(prevSoundBoard => [...prevSoundBoard, newGroup]);
        setUserInput("")
        setIsAddOpen(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddGroup(e);
        }
    };

    return (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Group Name</DialogTitle>
                    <DialogDescription>
                        Please provide the requested information below.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex">
                    <Input
                    id="user-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="col-span-3"
                    onKeyDown={handleKeyDown}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleAddGroup}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default MenuBar;
  