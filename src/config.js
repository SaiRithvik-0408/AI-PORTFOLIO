import resumePDF from './assets/K Sai Rithvik-resume.pdf';
import homeGif from './assets/giphy.gif';

export const sectionVisibility = {
    home: true,
    about: true,
    resume: true,
    projects: true,
    certificates: true,
    coding: false,
    contact: true,
    background3D: false
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
    linkedinUrl: "https://www.linkedin.com/in/sai-rithvik-k-a62933248/",
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
            description: "A dynamic portfolio website featuring an AI assistant for natural language navigation and queries, built with modern web technologies."
        },
        {
            name: "Online Bidding/Auction Platform",
            tech: "Pycharm, MySQL, HTML, CSS",
            description: "A dynamic web-based application facilitating engaging and transparent auction processes. Sellers can list items, and buyers place bids to win, maximizing value through an interactive interface."
        },
        {
            name: "Airline Reservation System",
            tech: "Spring Boot, Java, MySQL, HTML, CSS",
            description: "A centralized platform for searching flights, making reservations, and managing bookings. Features specialized administrative tools for schedule and ticketing management."
        },
        {
            name: "Glaucoma Detection",
            tech: "Deep Learning, Python",
            description: "Advanced medical imaging project achieving 90% accuracy in detecting Glaucoma using fundus eye images through trained deep learning algorithms."
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
        // Data hidden via sectionVisibility.coding = false
        {
            name: "LeetCode",
            username: "SaiRithvik-0408",
            stats: { solved: 0, easy: 0, medium: 0, hard: 0, ranking: "N/A" },
            badges: []
        }
    ],
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
        }
    }
};
