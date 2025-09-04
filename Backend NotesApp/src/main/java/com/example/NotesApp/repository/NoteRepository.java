package com.example.NotesApp.repository;

import com.example.NotesApp.models.Note;
import com.example.NotesApp.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note,Long> {
    Optional<Note> findByShareId(String shareId);
    List<Note> findAllByUserOrderByCreatedAtDesc(Users users);
}
