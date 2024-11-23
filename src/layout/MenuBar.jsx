import React, { useContext, useState, useCallback } from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "components/ui/menubar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "components/ui/dialog";
import { Switch } from "components/ui/switch";
import { Sun, Moon } from 'lucide-react';
import { GlobalContext } from 'context/GlobalContext';
import InputValidation from 'components/ui/input-validation';
import { Button } from 'components/ui/button';
import db from 'services/db';

function MenuBar() {
    const { dark, setDark } = useContext(GlobalContext);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);

    return (
        <Menubar className="border shadow flex justify-between">
            <div className="flex">
                <MenubarMenu>
                    <MenubarTrigger className="relative rounded">Dashboard</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={() => setIsSaveOpen(true)}>Save...</MenubarItem>
                        <MenubarItem>Load...</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger className="relative rounded">Group</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={() => setIsAddOpen(true)}>Add Group</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </div>
            <MenubarMenu>
                <div className="flex items-center space-x-2 px-2">
                    <Switch
                        id="dark-mode-toggle"
                        checked={dark}
                        onCheckedChange={setDark}
                    />
                    {dark ? 
                        <Moon className="w-5 h-5 dark:text-zinc-50" /> : 
                        <Sun className="w-5 h-5 dark:text-zinc-800" />
                    }
                </div>
            </MenubarMenu>
            <AddGroupDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
            <SavePresetDialog isOpen={isSaveOpen} setIsOpen={setIsSaveOpen} />
        </Menubar>
    );
}

function AddGroupDialog({ isOpen, setIsOpen }) {
    const { setSoundBoard } = useContext(GlobalContext);
    const [userInput, setUserInput] = useState("");

    const handleAddGroup = useCallback(() => {
        if (!userInput.trim()) return;

        const newGroup = {
            name: userInput.trim(),
            sounds: []
        };

        setSoundBoard(prev => [...prev, newGroup]);
        setUserInput("");
        setIsOpen(false);
    }, [userInput, setSoundBoard, setIsOpen]);

    const handleValidation = useCallback((value) => {
        return value.trim() ? 
            { isValid: true, message: "Valid value" } : 
            { isValid: false, message: "Field cannot be empty." };
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Group Name</DialogTitle>
                    <DialogDescription>Please provide the requested information below.</DialogDescription>
                </DialogHeader>
                <InputValidation
                    id="group-name-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
                    validation={handleValidation}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddGroup}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function SavePresetDialog({ isOpen, setIsOpen }) {
    const { soundBoard } = useContext(GlobalContext);
    const [presetName, setPresetName] = useState("");

    const handleSavePreset = useCallback(() => {
        if (!presetName.trim()) return;

        const newPreset = {
            _id: presetName.trim(),
            soundBoard,
        };

        db.put(newPreset)
            .then(() => alert("Preset saved successfully!"))
            .catch(err => {
                if (err.name === "conflict") {
                    alert("A preset with this name already exists. Please choose a different name.");
                } else {
                    console.error("Error saving preset:", err);
                    alert("Error saving preset. Please try again.");
                }
            });

        setPresetName("");
        setIsOpen(false);
    }, [presetName, soundBoard, setIsOpen]);

    const handleValidation = useCallback((value) => {
        return value.trim() ? 
            { isValid: true, message: "Valid value" } : 
            { isValid: false, message: "Field cannot be empty." };
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Preset Name</DialogTitle>
                    <DialogDescription>Please provide the requested information below.</DialogDescription>
                </DialogHeader>
                <InputValidation
                    id="preset-name-input"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSavePreset()}
                    validation={handleValidation}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSavePreset}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default MenuBar;
