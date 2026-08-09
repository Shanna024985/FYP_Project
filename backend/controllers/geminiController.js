const geminiService = require("../services/geminiService");
const { query } = require("../services/dbConnection");

// ==================== HELPER FUNCTIONS ====================

/**
 * Get user ID from JWT token
 */
const getUserIdFromReq = function(req, res) {
    return res?.locals?.userId || req.user?.userId || req.user?.id;
};

/**
 * Get user profile from database
 */
const getUserProfile = function(userId, callback) {
    let sql = `SELECT 
                  skills, 
                  experience, 
                  education, 
                  location 
               FROM user_detail 
               WHERE user_id = $1;`;
    
    query(sql, [userId])
        .then(function(result) {
            callback(null, result.rows[0] || {});
        })
        .catch(function(error) {
            console.error('Error fetching user profile:', error);
            callback(null, {});
        });
};

// ==================== MAIN CHAT ====================

/**
 * Main chat endpoint
 * POST /api/ai/chat
 */
module.exports.chat = async function(req, res, next) {
    const { message, type } = req.body;
    const userId = getUserIdFromReq(req, res);
    
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    
    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000); // 25 second timeout
    
    try {
        let response;
        
        // If recommendations, get user profile first
        if (type === 'recommendations' && userId) {
            const userProfile = await new Promise((resolve) => {
                getUserProfile(userId, function(err, profile) {
                    resolve(profile || {});
                });
            });
            response = await geminiService.chat(message, type, userProfile);
        } else {
            response = await geminiService.chat(message, type, null);
        }
        
        clearTimeout(timeout);
        
        res.json({
            message: "AI response generated successfully",
            response: response,
            type: type || 'faq'
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Chat Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate AI response" 
        });
    }
};

// ==================== JOB RECOMMENDATIONS ====================

/**
 * Get job recommendations
 * GET /api/ai/recommendations
 */
module.exports.getRecommendations = async function(req, res, next) {
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const userProfile = await new Promise((resolve) => {
            getUserProfile(userId, function(err, profile) {
                resolve(profile || {});
            });
        });
        
        const response = await geminiService.getJobRecommendations(userProfile);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Job recommendations generated successfully",
            recommendations: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Get Recommendations Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate recommendations" 
        });
    }
};

// ==================== FAQ ====================

/**
 * FAQ endpoint
 * POST /api/ai/faq
 */
module.exports.faq = async function(req, res, next) {
    const { question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getFAQAnswer(question);
        
        clearTimeout(timeout);
        
        res.json({
            message: "FAQ answer generated successfully",
            answer: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('FAQ Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate answer" 
        });
    }
};

// ==================== RESUME TIPS ====================

/**
 * Resume tips endpoint
 * POST /api/ai/resume-tips
 */
module.exports.resumeTips = async function(req, res, next) {
    const { resumeText } = req.body;
    
    if (!resumeText) {
        return res.status(400).json({ error: "Resume text is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getResumeTips(resumeText);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Resume tips generated successfully",
            tips: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Resume Tips Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate resume tips" 
        });
    }
};

// ==================== CAREER GUIDANCE ====================

/**
 * Career guidance endpoint
 * POST /api/ai/career-guidance
 */
module.exports.careerGuidance = async function(req, res, next) {
    const { query: question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Query is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getCareerGuidance(question);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Career guidance generated successfully",
            guidance: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Career Guidance Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate career guidance" 
        });
    }
};

// ==================== INTERVIEW TIPS ====================

/**
 * Interview tips endpoint
 * POST /api/ai/interview-tips
 */
module.exports.interviewTips = async function(req, res, next) {
    const { jobRole } = req.body;
    
    if (!jobRole) {
        return res.status(400).json({ error: "Job role is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getInterviewTips(jobRole);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Interview tips generated successfully",
            tips: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Interview Tips Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate interview tips" 
        });
    }
};

// ==================== JOB SEARCH ====================

/**
 * Job search advice endpoint
 * POST /api/ai/job-search
 */
module.exports.jobSearch = async function(req, res, next) {
    const { query: question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Query is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getJobSearchAdvice(question);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Job search advice generated successfully",
            advice: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Job Search Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate job search advice" 
        });
    }
};

// ==================== COMPANY INSIGHTS ====================

/**
 * Company insights endpoint
 * POST /api/ai/company-insights
 */
module.exports.companyInsights = async function(req, res, next) {
    const { companyName } = req.body;
    
    if (!companyName) {
        return res.status(400).json({ error: "Company name is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getCompanyInsights(companyName);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Company insights generated successfully",
            insights: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Company Insights Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate company insights" 
        });
    }
};

// ==================== SKILL ADVICE ====================

/**
 * Skill advice endpoint
 * POST /api/ai/skill-advice
 */
module.exports.skillAdvice = async function(req, res, next) {
    const { query: question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Query is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getSkillAdvice(question);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Skill advice generated successfully",
            advice: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Skill Advice Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate skill advice" 
        });
    }
};

// ==================== PLATFORM HELP ====================

/**
 * Platform help endpoint
 * POST /api/ai/platform-help
 */
module.exports.platformHelp = async function(req, res, next) {
    const { query: question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Query is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getPlatformHelp(question);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Platform help generated successfully",
            help: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Platform Help Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate platform help" 
        });
    }
};

// ==================== WORK ENVIRONMENT ====================

/**
 * Work environment advice endpoint
 * POST /api/ai/work-environment
 */
module.exports.workEnvironment = async function(req, res, next) {
    const { query: question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Query is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getWorkEnvironmentAdvice(question);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Work environment advice generated successfully",
            advice: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Work Environment Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate work environment advice" 
        });
    }
};

// ==================== FREELANCER ADVICE ====================

/**
 * Freelancer advice endpoint
 * POST /api/ai/freelancer-advice
 */
module.exports.freelancerAdvice = async function(req, res, next) {
    const { query: question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Query is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getFreelancerAdvice(question);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Freelancer advice generated successfully",
            advice: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Freelancer Advice Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate freelancer advice" 
        });
    }
};

// ==================== SALARY NEGOTIATION ====================

/**
 * Salary negotiation advice endpoint
 * POST /api/ai/salary-negotiation
 */
module.exports.salaryNegotiation = async function(req, res, next) {
    const { jobRole } = req.body;
    
    if (!jobRole) {
        return res.status(400).json({ error: "Job role is required" });
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
        return res.status(504).json({ 
            error: "AI service is taking too long. Please try again." 
        });
    }, 25000);
    
    try {
        const response = await geminiService.getSalaryAdvice(jobRole);
        
        clearTimeout(timeout);
        
        res.json({
            message: "Salary negotiation advice generated successfully",
            advice: response
        });
        
    } catch (error) {
        clearTimeout(timeout);
        console.error('Salary Negotiation Error:', error);
        return res.status(500).json({ 
            error: error.message || "Failed to generate salary negotiation advice" 
        });
    }
};