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

import com.example.demo.dao.CourseRepository;
import com.example.demo.model.Course;

@RequestMapping("/courses")
@RestController
public class CourseController {
	
	private final CourseRepository courseRepository;

	public CourseController(CourseRepository courseRepository) {
		super();
		this.courseRepository = courseRepository;
	}
	
	@PostMapping
	public ResponseEntity<Course> addCourse(@RequestBody Course course){
		Course cor = courseRepository.save(course);
		return new ResponseEntity<Course>(cor,HttpStatus.CREATED);
		
	}
	@GetMapping("/{id}")
	public ResponseEntity<Course> findCourseById(@PathVariable("id") int id){
		Course course = courseRepository.findById(id).orElse(null);
		if(course==null) {
			return new ResponseEntity<Course>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Course>(course,HttpStatus.OK);	
	}
	@PutMapping
	public ResponseEntity<Course> updateCourse(@RequestBody Course course){
		
		Course cour = courseRepository.findById(course.getId()).orElse(null);
		if(cour==null) {
			return new ResponseEntity<Course>(HttpStatus.NOT_FOUND);
		}
		Course cour2 = courseRepository.save(course);
		return new ResponseEntity<Course>(cour2,HttpStatus.OK);
	}
	@DeleteMapping("/{id}")
	public  ResponseEntity<Void> deleteCourseById(@PathVariable("id")  int id){
		Course cour = courseRepository.findById(id).orElse(null);
		if(cour==null) {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		courseRepository.deleteById(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
	@GetMapping
	public ResponseEntity<List<Course>> findAllCourses(){
		List<Course> list = courseRepository.findAll();
		
		return new ResponseEntity<List<Course>>(list,HttpStatus.OK);
	}

}
