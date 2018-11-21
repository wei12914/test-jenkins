package com.opendata.enums;

/**
 * 
 * <p>Title: com.opendata.enums.SpecialDropEnum</p>
 * <p>Description: 不存在共用選項的 項目，需額外定義於此</p>
 * <p>Copyright: (c) Copyright WebComm Corp. 2018. All Rights Reserved.</p>
 * <p>Company: WebComm Corp.</p>
 * @author Bill
 * @version 1.0
 * <p>Change history</p>
 */
public enum SpecialDropEnum {
	/** 燃料-類別代碼 */
	FUEL_CLASS("FUEL_CLASS")
	;

	private String value;

	private SpecialDropEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
