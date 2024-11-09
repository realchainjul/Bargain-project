package com.harvest.bagain;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

public class BagainFileNameGenerator {
	
	public static String generate(MultipartFile mf) {
		String fileName = mf.getOriginalFilename();
		String type = fileName.substring(fileName.lastIndexOf("."));
		fileName = fileName.replace(type, "");
		String uuid = UUID.randomUUID().toString(); 
		return fileName + "_" + uuid + type;
	}
}
