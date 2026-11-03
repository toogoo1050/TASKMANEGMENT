package com.taskmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
public class Task {

    @Id
    @Column(length = 36)
    private String id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String status = "todo"; // "todo" / "doing" / "done"

    private String category;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Integer displayOrder = 0;

    @PrePersist
    private void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
