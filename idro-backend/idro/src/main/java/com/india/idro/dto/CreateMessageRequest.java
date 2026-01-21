package com.india.idro.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMessageRequest {

    @NotBlank(message = "User name is required")
    private String user;

    @NotBlank(message = "Message content is required")
    private String message;

    private String type;  // "normal" or "warning" (defaults to "normal")
}