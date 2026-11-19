package com.taskmanagement.service;

import com.taskmanagement.entity.Task;
import com.taskmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> findAll() {
        return taskRepository.findAllByOrderByDisplayOrderAscCreatedAtAsc();
    }


    @Transactional
    public Task create(Task task) {
        return taskRepository.save(task);
    }


    @Transactional
    public Task update(String id, Task updated) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id));
        task.setTitle(updated.getTitle());
        task.setStatus(updated.getStatus());
        task.setCategory(updated.getCategory());
        task.setMemo(updated.getMemo());
        task.setDisplayOrder(updated.getDisplayOrder());
        task.setPriority(updated.getPriority());
        task.setDueDate(updated.getDueDate());
        return task;
    }

    @Transactional
    public void delete(String id) {
        taskRepository.deleteById(id);
    }
}
