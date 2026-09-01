import './App.css';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
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

const skillGroups = [
    { title: "Languages", items: ["Java", "JavaScript", "C", "C++", "Python", "SQL"] },
    { title: "Web & Frameworks", items: ["React", "Node.js"] },
    { title: "Cloud & Tools", items: ["GCP", "Cloudflare", "GitHub", "Cursor"] },
    { title: "Concepts", items: ["OOP", "REST APIs"] },
];

function About() {
    return (
        <section id="about" className="section">
            <h1>About Me</h1>
            <p>Hi, I’m Yogev. A Computer Science graduate and Software Developer focused on
                building high-performance web applications and backend systems. I love
                turning complex ideas into clean, functional code.</p>
            <div className="skills">
                {skillGroups.map((group) => (
                    <div key={group.title} className="skill-group">
                        <h3>{group.title}</h3>
                        <div className="skill-pills">
                            {group.items.map((skill) => (
                                <span key={skill} className="skill-pill">{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" className="section">
            <h1>Contact</h1>
            <h2>Excited to start my career — open to opportunities for junior developers.<br />
                Let’s create something together!</h2>
            <div className="contact-container">

                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=yogev7854@gmail.com" target="_blank" rel="noopener noreferrer">
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
        <section id="projects" className="section">
            <h1>Projects</h1>
            <div className="projects-grid">
                {projectList.map((proj) => (
                    <ProjectCard key={proj.id} project={proj} />
                ))}
            </div>
        </section>
    )
}


const NAV_SECTIONS = ["about", "projects", "contact"];

function Navbar() {
    const [activeSection, setActiveSection] = useState("about");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);

            const offset = 120;
            let current = NAV_SECTIONS[0];

            for (const id of NAV_SECTIONS) {
                const section = document.getElementById(id);
                if (section && section.offsetTop <= window.scrollY + offset) {
                    current = id;
                }
            }

            setActiveSection(current);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={scrolled ? "scrolled" : ""}>
            {NAV_SECTIONS.map((id) => (
                <a
                    key={id}
                    href={`#${id}`}
                    className={activeSection === id ? "active" : ""}
                >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
            ))}
        </nav>
    );
}

const CURSOR_RADIUS = 12;
const POP_DURATION = 0.35;

function createDot(id, width, height) {
    const radius = 2.5 + Math.random() * 5;
    return {
        id,
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        speed: 40 + Math.random() * 70,
        color: Math.random() > 0.8 ? "#ff9800" : "#00bcd4",
        popTimer: 0,
    };
}

function respawnDot(dot, width, height) {
    dot.x = Math.random() * width;
    dot.y = height + dot.radius;
    dot.popTimer = 0;
}

function BackgroundGame() {
    const cursorRef = useRef(null);
    const glowRef = useRef(null);
    const dotElementsRef = useRef([]);
    const dotsRef = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });
    const pos = useRef({ x: 0, y: 0 });
    const [enabled, setEnabled] = useState(false);
    const [score, setScore] = useState(0);
    const [dotCount, setDotCount] = useState(18);

    useEffect(() => {
        const media = window.matchMedia("(hover: hover) and (pointer: fine)");
        setEnabled(media.matches);
        const handler = (e) => setEnabled(e.matches);
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, []);

    const initialDots = useMemo(
        () => Array.from({ length: dotCount }, (_, i) =>
            createDot(i, window.innerWidth, window.innerHeight)
        ),
        [dotCount]
    );

    useEffect(() => {
        dotsRef.current = initialDots.map((d) => ({ ...d }));
    }, [initialDots]);

    useEffect(() => {
        const updateCount = () => {
            setDotCount(window.innerWidth <= 640 ? 8 : 18);
        };
        updateCount();
        window.addEventListener("resize", updateCount);
        return () => window.removeEventListener("resize", updateCount);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        if (enabled) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        let frameId;
        let lastTime = performance.now();

        const animate = (time) => {
            const dt = Math.min((time - lastTime) / 1000, 0.05);
            lastTime = time;

            if (enabled) {
                const followSpeed = 0.12;
                pos.current.x += (mouse.current.x - pos.current.x) * followSpeed;
                pos.current.y += (mouse.current.y - pos.current.y) * followSpeed;

                const cursorTransform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
                if (cursorRef.current) cursorRef.current.style.transform = cursorTransform;
                if (glowRef.current) glowRef.current.style.transform = cursorTransform;
            }

            const w = window.innerWidth;
            const h = window.innerHeight;

            dotsRef.current.forEach((dot, i) => {
                const el = dotElementsRef.current[i];
                if (!el) return;

                if (dot.popTimer > 0) {
                    dot.popTimer -= dt;
                    const progress = 1 - dot.popTimer / POP_DURATION;
                    const scale = 1 + progress * 2.5;
                    const opacity = Math.max(0, 1 - progress);
                    el.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%) scale(${scale})`;
                    el.style.opacity = opacity;

                    if (dot.popTimer <= 0) {
                        respawnDot(dot, w, h);
                        el.style.opacity = 0.35;
                    }
                    return;
                }

                dot.y -= dot.speed * dt;
                if (dot.y < -dot.radius) {
                    respawnDot(dot, w, h);
                }

                if (enabled) {
                    const dx = pos.current.x - dot.x;
                    const dy = pos.current.y - dot.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < CURSOR_RADIUS + dot.radius) {
                        dot.popTimer = POP_DURATION;
                        setScore((s) => s + 1);
                    }
                }

                el.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`;
                el.style.opacity = 0.35;
            });

            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, [enabled]);

    return (
        <>
            <div className="floating-dots" aria-hidden="true">
                {initialDots.map((dot, i) => (
                    <span
                        key={dot.id}
                        ref={(el) => { dotElementsRef.current[i] = el; }}
                        className="dot"
                        style={{
                            width: dot.radius * 2 + "px",
                            height: dot.radius * 2 + "px",
                            backgroundColor: dot.color,
                        }}
                    />
                ))}
            </div>
            {enabled && (
                <>
                    <div ref={glowRef} className="mouse-glow" aria-hidden="true" />
                    <div ref={cursorRef} className="cursor-follower" aria-hidden="true" />
                    <div className="dot-score" aria-live="polite">{score}</div>
                </>
            )}
        </>
    );
}

const CODE_SNIPPETS = [
    "const score = 0;",
    "useEffect(() => {",
    "git push origin main",
    "return <App />;",
    "class Player {",
    "if (enabled) {",
    "map((proj) =>",
    "export default App;",
    "setScore(s => s + 1)",
    "npm start",
    "new Thread()",
    "SELECT * FROM users",
    "async fetchData()",
    "pointer-events: none",
    "requestAnimationFrame",
    "npm run build",
];

const CONTENT_WIDTH = 900;
const MIN_GUTTER = 150;
const MAX_CODE_LINES = 2;

function FloatingCode() {
    const [enabled, setEnabled] = useState(false);
    const [lines, setLines] = useState([]);
    const nextId = useRef(0);

    useEffect(() => {
        const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const update = () => {
            const gutter = (window.innerWidth - CONTENT_WIDTH) / 2;
            setEnabled(desktop.matches && !reduceMotion.matches && gutter >= MIN_GUTTER);
        };

        update();
        desktop.addEventListener("change", update);
        reduceMotion.addEventListener("change", update);
        window.addEventListener("resize", update);
        return () => {
            desktop.removeEventListener("change", update);
            reduceMotion.removeEventListener("change", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    useEffect(() => {
        if (!enabled) {
            setLines([]);
            return;
        }

        let cancelled = false;
        let timeoutId;

        const spawn = () => {
            if (cancelled) return;
            setLines((prev) => {
                if (prev.length >= MAX_CODE_LINES) return prev;
                return [
                    ...prev,
                    {
                        id: nextId.current++,
                        text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
                        side: Math.random() > 0.5 ? "left" : "right",
                        top: 18 + Math.random() * 64,
                        duration: 7 + Math.random() * 4,
                        color: Math.random() > 0.78 ? "#ff9800" : "#00bcd4",
                    },
                ];
            });
        };

        const loop = () => {
            spawn();
            timeoutId = setTimeout(loop, 4500 + Math.random() * 4500);
        };

        timeoutId = setTimeout(loop, 1800);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="code-drift" aria-hidden="true">
            {lines.map((line) => (
                <span
                    key={line.id}
                    className={`code-line from-${line.side}`}
                    style={{
                        top: `${line.top}vh`,
                        color: line.color,
                        animationDuration: `${line.duration}s`,
                    }}
                    onAnimationEnd={() => {
                        setLines((prev) => prev.filter((item) => item.id !== line.id));
                    }}
                >
                    {line.text}
                </span>
            ))}
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <BackgroundGame />
            <FloatingCode />
            <Navbar />
            <About />
            <Projects />
            <Contact />
        </div>
    );
}

export default App;