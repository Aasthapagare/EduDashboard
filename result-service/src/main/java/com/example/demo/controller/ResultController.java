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
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.client.AssignmentClient;
import com.example.demo.client.EnrollmentClient;
import com.example.demo.client.StudentClient;
import com.example.demo.dao.ResultRepository;
import com.example.demo.dto.AssignmentDto;
import com.example.demo.dto.EnrollmentDto;
import com.example.demo.dto.StudentDto;
import com.example.demo.model.Result;

@RequestMapping("/results")
@RestController
public class ResultController {
	
	private final ResultRepository resultRepository;
	private final AssignmentClient assignmentClient;
	private final EnrollmentClient enrollmentClient;
	private final StudentClient studentClient;
	public ResultController(ResultRepository resultRepository, AssignmentClient assignmentClient,
			EnrollmentClient enrollmentClient, StudentClient studentClient) {
		super();
		this.resultRepository = resultRepository;
		this.assignmentClient = assignmentClient;
		this.enrollmentClient = enrollmentClient;
		this.studentClient = studentClient;
	}
	
	@PostMapping
	public ResponseEntity<Result> addResult(@RequestBody Result result){
		try {
			ResponseEntity<StudentDto> stu = studentClient.findStudentById(result.getStudentId());
			ResponseEntity<AssignmentDto> ass = assignmentClient.findAssignById(result.getAssignmentId());
			ResponseEntity<EnrollmentDto> enroll = enrollmentClient.findEnrollById(result.getEnrollmentId());
		}
		catch(Exception e) {
			return new ResponseEntity<Result>(HttpStatus.NOT_FOUND);
		}
		Result res = resultRepository.save(result);
		return new ResponseEntity<Result>(res, HttpStatus.CREATED);
		
	}
	@GetMapping("/{id}")
	public ResponseEntity<Result> findById(@PathVariable("id") int id){
		
		Result res = resultRepository.findById(id).orElse(null);
		if(res==null) {
			return new ResponseEntity<Result>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Result>(res,HttpStatus.OK);
		
	}
	@PutMapping
	public ResponseEntity<Result> update(@RequestBody Result result){
		Result res = resultRepository.findById(result.getId()).orElse(null);
		if(res==null) {
			return new ResponseEntity<Result>(HttpStatus.NOT_FOUND);
		}
		try {
			ResponseEntity<StudentDto> stu = studentClient.findStudentById(result.getStudentId());
			ResponseEntity<AssignmentDto> ass = assignmentClient.findAssignById(result.getAssignmentId());
			ResponseEntity<EnrollmentDto> enroll = enrollmentClient.findEnrollById(result.getEnrollmentId());
		}
		catch(Exception e) {
			return new ResponseEntity<Result>(HttpStatus.NOT_FOUND);
		}
		Result res2 = resultRepository.save(result);
		
		return new ResponseEntity<Result>(res2,HttpStatus.OK);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") int id){
		
		Result res = resultRepository.findById(id).orElse(null);
		if(res==null) {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		resultRepository.deleteById(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		
	}
	@GetMapping
	public ResponseEntity<List<Result>> findall(){
		List<Result> list = resultRepository.findAll();
		return new ResponseEntity<List<Result>>(list, HttpStatus.OK);
	}

}
