package com.opendata.vo;

import lombok.Data;

@Data
public class AprFileVo {
	
	private String facNo;

	private String aplNo;

	private String fileName;
	
	private byte[] fileContent;
}
