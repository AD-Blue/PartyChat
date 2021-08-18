import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';
import '../Styles/login.scss';

export default function Login() {

    const { setIsAuthenticated, setUserObject } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loginStatus, setLoginStatus] = useState(false);

    const [userLabel, setUserLabel] = useState(<p className='log-label'></p>)


    axios.defaults.withCredentials = true;

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            console.log('ENTER WAS PRESSED')
            login();
        }
    }

    const login = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            if(username && password) {
                const post = await axios.post('api/users/login', {
                    username: username,
                    password: password
                }, config)

                const id = post.data.data._id;
                console.log(post);

                if(post.data.auth === true) {
                    console.log('AUTH WORKING')
                    setUserLabel(<p className='log-label'>Logged in as {username}</p>)
                    setLoginStatus(true);
                    setIsAuthenticated(true);
                    setUserObject(id);
                }

                else {
                    setUserLabel(<p className='log-label'>Incorrect username or password</p>)
                    setLoginStatus(false);
                    setIsAuthenticated(false);
                }

                //clear the input fields
                setUsername('');
                setPassword('');
            }
            else {
                setUserLabel(<p className='log-label'>Missing required fields</p>)
            }
        } catch (err) {
            console.log(`Error logging in: ${err}`)
        }
    }

    /* const userAuthenticated = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users/isUserAuth");

            console.log(response)

            if (response.data.auth) {
                console.log("Authenticated successfully");
                console.log(response);
            }
            else {
                console.log("Could not authenticate: Missing token")
            }

        } catch (err) {
            console.log(`Failed to authentifcate, ${err}`);
        }

    } */

    const signOut = async () => {
        try {
            await axios.get('/api/users/logout');
            console.log('Attempting to log out');
            window.location.reload(false);
        } catch (err) {
            console.log(`Error signing out: ${err}`);
        }
    }

    useEffect(() => {
        axios.get("/api/users/login").then((response) => {
            if(response.data.loggedIn) {
                setLoginStatus(true);
                setIsAuthenticated(true);
                setUserLabel(<p className='log-label'>Logged in as {response.data.user.username}</p>)
            }
            
        })
    }, [loginStatus, setIsAuthenticated])

    return (
        <div>
            {!loginStatus && (
                <div className='loginContainer'>
                    <h1>Log In</h1>
                
                    <label>Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
                
                    <label>Password</label>
                    <input value={password} onKeyDown={handleKeyPress} onChange={(e) => setPassword(e.target.value)} type="password" />
                
                    <button className='btn-form' onClick={login}>Submit</button>
                
                    {userLabel}
                </div>
            )}

            {loginStatus && (
                <div className='auth-container'>
                    {userLabel}
                    <button className='btn-form' onClick={signOut}>Sign Out</button>
                </div>
            )}

        </div>
    )
}
