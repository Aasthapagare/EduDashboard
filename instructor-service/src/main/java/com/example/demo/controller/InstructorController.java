package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.InstructorRepository;
import com.example.demo.model.Instructor;

@RequestMapping("/instructors")
@RestController
public class InstructorController {
	
	private final InstructorRepository instructorRepository;

	public InstructorController(InstructorRepository instructorRepository) {
		super();
		this.instructorRepository = instructorRepository;
	}
	@PostMapping
	public ResponseEntity<Instructor> addInstructor(@RequestBody Instructor instructor){
		Instructor ins = instructorRepository.save(instructor);
		return new ResponseEntity<Instructor>(ins,HttpStatus.CREATED);
	}
	@GetMapping("/{id}")
	public ResponseEntity<Instructor> findInstructorById(@PathVariable("id") int id){
		
		Instructor ins = instructorRepository.findById(id).orElse(null);
		if(ins==null) {
			return new ResponseEntity<Instructor>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Instructor>(ins,HttpStatus.OK);
	}
	@PutMapping
	public ResponseEntity<Instructor> updateInstructor(@RequestBody Instructor ins){
		
		Instructor ins2 = instructorRepository.findById(ins.getId()).orElse(null);
		if(ins2==null) {
			return new ResponseEntity<Instructor>(HttpStatus.NOT_FOUND);
		}
		Instructor ins3 = instructorRepository.save(ins);
		return new ResponseEntity<Instructor>(ins3,HttpStatus.OK);
		
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteInstructor(@PathVariable("id") int id){
		Instructor ins = instructorRepository.findById(id).orElse(null);
		if(ins==null) {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		instructorRepository.deleteById(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
	@GetMapping
	public ResponseEntity<List<Instructor>> findAllInstructor(){
		List<Instructor> list = instructorRepository.findAll();
		return new ResponseEntity<List<Instructor>>(list,HttpStatus.OK);
	}
}
