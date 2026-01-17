import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Briefcase, Mail, Code, Sparkles, Github, Linkedin, Menu, X, ChevronDown, RefreshCw } from 'lucide-react';
import { portfolioData, getSectionVisibility } from './config';
import { processAIQuery } from './utils/aiLogic';
import { handleContactSubmit } from './utils/contactHandler';
import { fetchLeetCodeStats, clearLeetCodeCache, getLeetCodeCacheTimestamp } from './utils/leetcodeApi';
import { fetchCodeChefStats, clearCodeChefCache, getCodeChefCacheTimestamp } from './utils/codechefApi';

const PortfolioSite = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });
    const [sectionVisibility] = useState(getSectionVisibility());
    const [codingPlatforms, setCodingPlatforms] = useState(portfolioData.codingPlatforms);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackData, setFeedbackData] = useState({ name: '', email: '', suggestion: '' });
    const [feedbackStatus, setFeedbackStatus] = useState({ type: '', message: '' });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContactFormSubmit = (e) => {
        e.preventDefault();
        handleContactSubmit(formData, setFormStatus, () => setFormData({ name: '', email: '', message: '' }));
    };
    const [showAIPopup, setShowAIPopup] = useState(false);
    const [suggestedSection, setSuggestedSection] = useState(null);
    const [showResumePreview, setShowResumePreview] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Backend settings - not visible to users
    // Backend settings - not visible to users

    const canvasRef = useRef(null);
    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const resumeRef = useRef(null);
    const projectsRef = useRef(null);
    const certificatesRef = useRef(null);
    const codingRef = useRef(null);
    const contactRef = useRef(null);



    // 3D Background Effect
    useEffect(() => {
        if (!sectionVisibility.background3D) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 100;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 1000;
                this.baseX = this.x;
                this.baseY = this.y;
            }

            update(mouseX, mouseY) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const force = Math.min(100 / (dist + 1), 5);

                this.x += (this.baseX - this.x) * 0.05 + dx * force * 0.01;
                this.y += (this.baseY - this.y) * 0.05 + dy * force * 0.01;

                this.z -= 2;
                if (this.z < 1) this.z = 1000;
            }

            draw() {
                const scale = 1000 / (this.z + 1000);
                const x = (this.x - canvas.width / 2) * scale + canvas.width / 2;
                const y = (this.y - canvas.height / 2) * scale + canvas.height / 2;
                const size = Math.max(0, scale * 3);

                ctx.fillStyle = `rgba(99, 102, 241, ${scale * 0.8})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();

                if (particles.indexOf(this) < particles.length - 1) {
                    const next = particles[particles.indexOf(this) + 1];
                    const nextScale = 1000 / (next.z + 1000);
                    const nextX = (next.x - canvas.width / 2) * nextScale + canvas.width / 2;
                    const nextY = (next.y - canvas.height / 2) * nextScale + canvas.height / 2;

                    ctx.strokeStyle = `rgba(139, 92, 246, ${scale * 0.2})`;
                    ctx.lineWidth = scale;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(nextX, nextY);
                    ctx.stroke();
                }
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update(mousePos.x, mousePos.y);
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mousePos, sectionVisibility.background3D]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Track scroll position for transparency effects
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch coding platform stats on mount
    useEffect(() => {
        if (portfolioData.dynamicCodingStats && sectionVisibility.coding) {
            fetchCodingStats();
        }
    }, [sectionVisibility.coding]);

    const fetchCodingStats = async () => {
        setIsLoadingStats(true);
        const updatedPlatforms = [...portfolioData.codingPlatforms];

        for (let i = 0; i < updatedPlatforms.length; i++) {
            const platform = updatedPlatforms[i];

            if (platform.name === "LeetCode") {
                const stats = await fetchLeetCodeStats(platform.username);
                if (stats) {
                    updatedPlatforms[i] = { ...platform, stats };
                }
            } else if (platform.name === "CodeChef") {
                const stats = await fetchCodeChefStats(platform.username);
                if (stats) {
                    updatedPlatforms[i] = { ...platform, stats };
                }
            }
        }

        setCodingPlatforms(updatedPlatforms);
        setIsLoadingStats(false);
        setLastUpdated(Date.now());
    };

    const handleRefreshStats = async () => {
        // Clear caches
        portfolioData.codingPlatforms.forEach(platform => {
            if (platform.name === "LeetCode") {
                clearLeetCodeCache(platform.username);
            } else if (platform.name === "CodeChef") {
                clearCodeChefCache(platform.username);
            }
        });

        // Fetch fresh data
        await fetchCodingStats();
    };

    const getTimeSinceUpdate = () => {
        if (!lastUpdated) return 'Never';
        const minutes = Math.floor((Date.now() - lastUpdated) / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes === 1) return '1 minute ago';
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours === 1) return '1 hour ago';
        return `${hours} hours ago`;
    };

    const scrollToSection = (ref) => {
        if (ref.current) {
            const y = ref.current.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for fixed navbar
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Agentic AI Search Handler (Local Simulation)
    const handleAgenticSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsProcessing(true);
        setAiResponse('');
        setSuggestedSection(null);

        // Simulate network delay for "AI thinking" effect
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const result = processAIQuery(searchQuery, portfolioData);

            setAiResponse(result.response);

            if (result.action === "navigate" && result.section) {
                setTimeout(() => {
                    const refs = { home: homeRef, about: aboutRef, resume: resumeRef, projects: projectsRef, certificates: certificatesRef, coding: codingRef, contact: contactRef };
                    setShowAIPopup(false);
                    setTimeout(() => scrollToSection(refs[result.section]), 300);
                }, 1500);
            } else if (result.action === "suggest" && result.section) {
                setSuggestedSection(result.section);
            }
        } catch (error) {
            console.error(error);
            setAiResponse("I encountered an error. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuggestedNavigation = () => {
        if (!suggestedSection) return;
        const refs = { home: homeRef, about: aboutRef, resume: resumeRef, projects: projectsRef, certificates: certificatesRef, coding: codingRef, contact: contactRef };
        setShowAIPopup(false);
        setTimeout(() => scrollToSection(refs[suggestedSection]), 300);
    };

    return (
        <div className="relative min-h-screen bg-slate-900 overflow-hidden">
            {sectionVisibility.background3D && (
                <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
            )}

            <div className="relative z-10">
                {/* Fixed Navigation - Pill Shaped */}
                <nav
                    className="fixed top-0 left-0 right-0 backdrop-blur-lg border-b border-white/10 z-50 transition-all duration-300"
                    style={{
                        backgroundColor: `rgba(15, 23, 42, ${Math.min(0.8, 0.3 + scrollY / 500)})`
                    }}
                >
                    <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 md:px-6 py-4">
                        <div className="flex justify-between items-center">
                            {/* Logo or Name for mobile */}
                            <div className="md:hidden flex items-center gap-2">
                                <Sparkles className="text-indigo-400" size={24} />
                                <span className="text-white font-bold">Portfolio</span>
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex justify-center flex-1">
                                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-full px-3 py-2 border border-white/10">
                                    {[
                                        { name: 'Home', ref: homeRef, key: 'home' },
                                        { name: 'About', ref: aboutRef, key: 'about' },
                                        { name: 'Resume', ref: resumeRef, key: 'resume' },
                                        { name: 'Projects', ref: projectsRef, key: 'projects' },
                                        { name: 'Certificates', ref: certificatesRef, key: 'certificates' },
                                        { name: 'Coding', ref: codingRef, key: 'coding' },
                                        { name: 'Contact', ref: contactRef, key: 'contact' }
                                    ].filter(item => sectionVisibility[item.key]).map(({ name, ref }) => (
                                        <button
                                            key={name}
                                            onClick={() => scrollToSection(ref)}
                                            className="px-6 py-2 rounded-full text-gray-300 hover:bg-indigo-500/20 hover:text-white transition-all whitespace-nowrap"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                            >
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>

                        {/* Mobile Menu Items */}
                        {isMenuOpen && (
                            <div className="md:hidden mt-4 bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl animate-fade-in-down">
                                <div className="flex flex-col gap-2">
                                    {[
                                        { name: 'Home', ref: homeRef, key: 'home' },
                                        { name: 'About', ref: aboutRef, key: 'about' },
                                        { name: 'Resume', ref: resumeRef, key: 'resume' },
                                        { name: 'Projects', ref: projectsRef, key: 'projects' },
                                        { name: 'Certificates', ref: certificatesRef, key: 'certificates' },
                                        { name: 'Coding', ref: codingRef, key: 'coding' },
                                        { name: 'Contact', ref: contactRef, key: 'contact' }
                                    ].filter(item => sectionVisibility[item.key]).map(({ name, ref }) => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                scrollToSection(ref);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full px-6 py-3 rounded-xl text-left text-gray-300 hover:bg-indigo-500/20 hover:text-white transition-all flex items-center justify-between"
                                        >
                                            {name}
                                            <ChevronDown size={16} className="-rotate-90 opacity-50" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Spacer for fixed navbar */}
                <div className="h-20"></div>

                <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">

                    {/* Home Section */}
                    {sectionVisibility.home && (
                        <section ref={homeRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-12 border border-white/10 min-h-[80vh] flex flex-col justify-center">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                                        {portfolioData.name}
                                    </h1>
                                    <p className="text-xl md:text-3xl text-gray-300">{portfolioData.title}</p>
                                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
                                        Passionate about building innovative solutions at the intersection of AI and web development.
                                        Transforming ideas into elegant, scalable applications.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <a
                                            href={portfolioData.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Github size={20} />
                                            GitHub
                                        </a>
                                        <a
                                            href={portfolioData.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Linkedin size={20} />
                                            LinkedIn
                                        </a>
                                    </div>
                                </div>

                                {/* Dynamic Image Column */}
                                <div className="hidden lg:flex items-center justify-center">
                                    <div className="relative group w-full max-w-[350px]">
                                        {/* Border Trace Light */}
                                        <div className="absolute -inset-[2px] rounded-3xl overflow-hidden pointer-events-none">
                                            <div className="absolute inset-[-150%] animate-rotate-slow bg-conic-glow opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                        </div>

                                        {/* Hover intensified glow */}
                                        <div className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-r ${portfolioData.ui.colors.glow} opacity-0 group-hover:opacity-60 blur-sm transition-opacity duration-500`}></div>
                                        <div className={`absolute -inset-4 bg-${portfolioData.ui.colors.primary}/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                        <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                            <div className="w-full aspect-square bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center relative">
                                                <img
                                                    src={portfolioData.ui.homeGif}
                                                    alt="Animated Coding Workflow"
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-slate-900/40 to-transparent">
                                                    <div className="p-4 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                        <Sparkles className="text-indigo-400 mx-auto mb-2" size={32} />
                                                        <p className="text-white text-sm font-medium">Developing the Future</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* About Section */}
                    {sectionVisibility.about && (
                        <section ref={aboutRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-12 border border-white/10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 flex items-center gap-3">
                                <User className="text-indigo-400" size={32} md:size={40} />
                                About Me
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-2xl font-semibold text-white mb-4">Skills & Technologies</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {portfolioData.skills.map((skill, i) => (
                                            <span key={i} className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/30 transition-all">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold text-white mb-4">Experience</h3>
                                    <div className="space-y-4">
                                        {portfolioData.experience.map((exp, i) => (
                                            <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                                <p className="text-lg font-semibold text-indigo-300">{exp.role}</p>
                                                <p className="text-gray-400">{exp.company} • {exp.duration}</p>
                                                <p className="text-gray-500 text-sm mt-2">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Resume Section */}
                    {sectionVisibility.resume && (
                        <section ref={resumeRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-12 border border-white/10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 flex items-center gap-3">
                                <Briefcase className="text-cyan-400" size={32} md:size={40} />
                                Resume
                            </h2>

                            <div className="space-y-8">
                                {/* Summary */}
                                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30">
                                    <h3 className="text-2xl font-semibold text-white mb-4">Professional Summary</h3>
                                    <p className="text-gray-300 leading-relaxed">{portfolioData.resume.summary}</p>
                                </div>

                                {/* Education */}
                                <div>
                                    <h3 className="text-2xl font-semibold text-white mb-4">Education</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {portfolioData.resume.education.map((edu, i) => (
                                            <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all">
                                                <h4 className="text-xl font-semibold text-cyan-300 mb-2">{edu.degree}</h4>
                                                <p className="text-gray-300 mb-1">{edu.university}</p>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-400">{edu.year}</span>
                                                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded">GPA: {edu.gpa}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Download Resume Button */}
                                <div className="flex justify-center">
                                    <div className="relative inline-flex flex-col sm:flex-row bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all w-full sm:w-auto">
                                        <button
                                            onClick={() => setShowResumePreview(true)}
                                            className="px-6 py-4 md:px-8 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3 text-base md:text-lg font-semibold"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Resume
                                        </button>

                                        <div className="hidden sm:block w-px bg-white/30"></div>
                                        <div className="block sm:hidden h-px bg-white/30"></div>

                                        <button
                                            onClick={() => window.open(portfolioData.resume.downloadLink, '_blank')}
                                            className="px-6 py-4 md:px-8 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3 text-base md:text-lg font-semibold"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Projects Section */}
                    {sectionVisibility.projects && (
                        <section ref={projectsRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-12 border border-white/10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 flex items-center gap-3">
                                <Code className="text-purple-400" size={32} md:size={40} />
                                Projects
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {portfolioData.projects.map((project, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setShowProjectModal(true);
                                        }}
                                        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30 hover:border-indigo-500/60 transition-all hover:scale-105 cursor-pointer"
                                    >
                                        <h3 className="text-2xl font-semibold text-white mb-3">{project.name}</h3>
                                        <p className="text-gray-400 mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.split(', ').map((tech, j) => (
                                                <span key={j} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-4 text-sm text-indigo-400 flex items-center gap-2">
                                            <span>Click for more details</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certificates Section */}
                    {sectionVisibility.certificates && (
                        <section ref={certificatesRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-12 border border-white/10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 flex items-center gap-3">
                                <Briefcase className="text-green-400" size={32} md:size={40} />
                                Certificates & Achievements
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {portfolioData.certificates.map((cert, i) => (
                                    <div key={i} className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 hover:border-green-500/60 transition-all hover:scale-105">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-2xl font-semibold text-white">
                                                {cert.link ? (
                                                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="hover:text-green-300 flex items-center gap-2 transition-colors">
                                                        {cert.name}
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    </a>
                                                ) : (
                                                    cert.name
                                                )}
                                            </h3>
                                            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                                                {cert.date}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 mb-2">{cert.issuer}</p>
                                        <p className="text-gray-500 text-sm">ID: {cert.credentialId}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Coding Platforms Section */}
                    {sectionVisibility.coding && (
                        <section ref={codingRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-12 border border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <h2 className="text-3xl md:text-5xl font-bold text-white flex items-center gap-3">
                                    <Code className="text-yellow-400" size={32} md:size={40} />
                                    Coding Platforms
                                </h2>
                                <div className="flex items-center gap-4">
                                    {lastUpdated && (
                                        <span className="text-sm text-gray-400">
                                            Last updated: {getTimeSinceUpdate()}
                                        </span>
                                    )}
                                    <button
                                        onClick={handleRefreshStats}
                                        disabled={isLoadingStats}
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-300 rounded-lg transition-all text-sm"
                                        title="Refresh Stats"
                                    >
                                        <RefreshCw size={16} className={isLoadingStats ? 'animate-spin' : ''} />
                                        Refresh
                                    </button>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {codingPlatforms.map((platform, i) => {
                                    // Generate profile URLs
                                    const profileUrls = {
                                        "LeetCode": `https://leetcode.com/${platform.username}`,
                                        "CodeChef": `https://www.codechef.com/users/${platform.username}`,
                                        "Codeforces": `https://codeforces.com/profile/${platform.username}`
                                    };

                                    return (
                                        <a
                                            key={i}
                                            href={profileUrls[platform.name] || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/60 transition-all hover:scale-105 relative cursor-pointer">
                                                {isLoadingStats && (
                                                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                                                        <RefreshCw className="text-yellow-400 animate-spin" size={32} />
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-2xl font-semibold text-white">{platform.name}</h3>
                                                    {platform.stats.stars && (
                                                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm font-bold">
                                                            {platform.stats.stars}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 mb-4">@{platform.username}</p>
                                                <div className="space-y-2">
                                                    {platform.name === "LeetCode" && (
                                                        <>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Total Solved:</span>
                                                                <span className="text-green-400 font-semibold">{platform.stats.solved}</span>
                                                            </div>
                                                            <div className="flex gap-2 text-xs">
                                                                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">Easy: {platform.stats.easy}</span>
                                                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">Medium: {platform.stats.medium}</span>
                                                                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">Hard: {platform.stats.hard}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-400">Ranking: {platform.stats.ranking}</div>
                                                        </>
                                                    )}
                                                    {platform.name === "CodeChef" && (
                                                        <>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Rating:</span>
                                                                <span className="text-yellow-400 font-semibold">{platform.stats.rating}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Global Rank:</span>
                                                                <span className="text-purple-400 font-semibold">#{platform.stats.globalRank}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Country Rank:</span>
                                                                <span className="text-blue-400 font-semibold">#{platform.stats.countryRank}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {platform.name === "Codeforces" && (
                                                        <>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Rating:</span>
                                                                <span className="text-purple-400 font-semibold">{platform.stats.rating}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-400">Rank: {platform.stats.rank}</div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Max Rating:</span>
                                                                <span className="text-indigo-400 font-semibold">{platform.stats.maxRating}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-400">Contests: {platform.stats.contests}</div>
                                                        </>
                                                    )}
                                                </div>
                                                {platform.badges.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-white/10">
                                                        <div className="flex flex-wrap gap-2">
                                                            {platform.badges.map((badge, j) => (
                                                                <span key={j} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                                                                    🏆 {badge}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Contact Section */}
                    {sectionVisibility.contact && (
                        <section ref={contactRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-12 border border-white/10 mb-8">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 flex items-center gap-3">
                                <Mail className="text-pink-400" size={32} md:size={40} />
                                Get In Touch
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-xl text-gray-300 mb-6">
                                        I'm always open to new opportunities and collaborations.
                                        Feel free to reach out!
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex flex-col gap-3 text-gray-300">
                                            <div className="flex items-center gap-3">
                                                <Mail className="text-indigo-400" size={20} />
                                                <span>{portfolioData.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 ml-8 text-sm opacity-80">
                                                <Mail className="text-indigo-400/50" size={16} />
                                                <span>{portfolioData.secondaryEmail}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <span className="text-indigo-400">📱</span>
                                            <span>{portfolioData.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <span className="text-indigo-400">📍</span>
                                            <span>{portfolioData.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/30">
                                    <h3 className="text-xl font-semibold text-white mb-4">Quick Message</h3>
                                    <form onSubmit={handleContactFormSubmit} className="space-y-3">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            required
                                            placeholder="Your Name"
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            required
                                            placeholder="Your Email"
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                        />
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleFormChange}
                                            required
                                            placeholder="Your Message"
                                            rows="4"
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                        />

                                        {formStatus.message && (
                                            <div className={`text-sm p-3 rounded-lg ${formStatus.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                                formStatus.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {formStatus.message}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={formStatus.type === 'loading'}
                                            className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                                        >
                                            {formStatus.type === 'loading' ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Floating Action Buttons */}
                <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
                    {/* Back to Top Button - Only visible when scrolled */}
                    {scrollY > 300 && (
                        <button
                            onClick={scrollToTop}
                            className="w-16 h-16 bg-slate-700/40 hover:bg-slate-600/60 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                            title="Back to Top"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    )}

                    {/* AI Assistant Button */}
                    <button
                        onClick={() => setShowAIPopup(true)}
                        className="w-16 h-16 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 hover:from-indigo-500/60 hover:to-purple-500/60 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                        title="AI Assistant"
                    >
                        <Sparkles size={28} />
                    </button>
                </div>

                {/* AI Search Popup */}
                {
                    showAIPopup && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl border border-indigo-500/30 max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="text-indigo-400" size={28} />
                                            <h3 className="text-2xl font-semibold text-white">AI Assistant</h3>
                                        </div>
                                        <button
                                            onClick={() => setShowAIPopup(false)}
                                            className="text-gray-400 hover:text-white transition-all"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAgenticSearch()}
                                            placeholder="Ask me anything... (e.g., 'show me projects', 'what are your skills?', 'go to contact')"
                                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAgenticSearch}
                                            disabled={isProcessing}
                                            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <Search size={20} />
                                            {isProcessing ? 'Thinking...' : 'Ask'}
                                        </button>
                                    </div>

                                    {aiResponse && (
                                        <div className="p-4 bg-white/5 rounded-lg border border-white/10 max-h-96 overflow-y-auto">
                                            <p className="text-gray-300 leading-relaxed">{aiResponse}</p>
                                            {suggestedSection && (
                                                <button
                                                    onClick={handleSuggestedNavigation}
                                                    className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                                                >
                                                    View {suggestedSection.charAt(0).toUpperCase() + suggestedSection.slice(1)} Section
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {!aiResponse && !isProcessing && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400 mb-4">Try asking me:</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {[
                                                    "Show me your resume",
                                                    "What are my certificates?",
                                                    "Show me coding profiles",
                                                    "Tell me about your experience"
                                                ].map((suggestion, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSearchQuery(suggestion)}
                                                        className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-sm transition-all"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Resume Preview Modal */}
                {
                    showResumePreview && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl border border-cyan-500/30 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 border-b border-white/10 flex items-center justify-between">
                                    <h3 className="text-2xl font-semibold text-white">Resume Preview</h3>
                                    <button
                                        onClick={() => setShowResumePreview(false)}
                                        className="text-gray-400 hover:text-white transition-all"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-4 md:p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                                    {/* Resume Content */}
                                    <div className="bg-white text-gray-900 p-6 md:p-12 rounded-lg">
                                        {/* Header */}
                                        <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                                            <h1 className="text-2xl md:text-4xl font-bold mb-2">{portfolioData.name}</h1>
                                            <p className="text-lg md:text-xl text-gray-600 mb-3">{portfolioData.title}</p>
                                            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-sm text-gray-600">
                                                <span>{portfolioData.email}</span>
                                                <span className="hidden md:inline">•</span>
                                                <span>{portfolioData.phone}</span>
                                                <span className="hidden md:inline">•</span>
                                                <span>{portfolioData.location}</span>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="mb-6 text-left">
                                            <h2 className="text-xl md:text-2xl font-bold mb-3 text-cyan-600">Professional Summary</h2>
                                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">{portfolioData.resume.summary}</p>
                                        </div>

                                        {/* Education */}
                                        <div className="mb-6 text-left">
                                            <h2 className="text-xl md:text-2xl font-bold mb-3 text-cyan-600">Education</h2>
                                            {portfolioData.resume.education.map((edu, i) => (
                                                <div key={i} className="mb-4">
                                                    <h3 className="text-base md:text-lg font-semibold">{edu.degree}</h3>
                                                    <p className="text-gray-700 text-sm md:text-base">{edu.university} | {edu.year} | GPA: {edu.gpa}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Experience */}
                                        <div className="mb-6 text-left">
                                            <h2 className="text-xl md:text-2xl font-bold mb-3 text-cyan-600">Work Experience</h2>
                                            {portfolioData.experience.map((exp, i) => (
                                                <div key={i} className="mb-4">
                                                    <h3 className="text-base md:text-lg font-semibold">{exp.role}</h3>
                                                    <p className="text-gray-600 mb-1 text-sm md:text-base">{exp.company} | {exp.duration}</p>
                                                    <p className="text-gray-700 text-sm md:text-base">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Skills */}
                                        <div className="mb-6 text-left">
                                            <h2 className="text-xl md:text-2xl font-bold mb-3 text-cyan-600">Technical Skills</h2>
                                            <p className="text-gray-700 text-sm md:text-base">{portfolioData.skills.join(' • ')}</p>
                                        </div>

                                        {/* Certifications */}
                                        <div className="text-left">
                                            <h2 className="text-xl md:text-2xl font-bold mb-3 text-cyan-600">Certifications</h2>
                                            {portfolioData.certificates.map((cert, i) => (
                                                <div key={i} className="mb-2">
                                                    <p className="text-gray-700 text-sm md:text-base"><strong>{cert.name}</strong> - {cert.issuer} ({cert.date})</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => window.open(portfolioData.resume.downloadLink, '_blank')}
                                            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all flex items-center gap-3 font-semibold"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download as PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Project Detail Modal */}
                {showProjectModal && selectedProject && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowProjectModal(false)}>
                        <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl border border-indigo-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 border-b border-white/10 sticky top-0 backdrop-blur-lg z-10">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.tech.split(', ').map((tech, j) => (
                                                <span key={j} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => setShowProjectModal(false)} className="ml-4 text-gray-400 hover:text-white transition-all p-2 hover:bg-white/10 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Project Images */}
                                {((selectedProject.images && selectedProject.images.length > 0) || selectedProject.image) && (
                                    <div className="rounded-lg overflow-hidden border border-indigo-500/30">
                                        <img
                                            src={selectedProject.image}
                                            alt={selectedProject.name}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                )}

                                {/* Project Description */}
                                <div>
                                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Project Overview
                                    </h4>
                                    <p className="text-gray-300 leading-relaxed">{selectedProject.detailedDescription || selectedProject.description}</p>
                                </div>

                                {/* Features & Analysis */}
                                {selectedProject.features && selectedProject.features.length > 0 && (
                                    <div>
                                        <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Features & Analysis
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedProject.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Key Business Questions */}
                                {selectedProject.businessQuestions && selectedProject.businessQuestions.length > 0 && (
                                    <div>
                                        <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Key Business Questions Answered
                                        </h4>
                                        <div className="space-y-4">
                                            {selectedProject.businessQuestions.map((item, idx) => (
                                                <div key={idx} className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <p className="text-white font-semibold">{typeof item === 'string' ? item : item.question}</p>
                                                    </div>
                                                    {item.answer && (
                                                        <div className="ml-8 mt-2 p-3 bg-slate-900/50 rounded border-l-2 border-purple-400">
                                                            <p className="text-gray-300 text-sm leading-relaxed">{item.answer}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Project Feedback Section */}
                                <div className="border-t border-white/10 pt-6">
                                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        Share Your Feedback
                                    </h4>
                                    <p className="text-gray-400 text-sm mb-4">Have suggestions for improving this project? Let me know!</p>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        fetch('https://formspree.io/f/xdaaapaw', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                name: formData.get('feedback_name') || 'Anonymous',
                                                email: formData.get('feedback_email') || 'No email provided',
                                                _subject: `Project Feedback: ${selectedProject.name}`,
                                                message: `Project: ${selectedProject.name}\n\nFeedback:\n${formData.get('feedback_message')}`
                                            })
                                        }).then(response => {
                                            if (response.ok) {
                                                setFeedbackStatus({ type: 'success', message: 'Thank you! Your feedback has been sent.' });
                                                e.target.reset();
                                                setTimeout(() => setFeedbackStatus({ type: '', message: '' }), 3000);
                                            } else {
                                                setFeedbackStatus({ type: 'error', message: 'Failed to send. Please try again.' });
                                            }
                                        }).catch(() => {
                                            setFeedbackStatus({ type: 'error', message: 'Network error. Please try again.' });
                                        });
                                    }} className="space-y-3">
                                        <div className="grid md:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="feedback_name"
                                                placeholder="Your name (optional)"
                                                className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:border-pink-500 focus:outline-none transition-all"
                                            />
                                            <input
                                                type="email"
                                                name="feedback_email"
                                                placeholder="Your email (optional)"
                                                className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:border-pink-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                        <textarea
                                            name="feedback_message"
                                            required
                                            rows={3}
                                            placeholder="Your feedback or suggestions..."
                                            className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:border-pink-500 focus:outline-none transition-all resize-none"
                                        />
                                        {feedbackStatus.message && (
                                            <div className={`p-3 rounded-lg text-sm ${feedbackStatus.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-red-500/20 border border-red-500/30 text-red-300'}`}>
                                                {feedbackStatus.message}
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all text-sm shadow-lg hover:shadow-xl"
                                        >
                                            Send Feedback
                                        </button>
                                    </form>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid md:grid-cols-2 gap-4 pt-4">
                                    <button onClick={() => window.open(selectedProject.githubLink || portfolioData.githubUrl, '_blank')} className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="font-semibold">View on GitHub</div>
                                            <div className="text-xs text-gray-400">{selectedProject.githubLink ? 'Repository' : 'Visit Profile'}</div>
                                        </div>
                                    </button>
                                    <button onClick={() => selectedProject.articleLink && window.open(selectedProject.articleLink, '_blank')} disabled={!selectedProject.articleLink} className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all shadow-lg ${selectedProject.articleLink ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white hover:shadow-xl' : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="font-semibold">{selectedProject.articleLink ? 'Read Article' : 'Article Coming Soon'}</div>
                                            <div className="text-xs opacity-80">{selectedProject.articleLink ? 'Technical write-up' : 'In progress...'}</div>
                                        </div>
                                    </button>
                                </div>
                                {!selectedProject.githubLink && (
                                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-sm text-blue-300 flex items-start gap-2">
                                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>This project's repository is private. Click the GitHub button to visit my profile for more public projects.</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
};

export default PortfolioSite;
