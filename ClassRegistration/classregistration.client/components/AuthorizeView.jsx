import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import React from 'react';

const UserContext = React.createContext({});

function AuthorizeView(props) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true); // add a loading state
    let emptyuser = { email: "" };

    const [user, setUser] = useState(emptyuser);

    useEffect(() => {
        // Get the cookie value
        let retryCount = 0; // initialize the retry count
        let maxRetries = 5; // set the maximum number of retries
        let delay = 1000; // set the delay in milliseconds

        // define a delay function that returns a promise
        async function wait(delay) {
            return new Promise((resolve) => setTimeout(resolve, delay));
        }

        // define a fetch function that retries until status 200 or 401
        async function fetchWithRetry(url, options) {
            try {
                const response = await fetch(url, options);

                if (response.status == 200) {
                    console.log("Authorized");
                    let j = await response.json();
                    setUser({ email: j.email });
                    setAuthorized(true);
                    return response; // return the response
                } else if (response.status == 401) {
                    console.log("Unauthorized");
                    return response; // return the response
                } else {
                    throw new Error(`${response.status}`);
                }
            } catch (error) {
                // increment the retry count
                retryCount++;
                // check if the retry limit is reached
                if (retryCount > maxRetries) {
                    // stop retrying and rethrow the error
                    throw error;
                } else {
                    // wait for some time and retry
                    await wait(delay);
                    return fetchWithRetry(url, options);
                }
            }
        }

        // call the fetch function with retry logic
        fetchWithRetry("/pingauth", { method: "GET" })
            .catch((error) => {
                // handle the final error
                console.log(error.message);
            })
            .finally(() => {
                setLoading(false); // set loading to false when the fetch is done
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else {
        if (authorized && !loading) {
            const value = props.value;
            return (
                <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
            );
        } else {
            return <Navigate to="/login" />;
        }
    }
}

function AuthorizedUser(props) {
    // Consume the username from the UserContext
    const user = React.useContext(UserContext);

    // Display the username in a h1 tag
    if (props.value === "email") {
        return <>{user.email}</>;
    } else {
        return null;
    }
}

export { AuthorizeView, AuthorizedUser };