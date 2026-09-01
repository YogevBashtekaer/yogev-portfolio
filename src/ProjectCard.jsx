import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaGithub, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ImageCarousel({ images, alt }) {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(0);

    const goPrev = (e) => {
        e.stopPropagation();
        setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
    };

    const goNext = (e) => {
        e.stopPropagation();
        setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));
    };

    const goTo = (e, index) => {
        e.stopPropagation();
        setCurrent(index);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) < 50) return;
        if (diff > 0) {
            setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));
        } else {
            setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
        }
    };

    return (
        <div className="carousel">
            <div
                className="carousel-slide"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <button type="button" className="carousel-btn carousel-prev" onClick={goPrev} aria-label="Previous image">
                    <FaChevronLeft />
                </button>

                <img
                    src={images[current]}
                    alt={`${alt} — ${current + 1} of ${images.length}`}
                    className="carousel-image"
                />

                <button type="button" className="carousel-btn carousel-next" onClick={goNext} aria-label="Next image">
                    <FaChevronRight />
                </button>
            </div>

            <div className="carousel-dots">
                {images.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`carousel-dot ${index === current ? "active" : ""}`}
                        onClick={(e) => goTo(e, index)}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

function ProjectCard({ project }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [savedTime, setSavedTime] = useState(0);

    const smallVideoRef = useRef(null);
    const largeVideoRef = useRef(null);

    const openModal = () => {
        const smallVideo = smallVideoRef.current;
        if (smallVideo) {
            setSavedTime(smallVideo.currentTime);
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        const largeVideo = largeVideoRef.current;
        const smallVideo = smallVideoRef.current;

        if (largeVideo && smallVideo) {
            smallVideo.currentTime = largeVideo.currentTime;
            smallVideo.pause();
        }
        setModalOpen(false);
    };

    useEffect(() => {
        if (modalOpen && largeVideoRef.current && project.video) {
            largeVideoRef.current.currentTime = savedTime;
        }
    }, [modalOpen, savedTime, project.video]);

    useEffect(() => {
        if (!modalOpen) return;

        const scrollY = window.scrollY;
        const { body, documentElement } = document;

        body.classList.add("modal-open");
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.overflow = "hidden";
        documentElement.style.overflow = "hidden";

        return () => {
            body.classList.remove("modal-open");
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.overflow = "";
            documentElement.style.overflow = "";

            const restore = () => {
                window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
            };
            restore();
            requestAnimationFrame(restore);
        };
    }, [modalOpen]);

    return (
        <>
            <div className="project-card" onClick={openModal}>
                <h3>{project.title}</h3>

                {project.video ? (
                    <div className="video-wrapper">
                        <video
                            ref={smallVideoRef}
                            src={project.video}
                            controls={false}
                            muted
                            preload="metadata"
                            className="project-media"
                        />
                        <div className="video-overlay">
                            <FaPlay size={40} color="white" className="play-icon" />
                        </div>
                    </div>
                ) : project.images.length > 0 ? (
                    <img src={project.images[0]} alt={project.title} className="project-media" />
                ) : (
                    <div className="placeholder">View Project</div>
                )}
            </div>

            {modalOpen && createPortal(
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal} aria-label="Close">✕</button>

                        <h2>{project.title}</h2>
                        <p>{project.description}</p>

                        {project.video ? (
                            <video
                                ref={largeVideoRef}
                                src={project.video}
                                controls
                                className="modal-video"
                            />
                        ) : project.images.length > 0 ? (
                            <ImageCarousel images={project.images} alt={project.title} />
                        ) : null}

                        <div style={{ marginTop: "25px", textAlign: "center" }}>
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                                <FaGithub /> View Code on GitHub
                            </a>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default ProjectCard;
