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

import com.example.demo.client.EnrollmentClient;
import com.example.demo.client.StudentClient;
import com.example.demo.dao.PaymentRepository;
import com.example.demo.dto.EnrollmentDto;
import com.example.demo.dto.StudentDto;
import com.example.demo.model.Payment;

@RequestMapping("/payments")
@RestController
public class PaymentController {
	
	private final PaymentRepository paymentRepository;
	private final StudentClient studentClient;
	private final EnrollmentClient enrollmentClient;
	public PaymentController(PaymentRepository paymentRepository, StudentClient studentClient,
			EnrollmentClient enrollmentClient) {
		super();
		this.paymentRepository = paymentRepository;
		this.studentClient = studentClient;
		this.enrollmentClient = enrollmentClient;
	}
	@PostMapping
	public ResponseEntity<Payment> addPayment(@RequestParam ("studentId")int studentId, @RequestParam("enrollmentId") int enrollmentId, @RequestParam("ammount") int ammount,@RequestParam("status") String status){
		try {
			ResponseEntity<StudentDto> stu = studentClient.findStudentByIdDto(studentId);
			ResponseEntity<EnrollmentDto> enroll = enrollmentClient.findEnrollmentByIdDto(enrollmentId);
		}
		catch(Exception e) {
			return new ResponseEntity<Payment>(HttpStatus.NOT_FOUND);
		}
		Payment pay = new Payment();
		pay.setStudentId(studentId);
		pay.setEnrollmentId(enrollmentId);
		pay.setAmount(ammount);
		pay.setPaymentDate(LocalDate.now());
		pay.setStatus(status);
		Payment pay2 = paymentRepository.save(pay);
		return new ResponseEntity<Payment>(pay2,HttpStatus.CREATED);
	}
	@GetMapping("/{id}")
	public ResponseEntity<Payment> findPayment(@PathVariable("id")int id){
		Payment pay = paymentRepository.findById(id).orElse(null);
		if(pay==null) {
			return new ResponseEntity<Payment>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Payment>(pay,HttpStatus.OK);
		
	}
	@PutMapping
	public ResponseEntity<Payment> update(@RequestBody Payment pay){
		Payment pay2 = paymentRepository.findById(pay.getId()).orElse(null);
		if(pay2==null) {
			return new ResponseEntity<Payment>(HttpStatus.NOT_FOUND);
		}
		try {
			ResponseEntity<StudentDto> stu = studentClient.findStudentByIdDto(pay.getStudentId());
			ResponseEntity<EnrollmentDto> enroll = enrollmentClient.findEnrollmentByIdDto(pay.getEnrollmentId());
		}
		catch(Exception e) {
			return new ResponseEntity<Payment>(HttpStatus.NOT_FOUND);
		}
		pay.setPaymentDate(LocalDate.now());
		Payment pay3 = paymentRepository.save(pay);
		return new ResponseEntity<Payment>(pay3,HttpStatus.OK);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePayment(@PathVariable ("id") int id){
		
		Payment pay = paymentRepository.findById(id).orElse(null);
		if(pay== null) {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		paymentRepository.deleteById(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
	@GetMapping
	public ResponseEntity<List<Payment>> findAll(){
		List<Payment> list = paymentRepository.findAll();
		return new ResponseEntity<List<Payment>>(list,HttpStatus.OK);
	}

}
