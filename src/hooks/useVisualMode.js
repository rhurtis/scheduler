import React from "react";
import {useState} from "react";
/*
The useVisualMode() function/hook.
Input: takes in initital mode
Output: return a object with a mode property.
*/

export default function useVisualMode(initialMode) {
  
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]); // This line is new!
  
  const transition = function (mode, replace = false) {
    const history1 = [...history]
    if (replace === true) {
      history1.pop()
    }
   
    setMode(mode)
    setHistory([...history1, mode])        
      
    
  };

  const back = function (mode,transition, initialMode) {
    if (history.length > 1) {
      const history1 = [...history]
      history1.pop()
      setMode(history1[history1.length-1]) 
      setHistory(history1)
    }
  };

  
  return (
    {
      mode: mode,
      transition: transition,
      back: back
    }
  )
  
};

