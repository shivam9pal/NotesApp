package com.example.NotesApp.controller;

import com.example.NotesApp.models.Note;
import com.example.NotesApp.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }


    @PostMapping
    public ResponseEntity<Note> create(@Valid @RequestBody Note note) {
        try {
            Note createdNote = noteService.create(note);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @GetMapping
    public ResponseEntity<List<Note>> getAll() {
        try {
            List<Note> notes = noteService.getAllForCurrentUSer();
            return ResponseEntity.ok(notes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Note> getById(@PathVariable Long id) {
        try {
            Note note = noteService.getById(id);
            return ResponseEntity.ok(note);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Access Denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Note> update(@PathVariable Long id, @RequestBody Note note) {
        try {
            Note updatedNote = noteService.update(id, note);
            return ResponseEntity.ok(updatedNote);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Access Denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            if (e.getMessage().contains("not Found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            noteService.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Access Denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @GetMapping("/share/{shareId}")
    public ResponseEntity<Note> getByShareId(@PathVariable String shareId) {
        try {
            Note note = noteService.getByShareId(shareId);
            return ResponseEntity.ok(note);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PostMapping("/{id}/share")
    public ResponseEntity<ShareResponse> generateShareUrl(@PathVariable Long id) {
        try {
            Note note = noteService.getById(id);
            String shareUrl = "/api/notes/share/" + note.getShareId();
            return ResponseEntity.ok(new ShareResponse(shareUrl, note.getShareId()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Access Denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    public record ShareResponse(String shareUrl, String shareId) {}
}