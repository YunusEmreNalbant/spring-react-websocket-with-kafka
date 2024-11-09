import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './ChatRoom.css';

function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [connecting, setConnecting] = useState(true);
    const stompClient = useRef(null);
    const messageAreaRef = useRef(null);

    const email = localStorage.getItem('email');

    useEffect(() => {
        connect();
        window.addEventListener('beforeunload', handleLeave);

        return () => {
            handleLeave();
            if (stompClient.current) {
                stompClient.current.disconnect(() => {
                    console.log("Disconnected from WebSocket");
                });
            }
            window.removeEventListener('beforeunload', handleLeave);
        };
    }, []);

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.subscribe('/topic/public', onMessageReceived);

            const token = localStorage.getItem('token');
            stompClient.current.send    (
                "/app/addUser",
                { Authorization: `Bearer ${token}` },
                JSON.stringify({ sender: email, type: 'JOIN' })
            );

            setConnecting(false);
        }
    };

    const onError = (error) => {
        console.error('WebSocket bağlantı hatası:', error);
        setConnecting(true);
    };

    const handleLeave = () => {
        const token = localStorage.getItem('token');
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.send(
                "/app/sendMessage",
                { Authorization: `Bearer ${token}` },
                JSON.stringify({ sender: email, type: 'LEAVE' })
            );
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && stompClient.current && stompClient.current.connected) {
            const chatMessage = {
                sender: email,
                content: message,
                type: 'CHAT',
            };

            const token = localStorage.getItem('token');
            stompClient.current.send(
                "/app/sendMessage",
                { Authorization: `Bearer ${token}` },
                JSON.stringify(chatMessage)
            );
            setMessage('');
        }
    };

    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const formatDate = (time) => {
        const date = new Date(time);
        return date.toLocaleString();
    };


    return (
        <div className="chat-wrapper">
            <div className="row col-12 chat-page">
                <div className="col-8 chat-container">
                    <div className="chat-header">
                        <h2>Sohbet Odasına Hoş geldin</h2>
                    </div>
                    {connecting && <div className="connecting">Bağlanıyor...</div>}
                    <ul className="message-area" ref={messageAreaRef}>
                        {messages.map((msg, index) => (
                            <li key={index} className={`message ${msg.type}`}>
                                {msg.type === 'JOIN' && <em>{msg.sender} joined the chat</em>}
                                {msg.type === 'LEAVE' && <em>{msg.sender} left the chat</em>}
                                {msg.type === 'CHAT' && (
                                    <span>
                                        <strong>{msg.sender}</strong>: {msg.content}
                                        <div className="timestamp">
                                            {formatDate(msg.time)}
                                        </div>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <form className="message-form" onSubmit={sendMessage}>
                        <div className="input-group clearfix">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-control"
                                autoComplete="off"
                            />
                            <button type="submit" className="primary send-button">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;
