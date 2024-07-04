import React, { useEffect, useState } from 'react';

export default function Facebook() {
    const [arr, setArr] = useState([]);
    const [pic, setPic] = useState("");
    const [name, setName] = useState("");
    const [pages, setPages] = useState([]);
    const [follower, setFollower] = useState("");
    const [engagement, setEngagement] = useState("");
    const [impression, setImpression] = useState("");
    const [reaction, setReaction] = useState("");

    useEffect(() => {
        // App Data Set Up
        window.fbAsyncInit = function () {
            window.FB.init({
                //Auth Only App ID : 1012881210507724
                //Business App ID : 332649086558323
                appId: '332649086558323',
                cookie: true,
                xfbml: true,
                version: 'v20.0'
            });

                // Load Facebook SDK asynchronously
                (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }
    }, []);

    useEffect(() => {
        localStorage.getItem("accessToken")
            if (Window.FB) {
              fetchData(localStorage.getItem("accessToken"))
            }else{
                console.log("SDK Not Loaded Yet")
                setTimeout(() => {
                    fetchData(localStorage.getItem("accessToken"))
                }, 55);
            }
    }, [])

    function fetchData(newToken){
          // Fetch user details
          window.FB.api('/me', { fields: 'name,picture', access_token: newToken }, function (response) {
            if (response && !response.error) {
                console.log('User details:', response);
                setPic(response.picture.data.url);
                setName(response.name);
            } else {
                console.error('Error fetching user details:', response.error);
            }
        });
        // Fetch pages owned by the user
        window.FB.api('/me/accounts', 'GET', { access_token: newToken}, function (response) {
            if (response && !response.error) {
                console.log('User Owned Page details:', response.data);
                setPages(response.data);
                setArr(response.data);
            } else {
                console.error('Error fetching pages:', response.error);
            }
        });
    }

    const handleLogin = () => {
        // Ensure FB is initialized before attempting login and load after Facebook SDK
        if (window.FB) {
            window.FB.login(response => {
                console.log(response);
                if (response.authResponse) {
                    console.log('User logged in successfully!');
                    localStorage.setItem("accessToken", response.authResponse.accessToken)
                    console.log(localStorage.getItem("accessToken")); // Access token for further API calls
                    fetchData(localStorage.getItem("accessToken"))
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                    console.log(response.status); // Error or cancelled status
                }
            }, { scope: 'pages_show_list,pages_read_engagement,read_insights' });
        } else {
            console.error('Facebook SDK not yet initialized.');
        }
    };

    function selectPages(Value) {
        arr.forEach(p => {
            if (Value === p.id) {
                console.log(p.name);
                // Page Insights
                window.FB.api(
                    `/${p.id}/insights/`,
                    'GET',
                    {
                        access_token: p.access_token,
                        metric: 'page_fans,page_post_engagements,page_impressions,page_actions_post_reactions_like_total'
                    },
                    function (response) {
                        if (response && !response.error) {
                            console.log(response);
                            let followerCount = 0;
                            let engagementCount = 0;
                            let impressionCount = 0;
                            let reactionCount = 0;
                            response.data.forEach(d => {
                                if (d.name === "page_fans") {
                                    followerCount = d.values[0].value;
                                    setFollower(d.values[0].value);
                                } else if (d.name === "page_post_engagements") {
                                    engagementCount = d.values[0].value;
                                    setEngagement(d.values[0].value);
                                } else if (d.name === "page_impressions") {
                                    impressionCount = d.values[0].value;
                                    setImpression(d.values[0].value);
                                } else if (d.name === "page_actions_post_reactions_like_total") {
                                    reactionCount = d.values[0].value;
                                    setReaction(d.values[0].value);
                                }
                            });
                            if (followerCount === 0 && engagementCount === 0 && impressionCount === 0 && reactionCount === 0) {
                                console.error('No data available for new pages or insufficient permissions.');
                            }
                        } else {
                            console.error('Error fetching insights:', response.error);
                        }
                    }
                );
            }
        });
    }
    return (
        <div>
            <button onClick={handleLogin}>Log in with Facebook</button>
            <div>
                <img src={pic} alt='' />
                <p>{name}</p>

                <select onChange={(e) => {
                    console.log(e.target.value);
                    selectPages(e.target.value);
                }}>
                    <option value="">Select a Page</option>
                    {pages.map((page) => (
                        <option key={page.id} value={page.id}>{page.name}</option>
                    ))}
                </select>
                <>
                    <div>Total Followers: {follower}</div>
                    <div>Total Engagement: {engagement}</div>
                    <div>Total Impressions: {impression}</div>
                    <div>Total Reactions: {reaction}</div>
                </>
            </div>
            <button onClick={()=>{
                localStorage.clear();
                window.location.reload();
            }}>Logout</button>
        </div>
    );
}
