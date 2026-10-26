package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.StudentRepository;
import com.example.demo.model.Student;

@RequestMapping("/students")
@RestController
public class StudentController {
	
	private final StudentRepository studentRepository;

	public StudentController(StudentRepository studentRepository) {
		super();
		this.studentRepository = studentRepository;
	}
	@PostMapping
	public ResponseEntity<Student> addStudent(@RequestBody Student student) {
		Student stu = studentRepository.save(student);
		return new ResponseEntity<Student>(stu,HttpStatus.CREATED);
	}
	@GetMapping("/{id}")
	public ResponseEntity<Student> findStudentById(@PathVariable("id") int id) {
		Student stu =  studentRepository.findById(id).orElse(null);
		if(stu==null) {
			return new ResponseEntity<Student>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Student>(stu,HttpStatus.OK);
	}
	@PutMapping
	public ResponseEntity<Student> updateStudent(@RequestBody Student student) {
		Student stu =  studentRepository.findById(student.getId()).orElse(null);
		if(stu==null) {
			return new ResponseEntity<Student>(HttpStatus.NOT_FOUND);
		}
		Student stu2 = studentRepository.save(student);
		return new ResponseEntity<Student>(stu2,HttpStatus.CREATED);
		
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteStudentById(@PathVariable("id") int id) {
		Student stu = studentRepository.findById(id).orElse(null);
		if(stu==null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		studentRepository.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	@GetMapping
	public ResponseEntity<List<Student>> findAllStudents(){
		List<Student> list = studentRepository.findAll();
		return new ResponseEntity<List<Student>>(list,HttpStatus.OK);
	}

}
