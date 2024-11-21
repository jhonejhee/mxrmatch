import React, { useContext, useEffect } from 'react';
import MxrMatch from "layout/index.js";
import { GlobalContext } from 'context/GlobalContext';

function App() {
  const { dark } = useContext(GlobalContext);

  useEffect(() => {
    console.log(dark)
  }, [dark])
  return (
    <div className={`p-4 flex flex-col gap-2 bg-white dark:bg-black min-h-screen ${dark && "dark"}`}>
      <MxrMatch/>
    </div>
  );
}

export default App;
