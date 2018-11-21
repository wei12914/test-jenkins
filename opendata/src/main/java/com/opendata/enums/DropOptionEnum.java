package com.opendata.enums;

/**
 * 
 * <p>Title: com.opendata.enums.DropOptionEnum</p>
 * <p>Description: 共用項目定義ENUM</p>
 * <p>Copyright: (c) Copyright WebComm Corp. 2018. All Rights Reserved.</p>
 * <p>Company: WebComm Corp.</p>
 * @author Bill
 * @version 1.0
 * <p>Change history</p>
 */
public enum DropOptionEnum {
	/** 專責人員-等級 */
	SUPERVISOR_LEVEL("C1"),
	/** 專責人員-類別 */
	SUPERVISOR_KIND("SupervisorKind"),
	/** 燃料使用使用證-單位 */
	FUEL_UNIT("CUnit"),
	/** 核定成份代碼 */
	FUEL_COMP("Composition"),
	/** 製程、主要設備及排放口 CEMS設置 */
	EQUIP_MONITOR("Cems"),
	/** 檢測位置 */
	Detect_Position("DetectPosition"),
	/** 檢測類別 */
	Detect_Type("DetectType")
	;

	private String value;

	private DropOptionEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
