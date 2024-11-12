package com.yunusemrenalbant.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * registerStompEndpoints metodu, STOMP protokolü üzerinden istemcilerin
     * WebSocket bağlantısı kurabilecekleri bir endpoint tanımlar.
     * "/ws" endpointi üzerinden bağlantı sağlanabilir ve CORS desteği ile
     * sadece "http://localhost:3000" adresinden erişime izin verilir.
     * Ayrıca SockJS desteği ile WebSocket bağlantısı desteklenmediğinde
     * alternatif bağlantı seçenekleri de sağlanır.
     *
     * @param registry STOMP endpointlerinin kaydedileceği kayıt nesnesi
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }

    /**
     * configureMessageBroker metodu, mesaj yönlendirme işlemlerini gerçekleştiren
     * mesaj aracı (broker) yapılandırmasını sağlar. Uygulama ile başlayan
     * "/app" prefiksine sahip mesajlar sunucuya yönlendirilir. "/topic" prefiksine
     * sahip mesajlar ise basit mesaj aracı (simple broker) kullanılarak dağıtılır.
     *
     * @param registry Mesaj yönlendirme ayarlarının yapılacağı kayıt nesnesi
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }
}
