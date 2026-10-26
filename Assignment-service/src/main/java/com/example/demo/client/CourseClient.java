package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.dto.CourseDto;

@FeignClient("course-service")
public interface CourseClient {
	@GetMapping("/courses/{id}")
	public ResponseEntity<CourseDto> findCourseById(@PathVariable("id") int id);
}