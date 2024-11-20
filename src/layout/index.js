import MenuBar from "./MenuBar";
import Board from "./Board";
import { GlobalProvider } from 'context/GlobalContext';

function MxrMatch() {
  return (
    <div className="space-y-4 h-full">
      <MenuBar/>
      <GlobalProvider>
        <Board/>
      </GlobalProvider>
    </div>
  );
}

export default MxrMatch;
