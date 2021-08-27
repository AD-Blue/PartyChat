import React, { useContext, useState, useEffect, useRef } from 'react'
import { UserContext } from '../Context/UserContext.js';
import axios from 'axios';
import '../Styles/home.scss';
import MessageCard from './Components/MessageCard.js';
import Pusher from 'pusher-js';

export default function Home() {
    const { isAuthenticated, userObject } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const key = process.env.REACT_APP_PUSHER_KEY;

    const messageEl = useRef(null);

    const sendMessage = async () => {
        try {
            await axios.post(`/api/messages/${userObject}`, {body: message});
            setMessage('');
            console.log('Message posted successfully');
        } catch (err) {
            console.log(`Error posting message: ${err}`);
        }
    }

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            console.log('ENTER WAS PRESSED')
            sendMessage();
        }
    }

    const getMessages = async () => {
        try {
            const res = await axios.get('/api/messages');
            console.log(res)
            setMessageList(res.data.data);
            
        } catch (err) {
            console.log(`Error getting messages: ${err}`);
        }
    }

    useEffect(() => {
        getMessages();

        if (isAuthenticated) {
            if (messageEl) {
                messageEl.current.addEventListener('DOMNodeInserted', event => {
                    const { currentTarget: target } = event;
                    target.scroll({ top: target.scrollHeight, behavior: 'smooth' })
                })
            }
        }

        const pusher = new Pusher(key, {
            cluster: 'mt1'
        });
        
        pusher.connection.bind("connected", () => {
            console.log('PUSHER CONNECTED SUCCESSFULLY')
        });

        pusher.connection.bind('error', (err) => {
            console.log(`PUSHER CONNECTION ERROR`);
            console.log(err);
        });

        const channel = pusher.subscribe('chat');
        channel.bind('message-sent', (data) => {
            console.log(`Data received: `);
            console.log(data);
            getMessages();
            return data;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {isAuthenticated && (<div className='homeContainer'>
                <h1>Messages</h1>
            
                <div className='messageContainer' ref={messageEl}>
                    {messageList.map((message) => {
                        if(message.authorId === userObject) {
                            return (
                                <div className='authorCard'>
                                    <MessageCard key={message._id} message={message} styleName={'author'} />
                                    <img 
                                        src={`https://avatars.dicebear.com/api/jdenticon/${message.authorName}.svg`} 
                                        alt='Randomized unique avatar representing a user'
                                        height='30px'
                                        width='30px'
                                    />
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className='otherCard'>
                                    <img 
                                        src={`https://avatars.dicebear.com/api/jdenticon/${message.authorId}.svg`} 
                                        alt='Randomized unique avatar representing a user'
                                        height='30px'
                                        width='30px'
                                    />
                                    <MessageCard key={message._id} message={message} styleName={'other'} />
                                </div>
                            )
                        }
                    })}
                </div>
            
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyPress} />
                <button onClick={sendMessage}>Send</button>
            </div>)}

            {!isAuthenticated && (
                <div className='unauth-container'>
                    <h1>You are not logged in</h1>
                    <p>Please log in to see and send messages</p>
                </div>
            )}
        </>
    )
}
