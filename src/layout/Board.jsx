import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from 'context/GlobalContext';
import { ToggleGroup, ToggleGroupItem } from "components/ui/toggle-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import { Slider, SliderV } from "components/ui/slider"
import { Volume1, Volume2, VolumeOff, VolumeX, AudioLines } from 'lucide-react'
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
  } from "components/ui/context-menu"


function Board() {
    const { soundBoard, setSoundBoard, master, setMaster } = useContext(GlobalContext);
    const [playlist, setPlaylist] = useState([]);

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
            updatedSoundBoard[groupIndex].sounds[soundIndex].muted = !updatedSoundBoard[groupIndex].sounds[soundIndex].muted;
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
    

    // useEffect(() => {
    //     console.log(playlist)
    // }, [playlist])

    return (
        <div className='w-full h-full flex gap-2 items-start justify-start'>
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
                                master.muted ? (<VolumeX className='w-4 h-4 cursor-pointer' onClick={() => toggleMuteMaster(i)}/>)
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
                                    className="w-fit flex items-center gap-2"
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
                                                className={`data-[state=on]:bg-green-500 data-[state=on]:text-green-50
                                                hover:bg-white hover:text-black min-w-[100px] max-w-[100px] min-h-[60px] max-h-[60px] shadow`}
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
                        <ContextMenuItem>
                            Add Sound
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
                
            ))}
        </div>
    );
}

export default Board;
  