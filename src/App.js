import React, { useContext, useEffect } from 'react';
import MxrMatch from "layout/index.js";
import { GlobalContext } from 'context/GlobalContext';

function App() {
  const { dark } = useContext(GlobalContext);


  return (
    <div className={`p-4 flex flex-col gap-2 bg-zinc-100 dark:bg-zinc-900 min-h-screen ${dark && "dark"}`}>
      <MxrMatch/>
    </div>
  );
}

export default App;
