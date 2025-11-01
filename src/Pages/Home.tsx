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
  useEffect(() => {
    const section3 = document.getElementById("section3");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section3?.classList.add("visible");
      },
      { threshold: 0.2 }
    );
    if (section3) observer.observe(section3);
    return () => observer.disconnect();
  }, []);
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
        <h1>Advantages: </h1>
        <p className="topic">1) Flexibility:</p>
        <p>It is a flexible source of translation where a person can input their own text sign images to text based on their ease and personal preferences</p>
        <p className="topic">2) Accuracy</p>
        <p>It is a source of proper and accurate translation of people's sign language</p>
        <p className="topic">3) Time convinient</p>
        <p>It is a source of translation taking hardly time to convert which almost appears instant while taking video from live feed</p>
      </section>
      <section id="section4">
        <h1></h1>
      </section>
    </>
  )
}