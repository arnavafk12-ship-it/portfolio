import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Lenis from "lenis";
import emailjs from "@emailjs/browser";
import "@fontsource/poppins";
import "@fontsource/poppins/700.css";
import "@fontsource/syne/800.css";
import './App.css';

gsap.registerPlugin(TextPlugin);

const App = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const nameRef = useRef(null);
  const formRef = useRef(null);

  // Gate Preloader Refs
  const loaderOverlayRef = useRef(null);
  const topGateRef = useRef(null);
  const bottomGateRef = useRef(null);
  const counterRef = useRef(null);

  const [formData, setFormData] = useState({
    from_name: "",
    reply_to: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const initialProjects = [
    { id: 1, title: "E-Commerce App", desc: "Built with React and Redux Toolkit.", tech: ["React", "Redux", "Tailwind"] },
    { id: 2, title: "3D Portfolio Website", desc: "Interactive presentation layout.", tech: ["GSAP", "Framer Motion", "Lenis"] },
    { id: 3, title: "Dashboard Interface", desc: "Data intensive admin panel layout.", tech: ["MUI", "React", "Charts"] },
    { id: 4, title: "SaaS Landing Page", desc: "High-performance smooth scrolling landing asset.", tech: ["HTML5", "CSS3", "Lenis"] },
    { id: 5, title: "Task Manager Pro", desc: "State persistent workflow utility.", tech: ["JavaScript", "Bootstrap", "Git"] },
    { id: 6, title: "Weather Forecast Engine", desc: "Dynamic API consumption UI.", tech: ["React", "Tailwind", "React Icons"] },
    { id: 7, title: "Creative Agency Showcase", desc: "Immersive layout packed with micro-interactions.", tech: ["GSAP", "Framer Motion", "CSS3"] }
  ];

  const layoutPatterns = [
    [
      { gridColumn: "span 2", gridRow: "span 2" },
      { gridColumn: "span 2", gridRow: "span 1" },
      { gridColumn: "span 1", gridRow: "span 1" },
      { gridColumn: "span 1", gridRow: "span 1" },
      { gridColumn: "span 2", gridRow: "span 1" },
      { gridColumn: "span 1", gridRow: "span 1" },
      { gridColumn: "span 1", gridRow: "span 1" }
    ],
    [
      { gridColumn: "span 1", gridRow: "span 1" },
      { gridColumn: "span 2", gridRow: "span 2" },
      { gridColumn: "span 1", gridRow: "span 1" },
      { gridColumn: "span 1", gridRow: "span 1" },
      { gridColumn: "span 1", gridRow: "span 1" },
      { gridColumn: "span 2", gridRow: "span 1" },
      { gridColumn: "span 1", gridRow: "span 1" }
    ]
  ];

  const [randomizedProjects] = useState(() => {
    const randomPattern = layoutPatterns[Math.floor(Math.random() * layoutPatterns.length)];
    return [...initialProjects]
      .sort(() => Math.random() - 0.5)
      .map((project, index) => ({
        ...project,
        gridStyles: randomPattern[index] || { gridColumn: "span 1", gridRow: "span 1" }
      }));
  });

  useEffect(() => {
    emailjs.init("TSgq3gV5d8kvX_LE3");

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- GATE PRELOADER & TIMELINE ANIMATION ---
    const counterValue = { val: 0 };
    const masterTimeline = gsap.timeline();

    // 1. Animate counter text from 0 to 100
    masterTimeline.to(counterValue, {
      val: 100,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = `${Math.floor(counterValue.val)}%`;
        }
      }
    });

    // 2. Fade out the counter text once it finishes hitting 100%
    masterTimeline.to(counterRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in"
    });

    // 3. Open the gates! Top goes up (-100%), Bottom goes down (100%)
    masterTimeline.to(topGateRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut"
    }, "+=0.1");

    masterTimeline.to(bottomGateRef.current, {
      yPercent: 100,
      duration: 1.2,
      ease: "power4.inOut"
    }, "<"); // "<" syncs this animation with the top gate step exactly

    // 4. Fully hide the parent wrapper container when finished to permit clicks
    masterTimeline.set(loaderOverlayRef.current, { display: "none" });

    // 5. Chain the existing entrance portfolio animations right after gates clear
    masterTimeline.fromTo(headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
    );

    masterTimeline.to(nameRef.current, {
      duration: 1.2,
      text: "Arnav Singh",
      ease: "none"
    });

    masterTimeline.fromTo(".header-info-sub",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );

    masterTimeline.fromTo(aboutRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.2"
    );

    masterTimeline.fromTo(".skill-card",
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "back.out(1.6)" },
      "-=0.4"
    );

    masterTimeline.fromTo(projectsRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    masterTimeline.fromTo(".project-card",
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
      "-=0.4"
    );

    masterTimeline.fromTo(contactRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.3"
    );

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    const SERVICE_ID = "service_o2yz2za";
    const TEMPLATE_ID = "template_w6hi2jd";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current)
      .then(() => {
        setSubmitStatus("success");
        setFormData({ from_name: "", reply_to: "", message: "" });
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        setSubmitStatus("error");
        setIsSubmitting(false);
      });
  };

  return (
    <>
      {/* GATE PRELOADER OVERLAY */}
      <div ref={loaderOverlayRef} className="gate-loader-overlay">
        <div ref={topGateRef} className="gate gate-top"></div>
        <div ref={counterRef} className="gate-counter-text">0%</div>
        <div ref={bottomGateRef} className="gate gate-bottom"></div>
      </div>

      {/* PORTFOLIO CONTENT */}
      <center>
        <div ref={containerRef} className="portfolio-container">

          {/* HEADER */}
          <header ref={headerRef} className="header-container" style={{ opacity: 0 }}>
            <div className="top">
              <div className="profile-img"></div>
            </div>

            <div className="down">
              <div className="left">
                <h2 ref={nameRef}> </h2>
                <h3 className="header-info-sub" style={{ opacity: 0 }}>Frontend Developer</h3>
                <h5 className="header-info-sub" style={{ opacity: 0 }}>Based in Khandwa, M.P</h5>
              </div>
              <div className="right">
                <div className="social-group header-info-sub" style={{ opacity: 0 }}>
                  <button className="social-link" aria-label="Social Link 1"></button>
                  <button className="social-link" aria-label="Social Link 2"></button>
                  <button className="social-link" aria-label="Social Link 3"></button>
                </div>
                <button
                  className="email header-info-sub"
                  style={{ opacity: 0 }}
                  onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get in touch
                </button>
              </div>
            </div>
          </header>

          {/* ABOUT */}
          <section ref={aboutRef} className="about" style={{ opacity: 0 }}>
            <h3>About Me</h3>
            <p className="about-text large-text">
              I am a <span className="highlight-gradient">13-year-old frontend developer</span> passionate about building <span className="highlight-text">pixel-perfect, interactive web applications</span>. I specialize in turning complex logic into clean user interfaces using modern libraries and <span className="highlight-text">React</span>.
            </p>

            <div className="skills-container">
              <h4>My Tech Stack</h4>
              <div className="skills-grid">
                <div className="skill-card"><span className="skill-tag html-css"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm17.3 5.6H5.2l.4 4.6h11.4l-.4 4.6-4.6 1.5-4.6-1.5-.3-3H5l.5 6.1 6.5 2.2 6.5-2.2.8-9.2H5.7l-.4-4.6h13.5l.2-2.2z" /></svg>HTML5 & CSS3</span></div>
                <div className="skill-card"><span className="skill-tag javascript"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm21.6 19.1c0-1.6-.9-2.7-2.9-3.5-1.3-.5-1.9-.9-1.9-1.6 0-.6.5-1 1.3-1 .9 0 1.5.4 1.8 1l2.1-1.3c-.6-1.2-1.9-2-3.8-2-2.3 0-3.9 1.4-3.9 3.5 0 2.2 1.4 3.1 3.5 3.9 1.4.5 1.9 1 1.9 1.7 0 .8-.7 1.3-1.7 1.3-1.3 0-2.1-.7-2.6-1.7l-2.2 1.3c.7 1.5 2.2 2.6 4.7 2.6 2.6.1 4.7-1.3 4.7-3.9zM10.5 14v-4H8.1v4c0 1.2-.6 1.8-1.6 1.8-.9 0-1.4-.5-1.4-1.4v-4.4H2.7v4.7c0 2.3 1.4 3.7 3.8 3.7 2.5 0 4-1.3 4-3.7-.1-.3-.1-.5-.1-.7z" /></svg>JavaScript (ES6+)</span></div>
                <div className="skill-card"><span className="skill-tag react"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.7a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zm0-10.7C5.4 0 0 2.4 0 5.3s5.4 5.3 12 5.3 12-2.4 12-5.3S18.6 0 12 0zm0 8.9c-4.9 0-8.9-1.6-8.9-3.6S7.1 1.7 12 1.7s8.9 1.6 8.9 3.6-4 3.6-8.9 3.6zm0 2.6c-6.6 0-12 2.4-12 5.3s5.4 5.3 12 5.3 12-2.4 12-5.3-5.4-5.3-12-5.3zm0 8.9c-4.9 0-8.9-1.6-8.9-3.6s4-3.6 8.9-3.6 8.9 1.6 8.9 3.6-4 3.6-8.9 3.6zm-5.3-3.6c-3.3 5.7-1.4 8.9 2 8.9s6.6-4 8-9.8c-1.4 5.8-4.6 9.8-8 9.8s-5.3-3.2-2-8.9z" /></svg>React.js</span></div>
                <div className="skill-card"><span className="skill-tag redux"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 3.8l7.5 4.3v7.8L12 20.2l-7.5-4.3V8.1L12 3.8zm0 3.4c-2.3 0-4.1 1.8-4.1 4.1s1.8 4.1 4.1 4.1 4.1-1.8 4.1-4.1-1.8-4.1-4.1-4.1z" /></svg>Redux Toolkit</span></div>
                <div className="skill-card"><span className="skill-tag framer"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 0h16v8h-8zM4 8h8l8 8H4zm0 8h8v8z" /></svg>Framer Motion</span></div>
                <div className="skill-card"><span className="skill-tag gsap"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" /></svg>GSAP</span></div>
                <div className="skill-card"><span className="skill-tag lenis"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>Lenis Scroll</span></div>
                <div className="skill-card"><span className="skill-tag tailwind"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6.5c-2.4 0-4 1.2-4.7 3.7 1-.7 2.2-.9 3.4-.5 1 .3 1.8 1.1 2.6 2 1.4 1.4 3.1 3.1 6.7 3.1 2.4 0 4-1.2 4.7-3.7-1 .7-2.2.9-3.4.5-.9-.3-1.7-1.1-2.5-2-.9-.9-2.6-3.1-6.8-3.1zM5.3 12c-2.4 0-4 1.2-4.7 3.7 1-.7 2.2-.9 3.4-.5 1 .3 1.8 1.1 2.6 2 1.4 1.4 3.1 3.1 6.7 3.1 2.4 0 4-1.2 4.7-3.7-1 .7-2.2.9-3.4.5-.9-.3-1.7-1.1-2.5-2-.9-.9-2.6-3.1-6.8-3.1Z" /></svg>Tailwind CSS</span></div>
                <div className="skill-card"><span className="skill-tag mui"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 2.4v19.2h24V2.4H0zm18.3 15.3H15v-4.6l-3 3-3-3v4.6H6.3V6.3H9l3 3.1 3-3.1h2.7v11.4z" /></svg>Material UI (MUI)</span></div>
                <div className="skill-card"><span className="skill-tag bootstrap"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 6.7h2.8c1 0 1.8.2 2.3.7.4.4.7 1 .7 1.7 0 .8-.3 1.4-.9 1.8-.4.2-.8.3-1.4.3h-3.5V6.7zm0 6.6h3.2c1 0 1.8.3 2.3.8.5.5.7 1.1.7 2 0 .8-.3 1.5-.8 1.9-.5.4-1.3.6-2.3.6h-3.1v-5.3zM2.4 0h19.2C22.9 0 24 1.1 24 2.4v19.2c0 1.3-1.1 2.4-2.4 2.4H2.4C1.1 24 0 22.9 0 21.6V2.4C0 1.1 1.1 0 2.4 0zM7 5v14h7.8c2.1 0 3.7-.5 4.6-1.6.8-.9 1.2-2.1 1.2-3.6 0-1.6-.6-2.8-1.7-3.6 1-.7 1.5-1.8 1.5-3.3 0-1.4-.4-2.5-1.3-3.3-1-.9-2.6-1.4-4.8-1.4H7z" /></svg>Bootstrap</span></div>
                <div className="skill-card"><span className="skill-tag icons"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L1.5 4.5v6c0 6.5 4.5 12.6 10.5 13.5 6-1 10.5-7.1 10.5-13.5v-6L12 0zm0 16.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" /></svg>React Icons</span></div>
                <div className="skill-card"><span className="skill-tag git"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.3 11.1L12.9.7c-.9-.9-2.4-.9-3.4 0L6.7 3.5l3.1 3.1c.8-.3 1.8-.1 2.5.6.7.7.9 1.7.6 2.5l3.1 3.1c.8-.3 1.8-.1 2.5.6.9.9.9 2.4 0 3.4-.9.9-2.4.9-3.4 0-.7-.7-.9-1.7-.6-2.5l-3-3c-.3.3-.7.4-1.1.4-.4 0-.8-.1-1.1-.4-.7-.7-.9-1.7-.6-2.5L6.6 8.7c-.8.3-1.8.1-2.5-.6-.9-.9-.9-2.4 0-3.4.9-.9 2.4-.9 3.4 0l2.8 2.8c.3-.3.7-.4 1.1-.4.4 0 .8.1 1.1.4.6.6.8 1.5.6 2.3l3 3c.3-.2.7-.3 1.1-.3.4 0 .8.1 1.1.4.9.8.9 2.3 0 3.2z" /></svg>Git & GitHub</span></div>
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section ref={projectsRef} className="projects-section" style={{ opacity: 0 }}>
            <h3>Featured Projects</h3>
            <div className="projects-grid">
              {randomizedProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  style={project.gridStyles}
                >
                  <div className="project-content">
                    <h4>{project.title}</h4>
                    <p>{project.desc}</p>
                    <div className="project-tech-tags">
                      {project.tech.map((t, idx) => (
                        <span key={idx}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT FORM */}
          <section ref={contactRef} className="contact-section" style={{ opacity: 0 }}>
            <div className="contact-card">
              <div className="contact-left">
                <h3>Let's build something awesome together</h3>
                <p>Whether you have a question, want to start a project, or simply want to connect, feel free to reach out.</p>
                <a href="mailto:arnavafk12@gmail.com" className="contact-email-btn">arnavafk12@gmail.com</a>
              </div>
              <div className="contact-right">
                <form ref={formRef} onSubmit={handleFormSubmit} className="contact-form">
                  <div className="form-group">
                    <input
                      type="text"
                      name="from_name"
                      placeholder="Your Name"
                      value={formData.from_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="reply_to"
                      placeholder="Your Email"
                      value={formData.reply_to}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>

                  {submitStatus === "success" && (
                    <p className="status-msg success" style={{ color: 'green', marginTop: '10px' }}>Message sent successfully!</p>
                  )}
                  {submitStatus === "error" && (
                    <p className="status-msg error" style={{ color: 'red', marginTop: '10px' }}>Something went wrong. Please check your template parameters.</p>
                  )}
                </form>
              </div>
            </div>
          </section>

        </div>
      </center>
    </>
  );
};

export default App;