package com.example.chat.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class Message {
    
    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private Status status;

}
