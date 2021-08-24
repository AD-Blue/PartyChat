import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../Styles/register.scss';
import { UserContext } from '../Context/UserContext';

export default function Register() {

    const { setUserObject, setIsAuthenticated } = useContext(UserContext);

    const [usernameReg, setUsernameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [regLabel, setLabelText] = useState(<p className='reg-label'></p>);

    const clearFields = () => {
        setUsernameReg('');
        setPasswordReg('');
        setConfirmPassword('');
    }

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            console.log('ENTER WAS PRESSED')
            register();
        }
    }

    const register = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            if(passwordReg === confirmPassword && usernameReg && passwordReg){
                await axios.post('/api/users/register', {
                    username: usernameReg,
                    password: passwordReg
                }, config)

                console.log("Successfully posted new user")

                setLabelText(<p>User Successfully Registered!</p>)

                const post = await axios.post('api/users/login', {
                    username: usernameReg,
                    password: passwordReg
                }, config);

                setUserObject(post.data.data._id);
                setIsAuthenticated(true);

                clearFields();
            }
            else if (passwordReg !== confirmPassword) {
                console.log("Passwords do not match")
                setLabelText(<p>Passwords do not match!</p>)
                
            }
            else {
                setLabelText(<p>Missing required fields</p>)
            }
            
        }
        catch(err) {
            console.log(`Error registering from client: ${err}`);
            setLabelText(<p className='reg-label'>Error registering user (Username might be taken)</p>)
        }
    }

    return (
        <div className='registerContainer'>
            <h1>Register</h1>

            <label>Username</label>
            <input type="text" value={usernameReg} onChange={(e) => setUsernameReg(e.target.value)} />

            <label>Password</label>
            <input type="password" value={passwordReg} onChange={(e) => setPasswordReg(e.target.value)} />

            <label>Confirm Password</label>
            <input type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyPress}
            />

            <button className='btn-form' onClick={register}>Submit</button>

            {regLabel}

        </div>
    )
}
