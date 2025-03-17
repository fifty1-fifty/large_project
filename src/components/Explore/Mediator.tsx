import { React, useState, createContext } from "react";
//import "./index.css";
import Search_Ex from "./Search_Ex";
//import "./App.css";
import Gallery_Ex from "./Gallery_Ex";

export const newContext = createContext();

const newContextProvider = ({ galley }) => {
  const [name, setName] = useState(undefined);

 return (
        <newContext.Provider value={{ name, setName }}>
            {gallery}
        </newContext.Provider>
    );
};

const App = () => {
    return (
        <div className="Mediator">
            <h1>i want to die</h1>
            <newContextProvider>
                <Search_Ex />
                <Gallery_Ex />
            </neweContextProvider>
        </div>
    );
};

export default Mediator;
