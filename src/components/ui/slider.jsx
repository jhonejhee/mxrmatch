import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"


import { cn } from "lib/utils"

const Slider = React.forwardRef(({ className, trackClassName, thumbClassName, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    <SliderPrimitive.Track
      className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800", trackClassName)}>
      <SliderPrimitive.Range className="absolute h-full bg-zinc-900 dark:bg-zinc-50" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn("block h-5 w-5 rounded-full border-2 border-zinc-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300", thumbClassName)} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName


const SliderV = React.forwardRef(({ className, trackClassName, thumbClassName, ...props }, ref) => (
  <form>
    <SliderPrimitive.Root
      // className="relative flex items-center data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-5 data-[orientation=vertical]:h-24"
      className={cn("relative flex w-full touch-none select-none items-center data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-5 data-[orientation=vertical]:h-24", className)}
      defaultValue={[50]}
      max={100}
      step={1}
      orientation="vertical"
    >
      <SliderPrimitive.Track
        // className="relative flex-grow bg-gray-500 h-[3px] data-[orientation=vertical]:w-full"
        className={cn("relative h-2 w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 grow overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ", trackClassName)}>
      
        <SliderPrimitive.Range
          // className="absolute bg-black h-full data-[orientation=vertical]:w-full"
          className="absolute h-full data-[orientation=vertical]:w-full bg-zinc-900 dark:bg-zinc-50" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn("block h-5 w-5 rounded-full border-2 border-zinc-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300", thumbClassName)}
      />
    </SliderPrimitive.Root>
  </form>
))

export { Slider, SliderV }

