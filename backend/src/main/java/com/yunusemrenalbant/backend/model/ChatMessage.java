package com.yunusemrenalbant.backend.model;


import com.yunusemrenalbant.backend.enums.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private LocalDateTime time;
}


