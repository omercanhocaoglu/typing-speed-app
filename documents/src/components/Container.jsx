import React,{ useState, useEffect, useRef } from 'react';

import randomWords from "random-words";





function Container () {
  
    
    const NumbOfWords = 100;

    const seconds = 60;
    
    const [words, setWords] = useState([]);

    const [countDown, setCountDown] = useState(seconds);

    const [currentInput, setCurrentInput] = useState("");

    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const [currentCharIndex, setCurrentCharIndex] = useState(-1);

    const [currentChar, setCurrentChar] = useState("");

    const [correct, setCorrect] = useState(0);

    const [incorrect, setInCorrect] = useState(0);

    const [status, setStatus] = useState("waiting");

    const textInput = useRef(null);

    useEffect( () => {
        
        if (status === "started") {
            textInput.current.focus()
        }
    },[status] );
  
    useEffect( () => {
        setWords(generateWords())
    }, [] );

    const generateWords = () => {
        return new Array(NumbOfWords).fill(null).map( () => randomWords() )
    };

    const start = () => {

        if (status === "finished") {
            setWords(generateWords())
            setCurrentWordIndex(0)
            setCorrect(0)
            setInCorrect(0)
            setCurrentCharIndex(-1)
            setCurrentChar("")

        }
      
        if (status !== "started") {
            setStatus("started")
            let interval =  setInterval( ( ) => {
                setCountDown( ( decreaseCount => {
                    if (decreaseCount === 0) { 
                        clearInterval(interval) 
                        setStatus("finished")
                        setCurrentInput("")
                        return seconds}
    
                    else { return decreaseCount -1 }
                } ) );
            }, 1000 );
        }
      
       
    };

   

    const handleKeyDown = ( { keyCode, key } ) => {
        if ( keyCode === 32 ) { 
          
            checkMatch()
            setCurrentInput("") 
            setCurrentWordIndex(currentWordIndex + 1)
            setCurrentCharIndex(-1)
        } 

        else if (keyCode === 8) {
            setCurrentCharIndex( currentCharIndex -1 )
            setCurrentChar("")
        }

        else {
            setCurrentCharIndex(currentCharIndex +1)
            setCurrentChar(key)
        }

    };

    const checkMatch = () => {
        const wordToCompare = words[ currentWordIndex ];

        const doesItMatch = wordToCompare === currentInput.trim();

        console.log({doesItMatch});

        if (doesItMatch) { setCorrect(correct +1) }

        else {setInCorrect( incorrect +1 )}


    };

    const getCharClass = ( wordIndex, charIndex, char ) => {

        if (wordIndex ===  currentWordIndex & charIndex === currentCharIndex && currentChar && status !== "finished" ) {
            if (char === currentChar) {
                return "has-background-success" 
            }
    
            else {
                return "has-background-danger"
            }
        }

        else if (wordIndex === currentWordIndex && currentCharIndex >= words[currentWordIndex].length) {
            return "has-background-danger"
        }

        else { 
          return "" 
        }

        
    };

    return (
    
    <div className='section'>

        <div className='is-size-1'>

        <h2> Remaining Time: <span className='has-text-primary'> {countDown} </span>  </h2>

        </div>

            
        
        <div className='control is-expanded section'>

            <input ref={textInput} disabled={status !== "started"} type="text" className='input' onKeyDown={handleKeyDown} value={currentInput} 
            onChange={(e) => setCurrentInput(e.target.value)} />

        </div>


        <div className='section'>

            <div className="columns">
               
               <div className="column  is-offset-5">
                      
                      <button className="button is-primary is-large" onClick={start}> 
                    
                          Start 
                
                      </button>

              </div>
            
            </div>

        </div>




    {status === "started" && (
            <div className='section'>

                <div className='card'>

                    <div className='card-content'>

                        <div className='content'>

                        {words.map((word, i) => (
                          <span key={i}>
                            <span>
                              {word.split("").map((char, idx) => (
                              <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                              )) }
                            </span>
                            
                            <span> </span>
                          </span>
                          ))}

                        </div>

                    </div>

                </div>

            </div>
    ) }    
        
    {status === "finished" && (
    
            <div className='section'>

                    <div className='columns'>

                        <div className="column has-text-centered">

                            <p className="is-size-5"> Words per Minute: </p>

                            <p className="has-text-primary is-size-1"> {correct} </p>

                           

                        </div>

                        <div className="column has-text-centered">

                            <p className="is-size-5"> İncorrect: </p>

                            <p className="has-text-danger is-size-1"> {incorrect} </p>

</div>

                        <div className="column has-text-centered">    
                
                            <p className="is-size-5"> Accuracy: </p>
                                
                            <p className="has-text-primary is-size-1"> {Math.round(( correct / (correct + incorrect )) * 100 )} % </p>
                

                        </div>

                    </div>

            </div>
    )}
        


        
    </div>
  )
};

export default Container;













