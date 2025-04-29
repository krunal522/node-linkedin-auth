const axios = require("axios");
const {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URI,
} = require("./config/linkedinConfig");

exports.redirectToLinkedIn = (req, res) => {
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri="https%3A%2F%2Fnode-linkedin-auth.onrender.com%2Fapi%2Fauth%2Flinkedin%2Fcallback"&scope=openid+profile+w_member_social+email`;

  console.log("Redirecting to:", linkedinAuthUrl); // Optional debug log
  res.redirect(linkedinAuthUrl);
};

exports.handleLinkedInCallback = async (req, res) => {
  // const { code } = req.query;
  const code = req.query.code;

  console.log("Received Authorization Code:", code);

  if (!code) {
    return res.status(400).json({ error: "Authorization code not found" });
  }

  try {
    // Step 3: Exchange code for access token 
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https%3A%2F%2Fnode-linkedin-auth.onrender.com%2Fapi%2Fauth%2Flinkedin%2Fcallback");
    params.append("client_id", LINKEDIN_CLIENT_ID);
    params.append("client_secret", LINKEDIN_CLIENT_SECRET);

    const tokenRes = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = tokenRes.data.access_token;
    // console.log("Access Token:", accessToken);

    // // Step 4: Fetch user profile with email and picture
    // const profileRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
    //   headers: { Authorization: `Bearer ${accessToken}` },
    // });

    // Step 5: Build user data
    // const userData = {
    //   id: profileRes.data.sub,
    //   firstName: profileRes.data.given_name || "",
    //   lastName: profileRes.data.family_name || "",
    //   name: profileRes.data.name || "",
    //   email: profileRes.data.email || "",
    //   emailVerified: profileRes.data.email_verified || false,
    //   picture: profileRes.data.picture || "",
    //   locale: profileRes.data.locale || "",
    // };

    console.log("access token complete", accessToken);
    res.json({ token: accessToken });
  } catch (error) {
    console.error("LinkedIn Auth Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "LinkedIn authentication failed.",
      details: error.response?.data || error.message,
    });
  }
};