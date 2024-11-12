# Spring Boot, ReactJS, SockJS ve Kafka ile Anlık Chat Uygulaması

Bu proje, kullanıcıların gerçek zamanlı mesajlaşmasını sağlamak için Spring Boot, ReactJS, WebSocket, SockJS ve Kafka kullanan bir chat uygulamasıdır. Uygulama, kullanıcıların birbirleriyle anında etkileşim kurmasına olanak tanıyan bir yapı sunar ve sağlam bir mesaj kuyruğu yönetimi için Kafka'yı kullanır.

## Projenin Amacı

Bu chat uygulaması, kullanıcılar arasında hızlı ve etkili iletişim kurmayı sağlamak amacıyla geliştirilmiştir. WebSocket protokolü ile desteklenen uygulama, yüksek performans ve düşük gecikme ile gerçek zamanlı iletişim sunmaktadır. Uygulamada ayrıca Kafka kullanarak mesajların güvenilir bir şekilde kuyruğa alınmasını ve taşınmasını sağandı.

## Kullanılan Teknolojiler

### Backend
- Spring Boot
- WebSocket
- SockJS
- Kafka

### Frontend
- ReactJS

### Diğer Teknolojiler
- STOMP (Simple Text Oriented Messaging Protocol)

## Uygulama Mimarisi

Bu uygulama, istemci tarafında ReactJS ve WebSocket aracılığıyla sunucu ile iletişim kurar. Sunucu tarafında ise, Spring Boot ile bir WebSocket endpoint tanımlanmış ve Kafka kullanılarak mesaj kuyruğa alınarak güvenli bir iletim sağlanmıştır.

1. **Mesaj İletişimi:** İstemciden gelen mesajlar WebSocket üzerinden sunucuya iletilir. Sunucuda bu mesajlar Kafka'ya iletilir ve belirlenen topic (chat-global-topic) üzerinde işlenir.
2. **Mesaj Yayını:** Kafka üzerinde işlenen mesajlar, sunucu tarafında ilgili kullanıcıya veya gruba geri bildirilir.
3. **Kimlik Doğrulama:** Kullanıcılar, uygulamada işlem yapmadan önce JWT ile doğrulanır. Bu sayede sadece yetkili kullanıcılar chat özelliğini kullanabilir.
4. **Geriye Dönüş Mekanizması (SockJS):** Eğer WebSocket bağlantısı desteklenmiyorsa SockJS devreye girerek uygulamanın uyumluluğunu artırır.

## Öne Çıkan Özellikler

- **Gerçek Zamanlı İletişim:** WebSocket ve STOMP ile sağlanan anlık mesajlaşma özelliği.
- **Yüksek Performans ve Güvenilirlik:** Kafka entegrasyonu sayesinde mesajlar hızlı, güvenilir ve ölçeklenebilir bir şekilde iletilir.
- **JWT ile Güvenli Kimlik Doğrulama:** JSON Web Token kullanılarak güvenli bir oturum yönetimi sağlanır.
- **Esneklik ve Uyumluluk:** SockJS desteği sayesinde, tarayıcılar ve ağ kısıtlamalarıyla uyumlu.
- **Modüler ve Kolay Yönetilebilir Yapı:** Spring Boot ve ReactJS kullanılarak oluşturulan bu modüler yapı, genişletilebilirlik ve bakımı kolay hale getirir.
