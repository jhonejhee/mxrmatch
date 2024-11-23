import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "components/ui/menubar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "components/ui/select";
import { Switch } from "components/ui/switch";
import { Sun, Moon } from 'lucide-react';
import { GlobalContext } from 'context/GlobalContext';
import InputValidation from 'components/ui/input-validation';
import { Button } from 'components/ui/button';
import { toast } from "sonner";
import db from 'services/db';

function MenuBar() {
    const { dark, setDark } = useContext(GlobalContext);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isLoadOpen, setIsLoadOpen] = useState(false);

    return (
        <Menubar className="border shadow flex justify-between">
            <div className="flex">
                <MenubarMenu>
                    <MenubarTrigger className="relative rounded">Dashboard</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={() => setIsSaveOpen(true)}>Save...</MenubarItem>
                        <MenubarItem onClick={() => setIsLoadOpen(true)}>Load...</MenubarItem>
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
            <LoadPresetDialog isOpen={isLoadOpen} setIsOpen={setIsLoadOpen} />
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
            soundBoard: soundBoard.map((group) => ({
                name: group.name,
                sounds: group.sounds.map((sound) => ({
                    name: sound.name,
                    path: sound.path, // Replace Blob URL with the attachment key (filename)
                    volume: sound.volume,
                    muted: sound.muted,
                })),
            })),
            _attachments: {}, // Prepare for attachments
        };
        // console.log(newPreset)

        const blobPromises = [];
        soundBoard.forEach((group) => {
            group.sounds.forEach((sound) => {
                const blobPromise = fetch(sound.path)
                    .then((response) => response.blob())
                    .then((blob) => {
                        // Attach the Blob to the preset document
                        newPreset._attachments[sound.name] = {
                            content_type: blob.type,
                            data: blob,
                        };
                    })
                    .catch((err) => {
                        console.error(`Failed to fetch Blob for sound: ${sound.name}`, err);
                    });

                blobPromises.push(blobPromise);
            });
        });

        // Once all Blob URLs are resolved, save the preset
        Promise.all(blobPromises)
        .then(() => {
            db.put(newPreset)
                .then(() => {
                    toast(`${presetName.trim()}`, { description: "Preset successfully saved." });
                })
                .catch((err) => {
                    if (err.name === "conflict") {
                        toast("Error", {
                            description: "A preset with this name already exists. Please choose a different name.",
                        });
                    } else {
                        console.error("Error saving preset:", err);
                        toast("Error", { description: "Error saving preset. Please try again." });
                    }
                });
        })
        .catch((err) => {
            console.error("Error processing Blobs for saving:", err);
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


function LoadPresetDialog({ isOpen, setIsOpen }) {
    const { setSoundBoard } = useContext(GlobalContext);
    const [presets, setPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState("");

    // Fetch all preset names when the dialog opens
    useEffect(() => {
        if (isOpen) {
            db.allDocs({ include_docs: false })
                .then((result) => {
                    const presetNames = result.rows.map((row) => row.id);
                    setPresets(presetNames);
                })
                .catch((err) => {
                    console.error("Error fetching presets:", err);
                });
        }
    }, [isOpen]); // Runs only when `isOpen` changes

    // Load the selected preset
    const handleLoadPreset = useCallback(() => {
        if (!selectedPreset) return;

        db.get(selectedPreset, { attachments: true })
            .then((doc) => {
                const loadedSoundBoard = doc.soundBoard.map((group) => ({
                    ...group,
                    sounds: group.sounds.map((sound) => {
                        const attachment = doc._attachments[sound.path];
                        if (attachment) {
                            // Decode Base64
                            const byteCharacters = atob(attachment.data); // Decode Base64
                            const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
                            const byteArray = new Uint8Array(byteNumbers);
                        
                            // Create a valid Blob with the correct MIME type
                            const blob = new Blob([byteArray], { type: attachment.content_type });
                        
                            const blobURL = URL.createObjectURL(blob);
                            return { ...sound, path: blobURL }; // Update the path for playback
                        } 
                        return sound; // Return the original sound if no attachment
                    }),
                }));
                setSoundBoard(loadedSoundBoard);
                toast(`Preset "${selectedPreset}" loaded successfully.`);
                setIsOpen(false);
            })
            .catch((err) => {
                console.error("Error loading preset:", err);
                toast("Error", { description: "Failed to load the selected preset." });
            });
        setSelectedPreset("");
    }, [selectedPreset, setSoundBoard, setIsOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Load Preset</DialogTitle>
                    <DialogDescription>Select a preset to load from the list below.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Select
                        value={selectedPreset}
                        onValueChange={(value) => setSelectedPreset(value)}
                        className="border rounded px-2 py-1"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Preset Name" />
                        </SelectTrigger>
                        <SelectContent>
                            {presets.map((preset) => (
                                <SelectItem key={preset} value={preset}>{preset}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleLoadPreset} disabled={!selectedPreset}>
                        Load
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default MenuBar;
