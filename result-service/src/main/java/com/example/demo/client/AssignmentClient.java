package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.dto.AssignmentDto;

@FeignClient(name = "Assignment-service")
public interface AssignmentClient {
	@GetMapping("/assignments/{id}")
	public ResponseEntity<AssignmentDto> findAssignById(@PathVariable("id") int  id);

}
