package com.yunusemrenalbant.backend.controller;

import com.yunusemrenalbant.backend.enums.MessageType;
import com.yunusemrenalbant.backend.kafka.consumer.ChatConsumer;
import com.yunusemrenalbant.backend.kafka.producer.ChatProducer;
import com.yunusemrenalbant.backend.model.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@Slf4j
public class ChatController {

    private final ChatConsumer chatConsumer;
    private final ChatProducer chatProducer;

    public ChatController(ChatConsumer chatConsumer, ChatProducer chatProducer) {
        this.chatConsumer = chatConsumer;
        this.chatProducer = chatProducer;
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/public")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getType() == MessageType.CHAT) {
            chatMessage.setTime(LocalDateTime.now());
            chatProducer.sendMessage(chatMessage);
        }
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/public")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor != null && headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        } else {
            log.error("headerAccessor is null or sessionAttributes is null");
        }

        chatProducer.sendMessage(chatMessage);
    }

    @GetMapping("/chat")
    public List<ChatMessage> getChatMessages() {
        return chatConsumer.getChatMessages();
    }
}

