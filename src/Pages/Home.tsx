import React, { useEffect } from "react"
import "./Home.css"
import Computer from "../Images/Computer.jfif"
import section1Img from "../Images/section1.jfif"
import Typewriter from "typewriter-effect/dist/core"

interface Props {
  mode: string
}

export const Home: React.FC<Props> = ({ mode }) => {
  useEffect(() => {
    new Typewriter('#typewriter', {
      strings: ['any device', 'any viewport', 'any ratio'],
      autoStart: true,
      loop: true,
    })
  }, [])

  return (
    <>
      <section id="section1" className={mode === "light" ? "lightSec1" : "darkSec1"}>
        <img src={section1Img} alt="People communicating using sign language" className="hero-bg" />
        <div className="hero-content">
          <h1>Handspeak AI</h1>
          <p>
            <b>Handspeak AI</b> is an AI based on UN SDGs{" "}
            <b>Reducing Inequalities</b> and <br />
            <b>Improving quality of education</b>. It helps people with speech
            disabilities <br />
            converse using sign language — <b>A buffed Google Translate!</b>
          </p>
        </div>
      </section>

      <section id="section2" className={mode === "light" ? "lightSec2" : "darkSec2"}>
        <div id="content">
          <p>Works on <b id="typewriter"></b></p>

          <div className="devices-wrapper">
            <div className="device desktop">
              <div className="monitor">
                <div className="screen">
                  <img src={Computer} alt="Desktop demo" />
                </div>
              </div>
            </div>

            <div className="device phone">
              <div className="body">
                <div className="notch"></div>
                <div className="screen"><img src={Computer} alt="" /></div>
                <div className="home-indicator"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="section3">
        <h1>Real time AI integration</h1>
        <p>Advantages: </p>
      </section>
    </>
  )
}