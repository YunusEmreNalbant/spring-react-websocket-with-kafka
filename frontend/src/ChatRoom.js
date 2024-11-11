import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './ChatRoom.css';
import { Button } from "react-bootstrap";

const WS_URL = 'http://localhost:8080/ws';
const API_CHAT_HISTORY = 'http://localhost:8080/chat';
const API_LOGOUT = 'http://localhost:8080/api/auth/logout';

function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [connecting, setConnecting] = useState(true);
    const stompClient = useRef(null);
    const messageAreaRef = useRef(null);
    const email = localStorage.getItem('email');

    useEffect(() => {
        fetchChatHistory();
        connectWebSocket();

        return () => handleLeave();
    }, []);

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchChatHistory = () => {
        fetch(API_CHAT_HISTORY, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(data => setMessages(data))
            .catch(error => console.error("Geçmiş mesajlar alınamadı:", error));
    };

    const connectWebSocket = () => {
        const socket = new SockJS(WS_URL);
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        stompClient.current.subscribe('/topic/public', onMessageReceived);

        sendJoinMessage();
        setConnecting(false);
    };

    const onError = (error) => {
        console.error('WebSocket bağlantı hatası:', error);
        setConnecting(true);
    };

    const sendJoinMessage = () => {
        const token = localStorage.getItem('token');
        stompClient.current.send(
            "/app/addUser",
            { Authorization: `Bearer ${token}` },
            JSON.stringify({ sender: email, type: 'JOIN' })
        );
    };

    const handleLeave = () => {
        const token = localStorage.getItem('token');
        if (stompClient.current?.connected) {
            stompClient.current.send(
                "/app/sendMessage",
                { Authorization: `Bearer ${token}` },
                JSON.stringify({ sender: email, type: 'LEAVE' })
            );
            stompClient.current.disconnect(() => console.log("Disconnected from WebSocket"));
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !stompClient.current?.connected) return;

        const token = localStorage.getItem('token');
        const chatMessage = { sender: email, content: message, type: 'CHAT' };

        stompClient.current.send(
            "/app/sendMessage",
            { Authorization: `Bearer ${token}` },
            JSON.stringify(chatMessage)
        );
        setMessage('');
    };

    const onMessageReceived = (payload) => {
        const receivedMessage = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    const formatDate = (time) => new Date(time).toLocaleString();

    const handleLogout = async () => {
        stompClient.current?.disconnect(() => console.log("Disconnected from WebSocket"));

        try {
            const response = await fetch(API_LOGOUT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                window.location.href = '/login';
            } else {
                alert('Çıkış başarısız!');
            }
        } catch (error) {
            console.error('Logout isteğinde bir hata oluştu:', error);
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="row col-12 justify-content-center chat-page">
                <div className="col-8 chat-container">
                    <div className="d-flex justify-content-between">
                        <div className="chat-header">
                            <h2>Sohbet Odasına Hoş geldin</h2>
                        </div>
                        <div>
                            <Button type="button" className="btn btn-danger btn-sm" onClick={handleLogout}>
                                Çıkış Yap
                            </Button>
                        </div>
                    </div>

                    {connecting && <div className="connecting">Bağlanıyor...</div>}
                    <ul className="message-area" ref={messageAreaRef}>
                        {messages.map((msg, index) => (
                            <li key={index} className={`message ${msg.type} ${msg.sender === email ? 'self' : ''}`}>
                                {msg.type === 'JOIN' && <em>{msg.sender} joined the chat</em>}
                                {msg.type === 'LEAVE' && <em>{msg.sender} left the chat</em>}
                                {msg.type === 'CHAT' && (
                                    <span>
                                        <strong>{msg.sender}</strong>: {msg.content}
                                        <div className="timestamp">{formatDate(msg.time)}</div>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <form className="message-form" onSubmit={sendMessage}>
                        <div className="input-group clearfix">
                            <input
                                type="text"
                                placeholder="Bir mesaj yazın..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-control"
                                autoComplete="off"
                            />
                            <button type="submit" className="primary send-button">
                                Gönder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;