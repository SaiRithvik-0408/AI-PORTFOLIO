import resumePDF from './assets/resume.pdf';
import homeGif from './assets/giphy.gif';
import { aiPortfolioImg1, aiPortfolioImg2, aiPortfolioImg3 } from './assets/project-images';

export const initialSectionVisibility = {
    home: true,
    about: true,
    resume: true,
    projects: true,
    certificates: true,
    coding: true,
    contact: true,
    background3D: false
};

export const getSectionVisibility = () => {
    const saved = localStorage.getItem('sectionVisibility');
    return saved ? JSON.parse(saved) : initialSectionVisibility;
};

export const setSectionVisibility = (visibility) => {
    localStorage.setItem('sectionVisibility', JSON.stringify(visibility));
};

export const portfolioData = {
    name: "Karnati Sai Rithvik",
    title: "Full Stack & Backend Developer",
    email: "karnatisairithvik@gmail.com",
    secondaryEmail: "2100032341csehonors@gmail.com",
    phone: "+91-8374402446",
    location: "Vijayawada, Andhra Pradesh",
    skills: [
        "Java", "Python", "JavaScript", "C", "SQL",
        "Spring Boot", "Spring Framework", "Django", "MERN Stack",
        "MySQL", "PostgreSQL", "MongoDB",
        "AWS", "Docker", "Git", "React.js", "Node.js"
    ],
    githubUrl: "https://github.com/SaiRithvik-0408",
    linkedinUrl: "https://www.linkedin.com/in/sai-rithvik-karnati-a62933248/",
    experience: [
        {
            role: "Full Stack Developer",
            company: "WebileApps",
            duration: "May 2025 - Present",
            description: "Working full-time as a Full Stack/Backend Developer building scalable web applications. (Continuation from Internship)"
        },
        {
            role: "Full Stack SDE Intern",
            company: "WebileApps",
            duration: "Dec 2024 - May 2025",
            description: "Worked on full-stack web development projects using the MERN stack (MongoDB, Express.js, React.js, Node.js). Developed reusable React components and integrated RESTful APIs."
        }
    ],
    projects: [
        {
            name: "AI Agentic Portfolio",
            tech: "React, Vite, Tailwind CSS, AI Integration",
            description: "A dynamic portfolio website featuring an AI assistant for natural language navigation and queries, built with modern web technologies.",
            detailedDescription: "An innovative portfolio website that leverages AI technology to provide an interactive user experience. Features include natural language processing for navigation, dynamic content loading, real-time coding statistics from LeetCode and CodeChef, and a modern glassmorphism design. Built with React 19 and Vite for optimal performance.",
            images: [aiPortfolioImg1, aiPortfolioImg2, aiPortfolioImg3],
            features: [
                "AI-powered natural language navigation",
                "Real-time LeetCode and CodeChef stats fetching",
                "Dynamic section visibility controls",
                "Responsive glassmorphism design",
                "Admin portal for configuration",
                "Contact form integration with Formspree"
            ],
            businessQuestions: [
                {
                    question: "How can AI enhance user engagement on portfolio websites?",
                    answer: "AI-powered natural language navigation allows visitors to interact conversationally, making the experience more intuitive and memorable. This reduces bounce rates and increases time spent on the site."
                },
                {
                    question: "What metrics demonstrate technical proficiency to recruiters?",
                    answer: "Real-time coding statistics from platforms like LeetCode and CodeChef provide quantifiable proof of problem-solving skills, showing both breadth (total problems solved) and depth (difficulty distribution)."
                },
                {
                    question: "How to balance aesthetics with performance in modern web apps?",
                    answer: "Using React 19 with Vite ensures fast build times and optimal runtime performance, while Tailwind CSS enables beautiful designs without sacrificing load speed through efficient CSS generation."
                }
            ],
            githubLink: "https://github.com/SaiRithvik-0408/AI-PORTFOLIO",
            articleLink: "https://github.com/SaiRithvik-0408/AI-PORTFOLIO"
        },
        {
            name: "Online Bidding/Auction Platform",
            tech: "Pycharm, MySQL, HTML, CSS",
            description: "A dynamic web-based application facilitating engaging and transparent auction processes. Sellers can list items, and buyers place bids to win, maximizing value through an interactive interface.",
            detailedDescription: "A comprehensive online auction platform that enables sellers to list items and buyers to participate in competitive bidding. Features include real-time bid updates, user authentication, item categorization, bid history tracking, and automated winner notification. Built with Python backend and MySQL database for reliable transaction handling.",
            image: null,
            features: [
                "Real-time bidding system with live updates",
                "User authentication and authorization",
                "Item categorization and search functionality",
                "Bid history and tracking",
                "Automated winner notification system",
                "Secure payment integration"
            ],
            businessQuestions: [
                {
                    question: "How to ensure fair and transparent bidding processes?",
                    answer: "Implementing real-time bid updates and comprehensive bid history tracking ensures all participants have equal access to information. Automated timestamp verification prevents bid manipulation."
                },
                {
                    question: "What strategies maximize seller revenue and buyer satisfaction?",
                    answer: "Dynamic pricing algorithms suggest optimal starting prices, while competitive bidding naturally drives prices to fair market value. Automated notifications keep buyers engaged throughout the auction lifecycle."
                },
                {
                    question: "How to prevent fraud and ensure transaction security?",
                    answer: "Multi-layer authentication, secure payment gateway integration, and MySQL transaction management ensure data integrity. User verification and escrow-like payment holding protect both buyers and sellers."
                }
            ],
            githubLink: null,
            articleLink: null
        },
        {
            name: "Airline Reservation System",
            tech: "Spring Boot, Java, MySQL, HTML, CSS",
            description: "A centralized platform for searching flights, making reservations, and managing bookings. Features specialized administrative tools for schedule and ticketing management.",
            detailedDescription: "A full-stack airline reservation system built with Spring Boot that streamlines the flight booking process. Includes features like flight search with filters, seat selection, booking management, payment integration, admin dashboard for flight scheduling, and automated email confirmations. Implements RESTful APIs and follows MVC architecture.",
            image: null,
            features: [
                "Advanced flight search with multiple filters",
                "Interactive seat selection interface",
                "Booking management and modification",
                "Payment gateway integration",
                "Admin dashboard for flight scheduling",
                "Automated email confirmations and reminders"
            ],
            businessQuestions: [
                {
                    question: "How to optimize seat allocation for maximum revenue?",
                    answer: "Dynamic pricing based on seat location and demand, combined with real-time availability tracking, enables revenue optimization. The system supports multiple fare classes to capture different customer segments."
                },
                {
                    question: "What features improve customer booking experience?",
                    answer: "Interactive seat maps, flexible booking modification options, and automated email confirmations reduce friction. Advanced filters help customers quickly find flights matching their preferences."
                },
                {
                    question: "How to handle peak traffic during holiday seasons?",
                    answer: "Spring Boot's scalable architecture and connection pooling in MySQL ensure high performance under load. Caching frequently accessed flight data and implementing queue-based booking prevents system overload."
                }
            ],
            githubLink: null,
            articleLink: null
        },
        {
            name: "Glaucoma Detection",
            tech: "Deep Learning, Python",
            description: "Advanced medical imaging project achieving 90% accuracy in detecting Glaucoma using fundus eye images through trained deep learning algorithms.",
            detailedDescription: "A machine learning project focused on early detection of Glaucoma using deep learning techniques. Utilizes convolutional neural networks (CNN) trained on fundus eye images to identify glaucoma patterns with 90% accuracy. Includes image preprocessing, data augmentation, model training with TensorFlow/Keras, and a user-friendly interface for medical professionals to upload and analyze eye images.",
            image: null,
            features: [
                "90% accuracy in glaucoma detection",
                "CNN-based image analysis",
                "Image preprocessing and augmentation",
                "User-friendly interface for medical professionals",
                "Batch processing capabilities",
                "Detailed diagnostic reports generation"
            ],
            businessQuestions: [
                {
                    question: "How can AI assist in early disease detection?",
                    answer: "Deep learning models can identify subtle patterns in fundus images that may be missed by human examination, enabling earlier intervention. The 90% accuracy rate demonstrates clinical viability for screening applications."
                },
                {
                    question: "What accuracy threshold is acceptable for medical diagnosis?",
                    answer: "While 90% accuracy is strong for screening, the system is designed as a diagnostic aid rather than replacement for professional judgment. It helps prioritize cases for detailed examination by ophthalmologists."
                },
                {
                    question: "How to make AI diagnostics accessible to rural healthcare?",
                    answer: "The lightweight Python implementation can run on standard hardware, making it deployable in resource-constrained settings. Batch processing capabilities allow efficient screening of large populations with minimal infrastructure."
                }
            ],
            githubLink: null,
            articleLink: null
        }
    ],
    certificates: [
        {
            name: "Red Hat Certified Enterprise Application Developer",
            issuer: "Red Hat",
            date: "2024",
            credentialId: "Credly",
            link: "https://www.credly.com/badges/88a6d5a1-db6c-4576-8eec-bd895530ab16/public_url"
        },
        {
            name: "AWS Certified Cloud Practitioner",
            issuer: "Amazon Web Services",
            date: "2024",
            credentialId: "Credly",
            link: "https://www.credly.com/badges/ef7bfed9-6053-418f-ae9d-fc0b6176d854/public_url"
        },
        {
            name: "HackerRank Software Engineer",
            issuer: "HackerRank",
            date: "2024",
            credentialId: "Verified",
            link: "https://www.hackerrank.com/certificates/4dde11579d88"
        },
        {
            name: "Microsoft Certified: Azure AI Fundamentals",
            issuer: "Microsoft",
            date: "2024",
            credentialId: "Credly",
            link: "https://www.credly.com/badges/958d6c0e-4439-47d4-8f78-22ee6984493e/public_url"
        }
    ],
    codingPlatforms: [
        // Dynamic data fetching enabled - stats will be fetched from APIs
        {
            name: "LeetCode",
            username: "SaiRithvik-0408",
            stats: { solved: 0, easy: 0, medium: 0, hard: 0, ranking: "N/A" },
            badges: []
        },
        {
            name: "CodeChef",
            username: "sairithvik0408",
            stats: { rating: 1651, stars: "3★", globalRank: "Inactive", countryRank: "Inactive" },
            badges: []
        }
    ],
    // Enable dynamic fetching of coding platform stats
    dynamicCodingStats: true,
    resume: {
        summary: "I am a person with strong determination, looking to use my solid background in computer science and practical knowledge of data structures and algorithms and web development. I aspire to work as a Software Developer Engineer, where I can bring fresh ideas to the table and further develop my skills in web development technologies.",
        education: [
            {
                degree: "B.Tech - Computer Science and Engineering",
                university: "KL University, Guntur",
                year: "2021 – 2025",
                gpa: "9.52 CGPA"
            },
            {
                degree: "Intermediate (12th)",
                university: "Narayana Junior College",
                year: "2019 – 2021",
                gpa: "9.5 CGPA"
            },
            {
                degree: "Secondary School (10th)",
                university: "SCS (CBSE)",
                year: "2018 – 2019",
                gpa: "84.2%"
            }
        ],
        downloadLink: resumePDF
    },
    ui: {
        homeGif: homeGif,
        colors: {
            primary: "indigo-500",
            secondary: "purple-500",
            accent: "pink-500",
            glow: "from-indigo-500/50 via-purple-500/50 to-pink-500/50"
        },
        contactFormEndpoint: "https://formspree.io/f/xvzzzwrw"
    }
};
