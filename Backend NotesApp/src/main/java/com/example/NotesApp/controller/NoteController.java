package com.example.NotesApp.controller;


import com.example.NotesApp.models.Note;
import com.example.NotesApp.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {


    private NoteService noteService;

    public NoteController(NoteService noteService){
        this.noteService=noteService;
    }


    @PostMapping
    public Note  create(@RequestBody Note note){
           return noteService.create(note);
    }

    @GetMapping
    public List<Note> getAll(){
        return noteService.getAllForCurrentUSer();
    }

    @GetMapping("/{id}")
    public Note getById(@PathVariable Long id){
        return  noteService.getById(id);
    }

    @PutMapping("/{id}")
    public Note update(@PathVariable Long id,@RequestBody Note note){
            return noteService.update(id,note);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        noteService.delete(id);
    }

    @GetMapping("/share/{shareId}")
    public Note getByShareId(@PathVariable String shareId){
       return noteService.getByShareId(shareId);
    }


}
