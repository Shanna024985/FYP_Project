# Application
applications routes start with /api/job/:jobId/application except for these:
- PUT /api/job/application/:applicationId - update the status of an application
BODY PARAMETERS:
- status: the status to be updated with. must be one of these values: 'Reviewing', 'Screening', 'Testing', 'Interviewing', 'Offered', 'Onboarded', 'Rejected'

- POST /api/job/:jobId/apply - apply for a job with a resume
BODY PARAMETERS:
- resumeId: the resumeId of a user to be applied with

remaining routes:
- GET /api/job/:jobId/application/overview - get the applicant overview of a job
- GET /api/job/:jobId/application/active - get all active applications of a job
- GET /api/job/:jobId/application/awaiting - get all awaiting applications of a job
- GET /api/job/:jobId/application/active/:name - get all active applications of a job, searching by name of applicant
- GET /api/job/:jobId/application/awaiting/:name - get all awaiting applications of a job, searching by name of applicant
- GET /api/job/:jobId/application - get all applications of a job