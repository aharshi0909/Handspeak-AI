import { useRef, useState, type DetailedHTMLProps, type HTMLAttributes } from "react"
import { Home } from "./Pages/Home"
import "./App.css"
import Convert from "./Pages/Convert"
import Feed from "./Pages/Feed"

export default function App() {
  const [mode, setMode] = useState("dark")
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState('Home')
  const Menu: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> = useRef(null)

  const changeMenu = () => {
    setMenuOpen(!menuOpen)
    if (!menuOpen) {
      Menu.current.style.height = "55vh"
    } else {
      Menu.current.style.height = "10vh"
    }
  }
  return (
    <>
      <nav ref={Menu} className={mode === "light" ? "lightNav" : "darkNav"}>
        <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={changeMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <ul className={menuOpen ? "active" : ""}>
          <li>
            <button onClick={()=>{setPage('Home')}}>Home</button>
          </li>
          <li>
            <button onClick={()=>{setPage('Feed')}}>Feed Data</button>
          </li>
          <li>
            <button onClick={()=>{setPage('Convert')}}>Recognise</button>
          </li>
          <li>
            <button></button>
          </li>
        </ul>
      </nav>
      {page == 'Home' && <Home mode={mode} />}
      {page == 'Convert' && <Convert mode={mode}/>}
      {page == 'Feed' && <Feed mode={mode}/>}
    </>
  )
}

