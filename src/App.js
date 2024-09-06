import React, {createContext} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
export const userContext = createContext();
export const age = createContext();
import Facebook from './components/Facebook';
function App() {
  return (
    <div className="App">
   <Facebook/>
    </div>
  );
}

export default App;
