import { useEffect, useState } from "react";
import words from './WordsDb';
import "./ScrambledWord.css"
const API = process.env.REACT_APP_API_URL

function ScrambledWord () {
  const [wordDefinition, setwordDefinition] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [won, setWon] = useState(false);
  const [todayWord, setTodayWord] = useState({word: ''});
  const [definitionOfWord, setDefinitionOfWord] = useState([])
  const [revealDefinition, setRevealDefinition] = useState("")
  const [count, setCount] = useState(0)
  const [shown, setShown] = useState(false)


  const [guesses, setGuesses] = useState(1)
  const [wordMash, setWordMash] = useState("")
  useEffect(() => {

      fetch(`${API}/${todayWord.word}`)
      .then(response => response.json())
      .then(data => {
        setwordDefinition(data)
        let spiltDefinition = data[0].meanings[0].definitions[0].definition.split(" ")
        setDefinitionOfWord(spiltDefinition)
        setIsLoading(true)
        setWordMash(scramble(todayWord.word))
      })
      .catch(error => console.error(error));
    }, [API, todayWord]);
  


  function scramble (word) {
    let wordArr = word.split('')
    let newArr = []

    for (let i=0; i< word.length; i++ ){
      let letter = wordArr[Math.floor(Math.random() * wordArr.length)]
      let index = wordArr.indexOf(letter)
      wordArr.splice(index,1)
      newArr.push(letter)
    }
    return newArr.join('')
  }

  function todaysWord() {
    let todaysDate = (Math.ceil(Date.now() / 1000 / 60 / 60 / 24))-19653
    let todaysWord = words[todaysDate % words.length]
    setTodayWord(todaysWord) 
    setShown(true)
    definitionTimeout()

  }
  function definitionTimeout(){
    let newRevealDefinition = ""

    definitionOfWord.map( (word, index) => {
      setTimeout(() => {
        newRevealDefinition += " " + word
        console.log(word);
        setRevealDefinition(newRevealDefinition)
      }, 4000 * (index + 1) )
    }) 
    document.getElementById("PlayButton").innerText = "Need Definition?"
    setCount(count+1)
    if(count === 1){
      document.getElementById("PlayButton").remove()
    }
  }


  function CheckWord(event) {
    event.preventDefault()
    let wrongList = []
    if(todayWord.word === event.target.DailyWord.value){
      setWon(true)
    } else {
      setGuesses(guesses +1 )
      document.getElementById("Guess").innerText = `Guess Attempt:  ${guesses}`
      setWon(false)
      wrongList.push(event.target.DailyWord.value)
      // wrongList()
    }
  }


  // wrongList for guesses users have made
  function wrongList(arr) {
    
  }


  return (
    <div className="scrambled-area">

      <h1>

        {isLoading ? wordMash : <h2></h2> }

      </h1>
      <button  
      className='scrambled-area__play-button'
        type="submit"
        onClick={todaysWord}
        id="PlayButton"
        >Play</button>

        <br></br>

      {shown ?
          <form onSubmit={CheckWord}>
          <input
          id="DailyWord"
          className="daily-word"
          type="search"
          ></input>

          <button 
          className="daily-word__button"
          type="submit"
          >Guess</button>
        </form>
        :
        <p></p>}
      {shown ?
      <h1 className="winner" id="Guess">{won ? "You did it " : ""}</h1>
      :
      <p></p>
      }
      {shown ?
        <div>
          
            <div className="hidden">
              <h1 className='word-definition' id = "defeinitionWebPage"><span>Definition:</span>{revealDefinition}</h1>
            </div> 
        </div>
        :
        <p></p>
      }

    </div>
  )
}

export default ScrambledWord;