const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Google has been aggressively deprecating/restricting model names (2.0-flash-exp retired,
// then 2.5-flash blocked for new API keys). Try several current names in order and cache
// whichever one actually works for this key, instead of hardcoding one that might break again.
const MODEL_CANDIDATES = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-3-flash-preview",
    "gemini-2.5-pro"
];

let cachedModelName = null;

function isModelUnavailableError(error) {
    const msg = (error && error.message || "").toLowerCase();
    return error?.status === 404 ||
        msg.includes("not found") ||
        msg.includes("no longer available") ||
        msg.includes("is not supported for generatecontent");
}

// ==================== RATE LIMITER ====================
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

/**
 * Helper function to get AI response with retry logic and rate limiting
 */
const getAIResponse = async (prompt, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const BASE_DELAY = 2000; // 2 seconds base delay
    
    try {
        // Rate limiting - ensure minimum time between requests
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
            console.log(`Rate limiting: waiting ${waitTime/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        lastRequestTime = Date.now();

        // If we already know which model works for this API key, use it directly.
        const namesToTry = cachedModelName ? [cachedModelName] : MODEL_CANDIDATES;
        let lastModelError = null;

        for (const modelName of namesToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;

                if (cachedModelName !== modelName) {
                    console.log(`Gemini: using model "${modelName}"`);
                    cachedModelName = modelName;
                }

                return response.text();
            } catch (modelError) {
                lastModelError = modelError;
                if (isModelUnavailableError(modelError)) {
                    console.warn(`Gemini: model "${modelName}" unavailable, trying next candidate...`);
                    continue; // try the next candidate model
                }
                throw modelError; // a real error (quota, auth, etc.) - don't keep trying models
            }
        }

        // Every candidate model was unavailable
        throw lastModelError;

    } catch (error) {
        console.error(`Gemini API Error (attempt ${retryCount + 1}):`, {
            status: error.status,
            message: error.message,
            errorDetails: error.errorDetails
        });
        
        // Handle rate limiting (429) with exponential backoff
        if (error.status === 429 && retryCount < MAX_RETRIES) {
            // Try to get retry delay from error, or use exponential backoff
            let waitTime = BASE_DELAY * Math.pow(2, retryCount);
            
            // Check if error has retryDelay info
            if (error.errorDetails) {
                const retryInfo = error.errorDetails.find(d => d.retryDelay);
                if (retryInfo) {
                    const parsedDelay = parseInt(retryInfo.retryDelay);
                    if (!isNaN(parsedDelay)) {
                        waitTime = parsedDelay + 1000; // Add 1 second buffer
                    }
                }
            }
            
            console.log(`Rate limited. Waiting ${waitTime/1000}s before retry ${retryCount + 1}/${MAX_RETRIES}...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return getAIResponse(prompt, retryCount + 1);
        }
        
        // Specific error messages
        if (error.message.includes('API key')) {
            return "I'm having trouble with authentication. Please check your API key configuration.";
        } else if (error.status === 429) {
            return "I'm currently experiencing high demand. Please wait a moment and try again.";
        } else if (error.message.includes('quota')) {
            return "I've reached my usage limit. Please try again later or check your billing details.";
        } else if (isModelUnavailableError(error)) {
            return "I'm having trouble with the AI model. Please try again.";
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
            return "I'm having network connectivity issues. Please check your internet connection.";
        }
        
        // Fallback error message
        return "I'm sorry, I couldn't process your request. Please try again in a moment.";
    }
};

// ==================== 1. JOB RECOMMENDATIONS ====================

/**
 * Get job recommendations based on user profile
 */
