import { useRef, useState, type DetailedHTMLProps, type HTMLAttributes } from "react"
import { Home } from "./Pages/Home"
import "./App.css"

export default function App() {
  const [mode, setMode] = useState("dark")
  const [menuOpen, setMenuOpen] = useState(false)
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
            <button>Home</button>
          </li>
          <li>
            <button>Feed Data</button>
          </li>
          <li>
            <button>Recognise</button>
          </li>
          <li>
            <button></button>
          </li>
        </ul>
      </nav>
      <Home mode={mode} />
    </>
  )
}
