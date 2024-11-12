package com.yunusemrenalbant.backend.listener;

import com.yunusemrenalbant.backend.enums.MessageType;
import com.yunusemrenalbant.backend.model.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    /**
     * handleWebSocketConnectListener metodu, yeni bir WebSocket bağlantısı
     * kurulduğunda çalışır. Bağlantı kurulumu sırasında, bilgi amaçlı olarak
     * bağlantının başarıyla gerçekleştiğini loglar.
     *
     * @param event Yeni bir WebSocket bağlantı kurulduğunda tetiklenen olay
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        log.info("Yeni bir WebSocket bağlantısı alındı");
    }

    /**
     * handleWebSocketDisconnectListener metodu, WebSocket bağlantısı sona erdiğinde
     * çalışır. Bu metod, bağlantısı sona eren kullanıcının kullanıcı adını alır
     * ve "username" session özelliğine erişerek kullanıcıyı tanımlar.
     * Eğer kullanıcı adı mevcutsa, kullanıcının bağlantıdan ayrıldığını loglar
     * ve ayrılma mesajını "/topic/public" kanalına gönderir.
     *
     * @param event WebSocket bağlantısı sonlandığında tetiklenen olay
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            log.info("Kullanıcı bağlantıdan ayrıldı: {}", username);

            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .build();

            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}