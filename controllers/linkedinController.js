const axios = require("axios");
const {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URI,
} = require("./config/linkedinConfig");

exports.redirectToLinkedIn = (req, res) => {
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&scope=openid+profile+w_member_social+email`;
  console.log("Redirecting to:", linkedinAuthUrl); // Optional debug log
  res.redirect(linkedinAuthUrl);
};


// exports.handleLinkedInCallback = async (req, res) => {
//   const code = req.query.code;

//   console.log('codeeee=>>>>>>>>.~~',code)
//   try {
//     const tokenResponse = await axios.get(
//       `https://www.linkedin.com/oauth/v2/accessToken`,
//       new URLSearchParams({
//         grant_type: "authorization_code",
//         code,
//         redirect_uri: LINKEDIN_REDIRECT_URI,
//         client_id: LINKEDIN_CLIENT_ID,
//         client_secret: LINKEDIN_CLIENT_SECRET,
//       }).toString(),
//       {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;

//     const profileResponse = await axios.get(
//       `https://api.linkedin.com/v2/me`,
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );

//     const emailResponse = await axios.get(
//       `https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`,
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );

//     const userData = {
//       id: profileResponse.data.id,
//       firstName: profileResponse.data.localizedFirstName,
//       lastName: profileResponse.data.localizedLastName,
//       email: emailResponse.data.elements[0]["handle~"].emailAddress,
//     };

//     res.json(userData);
//   } catch (error) {
//     console.log('errrr', error)
//     res.status(500).json({ error: "LinkedIn authentication failed." });
//   }
// };
// exports.handleLinkedInCallback = async (req, res) => {
//   const code = req.query.code;

//   console.log('Received authorization code:=>>>>>>>>>..', code);

//   try {
//     // ✅ Step 1: Exchange code for access token
//     const params = new URLSearchParams();
//     params.append("grant_type", "authorization_code");
//     params.append("code", code);
//     params.append("redirect_uri", LINKEDIN_REDIRECT_URI);
//     params.append("client_id", LINKEDIN_CLIENT_ID);
//     params.append("client_secret", LINKEDIN_CLIENT_SECRET);

//     const tokenResponse = await axios.post(
//       "https://www.linkedin.com/oauth/v2/accessToken",
//       params,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;

//     console.log('tokennnnnget=>>>>!!!!', accessToken);

//     // ✅ Step 2: Get user profile
//     const profileResponse = await axios.get("https://api.linkedin.com/v2/userinfo", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });



//     console.log('profile dataaaaa=>>>>!!!@!@', profileResponse);

//     // ✅ Step 3: Get user email
//     // const emailResponse = await axios.get(
//     //   "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
//     //   {
//     //     headers: {
//     //       Authorization: `Bearer ${accessToken}`,
//     //     },
//     //   }
//     // );

//     // ✅ Step 4: Combine data
//     // const userData = {
//     //   id: profileResponse.data.id,
//     //   firstName: profileResponse.data.localizedFirstName,
//     //   lastName: profileResponse.data.localizedLastName,
//     //   email: emailResponse.data.elements[0]["handle~"].emailAddress,
//     // };

//     // res.json(userData);
//   } catch (error) {
//     console.error("LinkedIn Auth Error:", error.response?.data || error.message);
//     res.status(500).json({ error: "LinkedIn authentication failed." });
//   }
// };
exports.handleLinkedInCallback = async (req, res) => {
  const code = req.query.code;

  console.log('Received code:', code);

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", LINKEDIN_REDIRECT_URI);
    params.append("client_id", LINKEDIN_CLIENT_ID);
    params.append("client_secret", LINKEDIN_CLIENT_SECRET);

    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log("Access Token:=>>>>>>>>>>>>>>>>>>", accessToken);

    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('profileee data=>>????????????', profileResponse.data);
    // Get the profile data from the response
    const profileData = profileResponse.data;

    // Return the profile data to the frontend
    res.json(profileData);
    // Or if you want JSON format (good for frontend use):

  } catch (error) {
    console.error("LinkedIn Auth Error:", error.response?.data || error.message);
    res.status(500).send("LinkedIn authentication failed.");
  }
};
