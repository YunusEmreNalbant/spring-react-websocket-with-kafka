package com.yunusemrenalbant.backend.kafka.consumer;

import com.yunusemrenalbant.backend.enums.MessageType;
import com.yunusemrenalbant.backend.model.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ChatConsumer {
    private final SimpMessagingTemplate messagingTemplate;
    private final List<ChatMessage> chatMessages = new ArrayList<>();

    public ChatConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "chat-global-topic", groupId = "chat-group")
    public void consumeMessage(ChatMessage message) {
        log.info("Received message: {}", message);

        if (message.getType() == MessageType.CHAT) {
            chatMessages.add(message);
            messagingTemplate.convertAndSend("/topic/public", message);
        }
    }

    public List<ChatMessage> getChatMessages() {
        return new ArrayList<>(chatMessages);
    }
}