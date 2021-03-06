import React from 'react';
import '../../Styles/messageCard.scss';

export default function MessageCard({ message, styleName }) {
    return (
        <div className={styleName}>
            <p className='author-name'>{message.authorName}</p>
            <p className='message-text'>{message.body}</p>
        </div>
    )
}
