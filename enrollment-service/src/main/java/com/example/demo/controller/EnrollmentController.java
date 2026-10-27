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
import com.example.demo.client.StudentClient;
import com.example.demo.dao.EnrollmentRepository;
import com.example.demo.dto.CourseDto;
import com.example.demo.dto.StudentDto;
import com.example.demo.model.Enrollment;

@RequestMapping("/enrollments")
@RestController
public class EnrollmentController {
	
	private final EnrollmentRepository enrollmentRepository;
	private final StudentClient studentClient;
	private final CourseClient courseClient;
	public EnrollmentController(EnrollmentRepository enrollmentRepository, StudentClient studentClient,
			CourseClient courseClient) {
		super();
		this.enrollmentRepository = enrollmentRepository;
		this.studentClient = studentClient;
		this.courseClient = courseClient;
	}
	@PostMapping
	public ResponseEntity<Enrollment> addEnrollment(@RequestParam ("studentId") int studentId, @RequestParam("courseId") int courseId, @RequestParam("status") String status){
	try {
	ResponseEntity<StudentDto> student = studentClient.findStudentByIdDto(studentId);
	if(student == null) {
		return new ResponseEntity<Enrollment>(HttpStatus.NOT_FOUND);
	}
	ResponseEntity<CourseDto> course = courseClient.findCourseById(courseId);
	if(course==null) {
		return new ResponseEntity<Enrollment>(HttpStatus.NOT_FOUND);
	}
	}
	catch(Exception e) {
		return new ResponseEntity<Enrollment>(HttpStatus.NOT_FOUND);
	}
	
	Enrollment enroll1 = new Enrollment();
	enroll1.setStudentId(studentId);
	enroll1.setCourseId(courseId);
	enroll1.setEnrollmentDate(LocalDate.now());
	enroll1.setStatus(status);
	Enrollment enroll2 = enrollmentRepository.save(enroll1);
	return new ResponseEntity<Enrollment>(enroll2,HttpStatus.CREATED);
	}
	@GetMapping("/{id}")
	public ResponseEntity<Enrollment> findEnrollment(@PathVariable("id") int id){
		Enrollment enroll = enrollmentRepository.findById(id).orElse(null);
		if(enroll==null) {
			return new ResponseEntity<Enrollment>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Enrollment>(enroll,HttpStatus.OK);
	}
	@PutMapping
	public ResponseEntity<Enrollment> updateEnroll(@RequestBody Enrollment enroll){
		Enrollment enroll2 = enrollmentRepository.findById(enroll.getId()).orElse(null);
		
		if(enroll2==null) {
			return new ResponseEntity<Enrollment>(HttpStatus.NOT_FOUND);
		}
		try {
			ResponseEntity<StudentDto> student = studentClient.findStudentByIdDto(enroll.getStudentId());
			if(student == null) {
				return new ResponseEntity<Enrollment>(HttpStatus.NOT_FOUND);
			}
			ResponseEntity<CourseDto> course = courseClient.findCourseById(enroll.getCourseId());
			if(course==null) {
				return new ResponseEntity<Enrollment>(HttpStatus.NOT_FOUND);
			}
			}
			catch(Exception e) {
				return new ResponseEntity<Enrollment>(HttpStatus.NOT_FOUND);
			}
		
		Enrollment enroll3 = enrollmentRepository.save(enroll);
		return new ResponseEntity<Enrollment>(enroll3,HttpStatus.OK);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteEnroll(@PathVariable ("id") int id){
		
		Enrollment enroll = enrollmentRepository.findById(id).orElse(null);
		if(enroll==null) {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		enrollmentRepository.deleteById(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		
	}
	@GetMapping
	public ResponseEntity<List<Enrollment>> findAll(){
		List<Enrollment> list = enrollmentRepository.findAll();
		return new ResponseEntity<List<Enrollment>>(list,HttpStatus.OK);
	}

}


