import './App.css';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import ProjectCard from "./ProjectCard";


const projectList = [
    {
        id: 1,
        title: "Hunter Of Sentinels",
        description: "A 2D action game developed in Java Swing, using object-oriented programming to manage characters and the environment. Threads are used to handle movements, collisions, and real-time animations, providing a dynamic and engaging gameplay experience.",
        video: "/Videos/Hunter_Of_Sentinels.mp4",
        images: [],
        github: "https://github.com/YogevBashtekaer/HunterOfSentinels"
    },
    {
        id: 2,
        title: "Jumping Game",
        description: "Jump, dash, and roll through challenging levels in this fast-paced 2D platformer. Score as high as you can!",
        video: "/Videos/Gumping_Game.mp4",
        images: [],
        github: "https://github.com/YogevBashtekaer/JumpingGame/tree/master"
    },
    {
        id: 3,
        title: "DxBall",
        description: "Relive the nostalgic experience of DxBall with themed levels, dynamic brick-breaking gameplay, and custom music. Each level offers unique challenges and visuals, making every round engaging and fun.",
        video: "/Videos/DxBall.mp4",
        images: [],
        github: "https://github.com/YogevBashtekaer/DxBall"
    },
    {
        id: 4,
        title: "CoolBot — Telegram Bot",
        description: "An interactive Telegram bot that lets users apply unique photo effects, fetch live data from websites, and get random jokes or Pokémon info. Fun, dynamic, and engaging experience in one bot!",
        video: "",
        images: ["/Photos/bot1.jpeg",
                 "/Photos/bot2.jpeg",
                 "/Photos/bot3.jpeg",
                 "/Photos/bot4.jpeg",
                 "/Photos/bot5.jpeg"],
        github: "https://github.com/YogevBashtekaer/CoolBot"
    },
];

function About() {
    return (
        <section id="about" style={{  paddingTop: "45px", textAlign: "center" }}>
            <h1>About Me</h1>
            <p>Hi, I’m Yogev, a Computer Science graduate. Highly motivated, quick learner, and passionate about building impactful projects.<br />
                Currently seeking my first professional role in software development where I can contribute, learn, and grow.</p>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" style={{  textAlign: "center", paddingTop: "25px" }}>
            <h1>Contact</h1>
            <h2>Excited to start my career — open to opportunities for junior developers.<br />
                Let’s create something together!</h2>
            <div className="contact-container">

                <a href="mailto:yogev7854@gmail.com" >
                    <FaEnvelope size={25} />
                    yogev7854@gmail.com
                </a>

                <a href="tel:0509342808">
                    <FaPhone size={25} />
                    050-9342808
                </a>

                <a href="https://github.com/YogevBashtekaer" target="_blank" rel="noopener noreferrer">
                    <FaGithub size={25} />
                    GitHub
                </a>

                <a href="https://www.linkedin.com/in/yogev-bashteker-534352327/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={25} />
                    LinkedIn
                </a>

            </div>
        </section>
    );
}

function Projects(){
    return(
        <section id="projects" style={{ paddingTop: "45px", textAlign: "center" }}>
            <div>
                <h1>Projects</h1>
                <div className="projects-grid">
                    {projectList.map((proj) => (
                        <ProjectCard key={proj.id} project={proj} />
                    ))}
                </div>
            </div>

        </section>
    )
}


function Navbar() {
    return (
        <nav>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#projects">Projects</a>
        </nav>
    );
}

function CursorFollower() {
    const cursorRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const pos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            // מהירות עקיבה – ככל שהערך קטן יותר, הנקודה יותר איטית ומעוקבת חלק
            const speed = 0.15;

            pos.current.x += (mouse.current.x - pos.current.x) * speed;
            pos.current.y += (mouse.current.y - pos.current.y) * speed;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return <div ref={cursorRef} className="cursor-follower" />;
}

function App() {
    return (
        <div className="App">
            <CursorFollower />
            <Navbar />
            <About />
            <Projects />
            <Contact />
        </div>
    );
}

export default App;