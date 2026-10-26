package com.example.demo.controller;

import java.time.LocalDate;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.client.CourseClient;
import com.example.demo.client.InstructorClient;
import com.example.demo.dao.AssignmentRepository;
import com.example.demo.dto.CourseDto;
import com.example.demo.dto.InstructorDto;
import com.example.demo.model.Assignment;

@RequestMapping("/assignments")
@RestController
public class AssignmentController {
	
	private final AssignmentRepository assignmentRepository;
	private final InstructorClient instructorClient;
	private final CourseClient courseClient;
	public AssignmentController(AssignmentRepository assignmentRepository, InstructorClient instructorClient,
			CourseClient courseClient) {
		super();
		this.assignmentRepository = assignmentRepository;
		this.instructorClient = instructorClient;
		this.courseClient = courseClient;
	}
	@PostMapping
	public ResponseEntity<Assignment> addAssignment(@RequestBody Assignment assignment){
		try {
			ResponseEntity<CourseDto> course = courseClient.findCourseById(assignment.getCourseId());
			ResponseEntity<InstructorDto> ins = instructorClient.findInstructorById(assignment.getInstructorId());
		}
		catch(Exception e){
			return new ResponseEntity<Assignment>(HttpStatus.NOT_FOUND);
		}
		assignment.setDueDate(LocalDate.of(2026, 9, 10));
		Assignment assign = assignmentRepository.save(assignment);
		return new ResponseEntity<Assignment>(assign, HttpStatus.CREATED);
	}
	@GetMapping("/{id}")
	public ResponseEntity<Assignment> findById(@PathVariable("id") int id){
		Assignment assign = assignmentRepository.findById(id).orElse(null);
		if(assign==null) {
			return new ResponseEntity<Assignment>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Assignment>(assign,HttpStatus.OK);
		
	}
	@PutMapping
	public ResponseEntity<Assignment> update(@RequestBody Assignment assign){
		Assignment assign2 = assignmentRepository.findById(assign.getId()).orElse(null);
		if(assign2==null) {
			return new ResponseEntity<Assignment>(HttpStatus.NOT_FOUND);
		}
		try {
			ResponseEntity<CourseDto> course = courseClient.findCourseById(assign.getCourseId());
			ResponseEntity<InstructorDto> ins = instructorClient.findInstructorById(assign.getInstructorId());
		}
		catch(Exception e){
			return new ResponseEntity<Assignment>(HttpStatus.NOT_FOUND);
		}
		assign.setDueDate(LocalDate.of(2026, 10, 10));
		Assignment assign3 = assignmentRepository.save(assign);
		return new ResponseEntity<Assignment>(assign3, HttpStatus.OK);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteAssignment(@PathVariable("id") int id){
		Assignment assign = assignmentRepository.findById(id).orElse(null);
		if(assign==null) {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		
		assignmentRepository.deleteById(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		
		
	}
	@GetMapping
	public ResponseEntity<List<Assignment>> findAll(){
		List<Assignment> list = assignmentRepository.findAll();
		return new ResponseEntity<List<Assignment>>(list,HttpStatus.OK);
	}
}
