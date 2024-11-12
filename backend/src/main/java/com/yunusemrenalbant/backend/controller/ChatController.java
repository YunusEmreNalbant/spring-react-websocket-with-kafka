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

    /**
     * sendMessage metodu, "/sendMessage" adresine gönderilen mesajları dinler
     * ve eğer mesaj türü CHAT ise mesajın gönderilme zamanını ayarlar ve
     * mesajı Kafka aracılığıyla üretir. Mesajın tüm kullanıcılara dağıtılması
     * için "/topic/public" kanalına gönderilir.
     *
     * @param chatMessage Gönderilen sohbet mesajı
     */
    @MessageMapping("/sendMessage")
    @SendTo("/topic/public")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getType() == MessageType.CHAT) {
            log.info("Received message: {}", chatMessage);
            chatMessage.setTime(LocalDateTime.now());
            chatProducer.sendMessage(chatMessage);
        }
    }

    /**
     * addUser metodu, yeni bir kullanıcının sohbet sistemine katılmasını sağlar.
     * Kullanıcı adı session'a eklenir ve mesaj Kafka aracılığıyla üretilir.
     * Kullanıcının katıldığını tüm kullanıcılara bildirmek için "/topic/public"
     * kanalına gönderilir.
     *
     * @param chatMessage Katılan kullanıcının bilgilerini içeren mesaj
     * @param headerAccessor Session bilgilerini elde etmek için kullanılır
     */
    @MessageMapping("/addUser")
    @SendTo("/topic/public")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor != null && headerAccessor.getSessionAttributes() != null) {
            log.info("Received message: {}", chatMessage);
            headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        } else {
            log.error("headerAccessor veya sessionAttributes null");
        }

        chatProducer.sendMessage(chatMessage);
    }

    /**
     * getChatMessages metodu, önceki sohbet mesajlarını almak için kullanılır.
     * "/chat" GET isteği üzerine çalışır ve chatConsumer (kafka) üzerinden alınan
     * mesaj listesini döner.
     *
     * @return Daha önce gönderilen sohbet mesajlarının listesi
     */
    @GetMapping("/chat")
    public List<ChatMessage> getChatMessages() {
        log.info("getChatMessages");
        return chatConsumer.getChatMessages();
    }
}
