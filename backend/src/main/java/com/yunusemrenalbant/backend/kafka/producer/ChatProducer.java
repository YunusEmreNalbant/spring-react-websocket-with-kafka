package com.yunusemrenalbant.backend.kafka.producer;

import com.yunusemrenalbant.backend.enums.MessageType;
import com.yunusemrenalbant.backend.model.ChatMessage;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatProducer {

    private final KafkaTemplate<String, ChatMessage> kafkaTemplate;

    public ChatProducer(KafkaTemplate<String, ChatMessage> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(ChatMessage message) {
        if (message.getType() == MessageType.CHAT) {
            kafkaTemplate.send("chat-global-topic", message);
        }
    }
}
