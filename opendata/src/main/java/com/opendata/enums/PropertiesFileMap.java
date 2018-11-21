package com.opendata.enums;

/**
 * 
 * <p>Title: com.opendata.enums.PropertiesFileMap</p>
 * <p>Description: 定義properties代稱 與 實體檔案位置</p>
 * <p>Copyright: (c) Copyright WebComm Corp. 2018. All Rights Reserved.</p>
 * <p>Company: WebComm Corp.</p>
 * @author Bill
 * @version 1.0
 * <p>Change history</p>
 */
public enum PropertiesFileMap {
	
	ACTION_LOG_PATH("log-path"),
	COUNTER_CONFIG("count-cfg"),
	FILE_PATH("file-path"),
	MAINTAIN_DATE("maintain-date");

	private String fileName;

	private PropertiesFileMap(String fileName) {
		this.fileName = fileName;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	
}
