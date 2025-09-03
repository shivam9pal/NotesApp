package com.example.NotesApp.service;

import com.example.NotesApp.models.Note;
import com.example.NotesApp.models.Users;
import com.example.NotesApp.repository.NoteRepository;
import com.example.NotesApp.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    private NoteRepository noteRepository;
    private UserRepository userRepository;

    public NoteService(NoteRepository noteRepository,UserRepository userRepository){
        this.userRepository=userRepository;
        this.noteRepository=noteRepository;
    }

    private Users getCurrentUser(){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        String username= auth.getName();
        return userRepository.findByUsername(username).orElseThrow(()-> new RuntimeException("USer Not Found"));
    }

    public Note create( Note note){
        Users user=getCurrentUser();
        note.setUser(user);
        note.ensureShareId();
        return noteRepository.save(note);
    }

    public List<Note> getAllForCurrentUSer(){
        return noteRepository.findAllByUser(getCurrentUser());
    }
    public Note getById(Long id){
        Note note=noteRepository.findById(id).orElseThrow(()->new RuntimeException("Note not Found"));
        if(!note.getUser().getId().equals(getCurrentUser().getId())){
            throw new RuntimeException("Access Denied");
        }
        return note;
    }


    public Note update(Long id,Note note){
        Note note1=getById(id);
        note1.setTitle(note.getTitle());
        note1.setContent(note.getContent());
        return noteRepository.save(note1);
    }

    public void delete(Long id){
        Note note=getById(id);
        noteRepository.delete(note);
    }

    public Note getByShareId(String shareId){
        return noteRepository.findByShareId(shareId).orElseThrow(()->new RuntimeException("Shared Note doesn't found"));
    }



}
