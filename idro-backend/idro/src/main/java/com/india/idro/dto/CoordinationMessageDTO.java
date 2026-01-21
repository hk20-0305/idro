package com.india.idro.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinationMessageDTO {

    private String id;

    @NotBlank(message = "User name is required")
    private String user;

    @NotBlank(message = "Message is required")
    private String message;

    private String type;  // "normal" or "warning"

    private String time;

    private LocalDateTime createdAt;
}