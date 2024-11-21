import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from 'context/GlobalContext';
import { ToggleGroup, ToggleGroupItem } from "components/ui/toggle-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import { Slider, SliderV } from "components/ui/slider"
import { Volume1, Volume2, VolumeOff, VolumeX, AudioLines } from 'lucide-react'
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent, ContextMenuSeparator } from "components/ui/context-menu"


function Board() {
    const { soundBoard, setSoundBoard, master, setMaster } = useContext(GlobalContext);
    const [playlist, setPlaylist] = useState([]);
    const [audioInstances, setAudioInstances] = useState({});

    // Master
    const toggleMuteMaster = () => {
        setMaster((preMaster) => ({
            ...preMaster,
            muted: !preMaster.muted,
        }));
    };

    const handleVolumeChangeMaster = (key, value) => {
        setMaster((preMaster) => {
            const updatedMaster = { ...preMaster };
            updatedMaster[key] = value[0];
            return updatedMaster;
        });
    };


    // Soundboard Groups
    const toggleMute = (groupIndex, soundIndex) => {
        setSoundBoard((prevSoundBoard) => {
            const updatedSoundBoard = [...prevSoundBoard];
            const sound = updatedSoundBoard[groupIndex].sounds[soundIndex];
            sound.muted = !sound.muted;
    
            // Update Audio instance if sound is playing
            const soundName = sound.name;
            if (audioInstances[soundName]) {
                audioInstances[soundName].muted = sound.muted;
            }
    
            return updatedSoundBoard;
        });
    };

    const handleVolumeChange = (groupIndex, soundIndex, value) => {
        setSoundBoard((prevSoundBoard) => {
            const updatedSoundBoard = [...prevSoundBoard];
            updatedSoundBoard[groupIndex].sounds[soundIndex].volume = value[0];
            return updatedSoundBoard;
        });
    };
    

    // Add Sound
    const handleAddSound = (groupIndex) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "audio/*"; // Restrict to audio files
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const blob = new Blob([file], { type: file.type });
                console.log("Audio Blob:", blob);

                // Add sound to the group
                const sound = {
                    name: file.name.split(".")[0], // Use file name without extension as sound name
                    path: URL.createObjectURL(blob),
                    volume: 100,
                    muted: false,
                };

                setSoundBoard((prevSoundBoard) => {
                    const updatedSoundBoard = [...prevSoundBoard];
                    updatedSoundBoard[groupIndex].sounds.push(sound);
                    return updatedSoundBoard;
                });
            }
        };
        input.click(); // Open the file dialog
    };

    // Play Sound
    const toggleSound = (groupIndex, soundIndex) => {
        const sound = soundBoard[groupIndex].sounds[soundIndex];
        if (!sound.path) return;

        const soundName = sound.name;

        // Check if the sound is already playing
        if (audioInstances[soundName]) {
            // Stop the audio
            audioInstances[soundName].pause();
            audioInstances[soundName].currentTime = 0; // Reset playback position
            // Remove from playlist and delete instance
            setPlaylist((prevPlaylist) => prevPlaylist.filter((name) => name !== soundName));
            setAudioInstances((prevInstances) => {
                const updatedInstances = { ...prevInstances };
                delete updatedInstances[soundName];
                return updatedInstances;
            });
        } else {
            // Play the audio
            const audio = new Audio(sound.path);
            audio.volume = sound.volume / 100;
            audio.muted = sound.muted; // Set mute status based on sound settings

            // Add to playlist and Audio instances
            setPlaylist((prevPlaylist) => [...prevPlaylist, soundName]);
            setAudioInstances((prevInstances) => ({
                ...prevInstances,
                [soundName]: audio,
            }));

            audio.addEventListener("ended", () => {
                // Remove from playlist and instances when playback ends
                setPlaylist((prevPlaylist) => prevPlaylist.filter((name) => name !== soundName));
                setAudioInstances((prevInstances) => {
                    const updatedInstances = { ...prevInstances };
                    delete updatedInstances[soundName];
                    return updatedInstances;
                });
            });

            audio.play().catch((err) => console.error("Audio play error:", err));
        }
    };

    // Remove Group
    const handleRemoveGroup = (groupIndex) => {
        setSoundBoard((prevSoundBoard) => {
            const updatedSoundBoard = prevSoundBoard.filter((_, index) => index !== groupIndex);
            return updatedSoundBoard;
        });
    
        // Optionally, you can clean up audio instances from this group if needed
        const groupSounds = soundBoard[groupIndex]?.sounds || [];
        setAudioInstances((prevInstances) => {
            const updatedInstances = { ...prevInstances };
            groupSounds.forEach((sound) => {
                if (updatedInstances[sound.name]) {
                    // Stop the audio if it's playing
                    updatedInstances[sound.name].pause();
                    updatedInstances[sound.name].currentTime = 0;
                    delete updatedInstances[sound.name];
                }
            });
            return updatedInstances;
        });
    
        // Optionally, remove any playing sounds of this group from the playlist
        setPlaylist((prevPlaylist) => {
            const groupSoundsNames = groupSounds.map((sound) => sound.name);
            return prevPlaylist.filter((name) => !groupSoundsNames.includes(name));
        });
    };


    const handleRemoveSound = (groupIndex, soundIndex) => {
        setSoundBoard((prevSoundBoard) => {
            const updatedSoundBoard = [...prevSoundBoard];
            const soundName = updatedSoundBoard[groupIndex].sounds[soundIndex].name;
    
            // Remove the sound from the group's sounds array
            updatedSoundBoard[groupIndex].sounds = updatedSoundBoard[groupIndex].sounds.filter((_, index) => index !== soundIndex);
    
            return updatedSoundBoard;
        });
    
        // Clean up audio instances
        setAudioInstances((prevInstances) => {
            const updatedInstances = { ...prevInstances };
            const soundName = soundBoard[groupIndex].sounds[soundIndex]?.name;
    
            if (updatedInstances[soundName]) {
                // Stop the audio if it's playing
                updatedInstances[soundName].pause();
                updatedInstances[soundName].currentTime = 0;
                delete updatedInstances[soundName];
            }
    
            return updatedInstances;
        });
    
        // Remove the sound from the playlist
        setPlaylist((prevPlaylist) => prevPlaylist.filter((name) => name !== soundBoard[groupIndex].sounds[soundIndex]?.name));
    };


    return (
        <div className='w-full h-full flex flex-wrap gap-2 items-start justify-start overflow-auto'>
            {/* Global Sound Settings */}
            <Card className="select-none shadow">
                    
                <CardHeader className="px-2 py-2 flex items-center justify-center text-center">
                    <CardTitle className="text-lg truncate">M/C</CardTitle>
                </CardHeader>

                <CardContent className="p-2">
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <Button
                            variant={`${master.muted ? "destructive" : "outline"}`}
                            size="icon"
                            className={`rounded-full`}
                            onClick={toggleMuteMaster}
                        >
                            {
                                master.muted ? (<VolumeX className='w-4 h-4 cursor-pointer' onClick={() => toggleMuteMaster()}/>)
                                : master.global_volume === 0 ? (<VolumeOff className='w-4 h-4 cursor-pointer' onClick={() => toggleMuteMaster()}/>)
                                : master.global_volume < 50 ? (<Volume1 className='w-4 h-4 cursor-pointer' onClick={() => toggleMuteMaster()}/>)
                                : (<Volume2 className='w-4 h-4 cursor-pointer' onClick={() => toggleMuteMaster()}/>)
                            }
                        </Button>
                        <SliderV
                            defaultValue={[50]}
                            value={[master.global_volume]}
                            onValueChange={(value) => handleVolumeChangeMaster("global_volume", value)}
                            max={100}
                            min={0}
                            step={1}
                            className={`${master.muted ? "opacity-30" : "opacity-100"}`}
                            thumbClassName="h-4 w-4 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none ring-offset-black"
                            // disabled={sound.muted}
                        />
                        {master.global_volume}
                    </div>
                </CardContent>
            </Card>

            {soundBoard.map((group, index) => (
                <ContextMenu key={index}>
                    <ContextMenuTrigger className="flex h-fit w-fit items-center justify-center rounded-md text-sm">
                        <Card className="select-none shadow">
                            <CardHeader className="px-2 py-2">
                                <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                            </CardHeader>

                            <CardContent className="p-2 min-w-[116px] min-h-[100px]">
                                <ToggleGroup
                                    type="multiple"
                                    className="w-fit flex flex-wrap items-start justify-start gap-2 max-w-[532px]"
                                    value={playlist}
                                    onValueChange={(value) => setPlaylist(value)}
                                    variant="outline"
                                >
                                    {/* Default sound button */}
                                    { group.sounds.length < 1 && 
                                        <div key="skeleton" className="flex flex-col gap-2">
                                            
                                            <Button
                                                variant="outline"
                                                disabled={true}
                                                className={`min-w-[100px] max-w-[100px] min-h-[60px] max-h-[60px] border shadow`}
                                            >
                                               <AudioLines className='w-5 h-5'/> 
                                            </Button>

                                            {/* Label Thumb */}
                                            <div className="flex flex-row flex-no-wrap items-center justify-center text-center">
                                                <Label className="text-xs">No Sound Added</Label>
                                            </div>

                                        </div>
                                    }

                                    {group?.sounds.map((sound, sindex) => (
                                        <div key={sindex} className="flex flex-col gap-2">
                                            {/* Sound Button */}
                                            <ToggleGroupItem
                                                value={sound.name}
                                                className={`transition-none data-[state=on]:bg-green-500 data-[state=on]:text-green-50
                                                hover:bg-transparent dark:hover:bg-transparent min-w-[100px] max-w-[100px] min-h-[60px] max-h-[60px] shadow`}
                                                onClick={() => toggleSound(index, sindex)}
                                            >
                                                {sound.name}
                                            </ToggleGroupItem>
                                                                         
                                            {/* Volumne Thumb */}
                                            <div className="flex flex-row flex-no-wrap gap-1 items-center justify-between">
                                                {
                                                    sound.muted ? (<VolumeX className='w-4 h-4 cursor-pointer text-red-400 dark:text-red-500' onClick={() => toggleMute(index, sindex)}/>)
                                                    : sound.volume === 0 ? (<VolumeOff className='w-4 h-4 cursor-pointer' onClick={() => toggleMute(index, sindex)}/>)
                                                    : sound.volume < 50 ? (<Volume1 className='w-4 h-4 cursor-pointer' onClick={() => toggleMute(index, sindex)}/>)
                                                    : (<Volume2 className='w-4 h-4 cursor-pointer' onClick={() => toggleMute(index, sindex)}/>)
                                                }
                                                <Slider
                                                    defaultValue={[50]}
                                                    value={[sound.volume]}
                                                    onValueChange={(value) => handleVolumeChange(index, sindex, value)}
                                                    max={100}
                                                    min={0}
                                                    step={1}
                                                    className={`${sound.muted ? "opacity-30" : "opacity-100"}`}
                                                    thumbClassName="h-4 w-4 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none ring-offset-black"
                                                    // disabled={sound.muted}
                                                />
                                                {/* {sound.volume} */}
                                            </div>

                                        </div>
                                    ))}
                                </ToggleGroup>
                            </CardContent>
                        </Card>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-40">
                        <ContextMenuItem onClick={() => handleAddSound(index)}>
                            Add Sound
                        </ContextMenuItem>
                        <ContextMenuItem className="text-red-400 focus:text-red-400" onClick={() => handleRemoveGroup(index)}>
                            Remove Group
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuSub>
                            <ContextMenuSubTrigger disabled={group.sounds.length < 1}>Remove Button...</ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-40">
                                {group.sounds.map((sound, sindex) => (
                                    <ContextMenuItem key={sindex} className="text-red-400 focus:text-red-400" onClick={() => handleRemoveSound(index, sindex)}>
                                        {sound.name}
                                    </ContextMenuItem>
                                ))}
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    </ContextMenuContent>
                </ContextMenu>

            ))}
        </div>
    );
}

export default Board;
  