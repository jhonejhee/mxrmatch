import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from 'context/GlobalContext';
import { ToggleGroup, ToggleGroupItem } from "components/ui/toggle-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import { Slider } from "components/ui/slider"
import { Volume1, Volume2, VolumeOff, VolumeX } from 'lucide-react'


function Board() {
    const { soundBoard, setSoundBoard } = useContext(GlobalContext);
    const [s, setS] = useState([]);

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
            updatedSoundBoard[groupIndex].sounds[soundIndex].volume = value[0] / 100;
            return updatedSoundBoard;
        });
    };

    // useEffect(() => {
    //     console.log(s)
    // }, [s])

    return (
        <div className='w-full h-full flex gap-2 items-start justify-start'>
            {soundBoard.map((group, index) => (
                <Card key={index} className="select-none shadow">
                    
                    <CardHeader className="px-2 py-2">
                        <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                    </CardHeader>

                    <CardContent className="p-2">
                        <ToggleGroup
                            type="multiple"
                            className="w-fit flex items-center gap-2"
                            value={s}
                            onValueChange={(value) => setS(value)}
                        >
                            {group?.sounds.map((sound, sindex) => (
                                <div key={sindex} className="flex flex-col gap-2">
                                    {/* Sound Button */}
                                    <ToggleGroupItem
                                        value={sound.name}
                                        className="bg-white border min-w-[100px] max-w-[100px] min-h-[60px] shadow"
                                        variant="outline"
                                    >
                                        {sound.name}
                                    </ToggleGroupItem>

                                    {/* Volumne Thumb */}
                                    <div className="flex flex-row flex-no-wrap gap-1 items-center justify-between">
                                        {
                                            sound.muted ? (<VolumeX className='w-4 h-4 cursor-pointer' onClick={() => toggleMute(index, sindex)}/>)
                                            : sound.volume === 0 ? (<VolumeOff className='w-4 h-4 cursor-pointer' onClick={() => toggleMute(index, sindex)}/>)
                                            : sound.volume < 0.5 ? (<Volume1 className='w-4 h-4 cursor-pointer' onClick={() => toggleMute(index, sindex)}/>)
                                            : (<Volume2 className='w-4 h-4 cursor-pointer' onClick={() => toggleMute(index, sindex)}/>)
                                        }
                                        <Slider
                                            defaultValue={[50]}
                                            value={[sound.volume * 100]}
                                            onValueChange={(value) => handleVolumeChange(index, sindex, value)}
                                            max={100}
                                            min={0}
                                            step={1}
                                            className={`${sound.muted ? "opacity-30" : "opacity-100"}`}
                                            thumbClassName="h-4 w-4 focus:outline-none focus-visible:ring-0 focus-visible:outline-none ring-offset-black"
                                            // disabled={sound.muted}
                                        />
                                    </div>

                                </div>
                            ))}
                        </ToggleGroup>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default Board;
  