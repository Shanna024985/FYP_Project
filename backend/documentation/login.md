# Login
Login into MicroJobs.shop with Singpass!

> [!IMPORTANT]
> Singpass uses a public key to encrypt user data, which needs to be decrypted by a private key in the backend. As such, please install `jose` as such:
> `npm install jose`

## Endpoints

### GET /api/auth
Redirects the user to Singpass for logging in. This endpoint does not take in any parameters.

### GET /api/auth/token
Authenticates the user after logging in with Singpass. Singpass will automatically redirect the user to this endpoint and provides parameters. The backend will:
- get the user's Singpass ID (not the NRIC)
- create a new user if the Singpass ID does not exist in the user table
- check if the user needs onboarding (by checking if the corresponding user details are present)

Afterwards, the backend will redirect the user to `/login` with these URL parameters:
| Parameter Name | Description |
| - | - |
| token | A JWT token that is used for authenticating the user. |
| onboardingNeeded | Returns `true` or `false`. If the parameter value is `true` you should redirect the user to the onboarding page, otherwise redirect the user to the dashboard. |

Example redirect URL:

`http://localhost:3000/login?token=<token>&onboardingNeeded=true`