module.exports.getJobRecommendations = async (userProfile) => {
    const prompt = `
    You are a career advisor for Microjob.shop.
    
    Based on this user profile, recommend 5 suitable jobs:
    
    Skills: ${userProfile.skills || 'Not specified'}
    Experience: ${userProfile.experience || 'Not specified'}
    Education: ${userProfile.education || 'Not specified'}
    Location: ${userProfile.location || 'Not specified'}
    
    For each recommendation, provide:
    1. Job Title
    2. Industry
    3. Reason for recommendation
    4. Required skills
    5. Estimated salary range
    
    Format your response as a clear, structured list with bullet points.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 2. FAQ ASSISTANT ====================

/**
 * Answer user questions about the platform
 */
module.exports.getFAQAnswer = async (question) => {
    const prompt = `
    You are a helpful assistant for Microjob.shop.
    
    Answer this user question: ${question}
    
    Common topics:
    - How to apply for jobs
    - How to create a company profile
    - How to post a job
    - How to upload a resume
    - How to leave a review
    - How to save a job
    - How to delete a job
    
    Provide a clear and helpful answer in a friendly and professional tone.
    If you don't know the answer, suggest contacting support at support@microjob.shop.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 3. RESUME TIPS ====================

/**
 * Provide resume improvement tips
 */
module.exports.getResumeTips = async (resumeText) => {
    const prompt = `
    You are a resume expert for Microjob.shop.
    
    Analyze this resume and provide 3-5 specific tips to improve it:
    
    ${resumeText}
    
    Provide advice on:
    1. Content improvements
    2. Keywords to add for ATS (Applicant Tracking Systems)
    3. Skills to highlight
    4. How to quantify achievements with numbers
    5. Formatting suggestions
    
    Be specific and actionable with your suggestions.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 4. CAREER GUIDANCE ====================

/**
 * Provide career guidance
 */
module.exports.getCareerGuidance = async (query) => {
    const prompt = `
    You are a career counselor for Microjob.shop.
    
    Provide career guidance for: ${query}
    
    Include:
    1. Career path options and progression
    2. Skills needed to advance
    3. Learning resources and certifications
    4. Current industry trends and opportunities
    
    Make your advice practical, encouraging, and actionable.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 5. INTERVIEW PREPARATION ====================

/**
 * Provide interview preparation tips
 */
module.exports.getInterviewTips = async (jobRole) => {
    const prompt = `
    You are an interview coach for Microjob.shop.
    
    Provide interview preparation tips for: ${jobRole}
    
    Include:
    1. Common interview questions (at least 5)
    2. Technical topics to review
    3. Behavioral questions using STAR method
    4. Questions to ask the interviewer
    5. How to follow up after the interview
    
    Give specific, actionable advice for success.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 6. JOB SEARCH ADVICE ====================

/**
 * Provide job search advice
 */
module.exports.getJobSearchAdvice = async (query) => {
    const prompt = `
    You are a job search expert for Microjob.shop.
    
    Provide job search advice for: ${query}
    
    Include:
    1. Where to find jobs (platforms, networking)
    2. How to stand out to employers
    3. Networking strategies (online and offline)
    4. Application tips and best practices
    5. How to negotiate offers
    
    Be practical, encouraging, and provide real-world examples.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 7. COMPANY INSIGHTS ====================

/**
 * Provide insights about a company
 */
module.exports.getCompanyInsights = async (companyName) => {
    const prompt = `
    You are a company researcher for Microjob.shop.
    
    Provide insights about: ${companyName}
    
    Include:
    1. Industry and sector
    2. Company culture and values
    3. Common interview questions for this company
    4. Career growth opportunities
    5. What employees typically say about working there
    
    If you don't have specific information about this company,
    provide general advice for researching companies before interviews.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 8. APPLICATION HELP ====================

/**
 * Provide help with job applications
 */
module.exports.getApplicationHelp = async (query) => {
    const prompt = `
    You are an application specialist for Microjob.shop.
    
    Provide help with job applications for: ${query}
    
    Include:
    1. How to track applications effectively
    2. Follow-up strategies and timing
    3. What to do after applying (preparation, networking)
    4. How to handle rejections professionally
    
    Give clear, step-by-step guidance with practical tips.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 9. SKILL DEVELOPMENT ====================

/**
 * Provide skill development advice
 */
module.exports.getSkillAdvice = async (query) => {
    const prompt = `
    You are a skill development advisor for Microjob.shop.
    
    Provide advice about skills for: ${query}
    
    Include:
    1. Core skills to learn (prioritized)
    2. Recommended learning resources (courses, books, platforms)
    3. How to practice and apply these skills
    4. How to showcase skills on your resume and LinkedIn
    5. Estimated time to become proficient
    
    Recommend specific, high-quality learning resources.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 10. PLATFORM NAVIGATION ====================

/**
 * Provide help with platform features
 */
module.exports.getPlatformHelp = async (query) => {
    const prompt = `
    You are a platform guide for Microjob.shop.
    
    Provide help with using the platform for: ${query}
    
    Include:
    1. Step-by-step instructions for the specific task
    2. Tips for better user experience
    3. Common issues and how to solve them
    4. Where to find additional help if needed
    
    Be specific to the Microjob.shop platform features.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 11. WORK ENVIRONMENT ====================

/**
 * Provide work environment advice
 */
module.exports.getWorkEnvironmentAdvice = async (query) => {
    const prompt = `
    You are a work environment advisor for Microjob.shop.
    
    Provide work environment advice for: ${query}
    
    Include:
    1. Remote work tips and best practices
    2. Work-life balance strategies
    3. Professional growth and development
    4. Building relationships with colleagues
    5. Managing stress and avoiding burnout
    
    Provide practical, actionable advice with specific examples.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 12. FREELANCER TIPS ====================

/**
 * Provide freelancer tips
 */
module.exports.getFreelancerAdvice = async (query) => {
    const prompt = `
    You are a freelancer advisor for Microjob.shop.
    
    Provide freelancer advice for: ${query}
    
    Include:
    1. How to start freelancing successfully
    2. Finding and retaining clients
    3. Pricing strategies and negotiation
    4. Portfolio building and showcasing work
    5. Managing finances and contracts
    
    Give specific, practical advice for new and experienced freelancers.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== 13. SALARY NEGOTIATION ====================

/**
 * Provide salary negotiation advice
 */
module.exports.getSalaryAdvice = async (jobRole) => {
    const prompt = `
    You are a salary negotiation expert for Microjob.shop.
    
    Provide salary negotiation advice for: ${jobRole}
    
    Include:
    1. How to research market rates
    2. How to present your value
    3. Negotiation strategies and scripts
    4. What benefits to negotiate beyond salary
    5. How to handle rejection
    
    Give practical, actionable advice with examples.
    `;
    
    return await getAIResponse(prompt);
};

// ==================== MAIN CHAT FUNCTION ====================

/**
 * Main chat function - routes to appropriate handler
 */
module.exports.chat = async (message, type, userProfile = null) => {
    let response;
    
    try {
        console.log(`Processing ${type || 'general'} request:`, message.substring(0, 50) + '...');
        
        switch(type) {
            case 'recommendations':
                response = await module.exports.getJobRecommendations(userProfile || {});
                break;
            case 'faq':
                response = await module.exports.getFAQAnswer(message);
                break;
            case 'resume':
                response = await module.exports.getResumeTips(message);
                break;
            case 'career':
                response = await module.exports.getCareerGuidance(message);
                break;
            case 'interview':
                response = await module.exports.getInterviewTips(message);
                break;
            case 'jobsearch':
                response = await module.exports.getJobSearchAdvice(message);
                break;
            case 'company':
                response = await module.exports.getCompanyInsights(message);
                break;
            case 'application':
                response = await module.exports.getApplicationHelp(message);
                break;
            case 'skills':
                response = await module.exports.getSkillAdvice(message);
                break;
            case 'platform':
                response = await module.exports.getPlatformHelp(message);
                break;
            case 'workenv':
                response = await module.exports.getWorkEnvironmentAdvice(message);
                break;
            case 'freelancer':
                response = await module.exports.getFreelancerAdvice(message);
                break;
            case 'salary':
                response = await module.exports.getSalaryAdvice(message);
                break;
            default:
                response = await module.exports.getFAQAnswer(message);
        }
        
        console.log('Response generated successfully');
        return response;
        
    } catch (error) {
        console.error('Chat Error:', error);
        return "I'm sorry, I couldn't process your request. Please try again in a moment.";
    }
};