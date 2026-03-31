import { useState, useRef, useEffect } from "react";
import { FaGithub, FaPlay } from "react-icons/fa";

function ProjectCard({ project }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [savedTime, setSavedTime] = useState(0);

    const smallVideoRef = useRef(null);
    const largeVideoRef = useRef(null);

    // פתיחת המודאל
    const openModal = () => {
        const smallVideo = smallVideoRef.current;
        if (smallVideo) {
            // שומרים את הנקודה שבה הסרטון הקטן נמצא כרגע
            setSavedTime(smallVideo.currentTime);
        }
        setModalOpen(true);
    };


    const closeModal = () => {
        const largeVideo = largeVideoRef.current;
        const smallVideo = smallVideoRef.current;

        if (largeVideo && smallVideo) {
            // מעדכנים את הסרטון הקטן לזמן שבו המשתמש הפסיק לצפות בגדול
            smallVideo.currentTime = largeVideo.currentTime;
            // מבטיחים שהקטן יהיה בעצירה
            smallVideo.pause();
        }
        setModalOpen(false);
    };

    // סינכרון הזמן ברגע שהמודאל נפתח (בלי Play אוטומטי)
    useEffect(() => {
        if (modalOpen && largeVideoRef.current && project.video) {
            largeVideoRef.current.currentTime = savedTime;
            // לא קוראים ל-.play(), אז הוא נשאר ב-Pause בנקודה הנכונה
        }
    }, [modalOpen, savedTime, project.video]);

    return (
        <>
            {/* הכרטיס - לחיץ כולו */}
            <div className="project-card" onClick={openModal} style={{ cursor: 'pointer' }}>
                <h3>{project.title}</h3>

                {project.video ? (
                    <div className="video-wrapper" style={{ position: 'relative' }}>
                        <video
                            ref={smallVideoRef}
                            src={project.video}
                            controls={false}
                            width="300"
                            muted
                            preload="metadata" // טוען רק מידע בסיסי כדי לא להכביד
                            style={{ borderRadius: '8px', objectFit: 'cover', height: '169px', display: 'block' }}
                        />
                        {/* שכבה מעל הסרטון כדי להראות שהוא לחיץ ולהוסיף אייקון Play מרכזי */}
                        <div className="video-overlay" style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            background: 'rgba(0,0,0,0.4)', borderRadius: '8px', transition: '0.3s'
                        }}>
                            <FaPlay size={40} color="white" style={{ opacity: 0.8 }} />
                        </div>
                    </div>
                ) : project.images.length > 0 ? (
                    <img src={project.images[0]} alt={project.title} width="300" style={{ borderRadius: '8px' }} />
                ) : (
                    <div className="placeholder">View Project</div>
                )}
            </div>

            {/* המודאל */}
            {modalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>✕</button>

                        <h2>{project.title}</h2>
                        <p>{project.description}</p>

                        {project.video ? (
                            <video
                                ref={largeVideoRef}
                                src={project.video}
                                controls // המשתמש ילחץ Play בעצמו
                                width="100%"
                                style={{ maxHeight: "70vh", borderRadius: '8px', display: 'block' }}
                            />
                        ) : project.images.length > 0 ? (
                            <div className="modal-images" style={{ textAlign: "center" }}>
                                {project.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={project.title}
                                        style={{
                                            width: "45%",
                                            margin: "15px",
                                            borderRadius: "8px",
                                            display: "inline-block"
                                        }}
                                    />
                                ))}
                            </div>
                        ) : null}

                        <div style={{marginTop: "25px", textAlign: 'center'}}>
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                                <FaGithub /> View Code on GitHub
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProjectCard;