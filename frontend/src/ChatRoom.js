import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './ChatRoom.css';

function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [connected, setConnected] = useState(false); // Bağlı olup olmadığını takip etmek için
    const stompClient = useRef(null);

    // localStorage'dan email alınıyor
    const email = localStorage.getItem('email');

    useEffect(() => {
        connect();

        // Sekme değişikliklerini izliyoruz
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            handleLeave();
            if (stompClient.current) {
                stompClient.current.disconnect(() => {
                    console.log("Disconnected from WebSocket");
                });
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.subscribe('/topic/public', onMessageReceived);

            // Bağlantı durumunu güncelle
            setConnected(true);

            // Sadece bağlantı ilk defa sağlandığında JOIN mesajı gönder
            if (!connected) {
                const token = localStorage.getItem('token');
                stompClient.current.send(
                    "/app/addUser",
                    { Authorization: `Bearer ${token}` },
                    JSON.stringify({ sender: email, type: 'JOIN' })
                );
            }
        }
    };

    const onError = (error) => {
        console.error('WebSocket bağlantı hatası:', error);
    };

    // Kullanıcı sayfayı kapattığında "LEAVE" mesajı gönderme
    const handleLeave = () => {
        const token = localStorage.getItem('token');
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.send(
                "/app/sendMessage",
                { Authorization: `Bearer ${token}` },
                JSON.stringify({ sender: email, type: 'LEAVE' })
            );
            setConnected(false); // Bağlantıyı false yap
        }
    };

    // Sekme görünürlük değiştiğinde işlem yapma
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            handleLeave();
        } else if (document.visibilityState === 'visible' && !connected) {
            connect();
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

    return (
        <div className="chat-wrapper">
            <div className="chat-page">
                <div className="chat-container">
                    <div className="chat-header">
                        <h2>Welcome to Chat Room</h2>
                    </div>
                    <ul className="message-area">
                        {messages.map((msg, index) => (
                            <li key={index} className={`message ${msg.type}`}>
                                {msg.type === 'JOIN' && <em style={{ color: 'green' }}>{msg.sender} joined the chat</em>}
                                {msg.type === 'LEAVE' && <em style={{ color: 'red' }}>{msg.sender} left the chat</em>}
                                {msg.type === 'CHAT' && <span><strong>{msg.sender}</strong>: {msg.content}</span>}
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
