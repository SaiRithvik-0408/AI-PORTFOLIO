

export const processAIQuery = (query, portfolioData) => {
    const lowerQuery = query.toLowerCase();

    // Default response
    let result = {
        action: "answer",
        response: "I'm not sure about that. Try asking about my skills, projects, or contact info."
    };

    // Check for specific project queries
    const projectKeywords = ['details', 'tell me about', 'more about', 'information', 'describe', 'explain', 'show me'];
    const isProjectQuery = projectKeywords.some(keyword => lowerQuery.includes(keyword));

    if (isProjectQuery) {
        // Try to find matching project by checking if any significant words from project name appear in query
        const matchedProject = portfolioData.projects.find(project => {
            const projectNameWords = project.name.toLowerCase().split(' ');
            // Check if at least 2 words from project name are in the query, or if it's a single-word name
            const matchCount = projectNameWords.filter(word => word.length > 3 && lowerQuery.includes(word)).length;
            return matchCount >= Math.min(2, projectNameWords.length) || lowerQuery.includes(project.name.toLowerCase());
        });

        if (matchedProject) {
            result = {
                action: "openProject",
                project: matchedProject,
                response: `Here's detailed information about ${matchedProject.name}. ${matchedProject.description}`
            };
        } else {
            result = {
                action: "suggest",
                section: "projects",
                response: `I have several projects including ${portfolioData.projects.map(p => p.name).join(', ')}. Which one would you like to know more about?`
            };
        }
    }
    // Keyword Matching Logic
    else if (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('built')) {
        result = {
            action: "suggest",
            section: "projects",
            response: `I've worked on several exciting projects like ${portfolioData.projects.map(p => p.name).join(', ')}. Would you like to see them?`
        };
    } else if (lowerQuery.includes('skill') || lowerQuery.includes('tech') || lowerQuery.includes('stack')) {
        result = {
            action: "suggest",
            section: "about",
            response: `I'm proficient in ${portfolioData.skills.slice(0, 5).join(', ')} and more. You can check out my full skillset in the Experience section.`
        };
    } else if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('reach') || lowerQuery.includes('hire')) {
        result = {
            action: "suggest",
            section: "contact",
            response: "You can reach me via email or phone. Would you like to go to the contact section?"
        };
    } else if (lowerQuery.includes('resume') || lowerQuery.includes('cv')) {
        result = {
            action: "suggest",
            section: "resume",
            response: "My resume details my professional experience and education. You can view or download it here."
        };
    } else if (lowerQuery.includes('experience') || lowerQuery.includes('job') || lowerQuery.includes('intern')) {
        result = {
            action: "suggest",
            section: "about",
            response: "I have experience as a Full Stack Developer and SDE Intern. Would you like to see the details in the Experience section?"
        };
    } else if (lowerQuery.includes('certificate')) {
        result = {
            action: "suggest",
            section: "certificates",
            response: "I have earned certificates from Red Hat, AWS, HackerRank, and Microsoft. I can show you the verifications."
        };
    } else if (lowerQuery.includes('coding') || lowerQuery.includes('leetcode') || lowerQuery.includes('codechef')) {
        result = {
            action: "suggest",
            section: "coding",
            response: "I solve problems on LeetCode and CodeChef. Would you like to see my stats?"
        };
    } else if (lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('university') || lowerQuery.includes('college') || lowerQuery.includes('study')) {
        result = {
            action: "suggest",
            section: "resume",
            response: "I am pursuing a B.Tech in Computer Science at KL University. Educational details are in the Education & Credentials section."
        };
    } else if (lowerQuery.includes('location') || lowerQuery.includes('live') || lowerQuery.includes('from')) {
        result = {
            action: "suggest",
            section: "contact",
            response: `I am currently based in ${portfolioData.location}.`
        };
    } else if (lowerQuery.includes('phone') || lowerQuery.includes('call') || lowerQuery.includes('number')) {
        result = {
            action: "suggest",
            section: "contact",
            response: `My phone number is ${portfolioData.phone}. You can find more contact details in the Contact section.`
        };
    } else if (lowerQuery.includes('ai agentic') || lowerQuery.includes('this portfolio')) {
        result = {
            action: "suggest",
            section: "projects",
            response: "You're looking at the AI Agentic Portfolio right now! It features this AI assistant and dynamic configuration."
        };
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
        result = {
            action: "answer",
            response: `Hello! I'm ${portfolioData.name}'s AI assistant. Ask me about projects, skills, education, or experience!`
        };
    }

    return result;
};

