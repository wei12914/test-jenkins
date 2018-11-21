package com.opendata.enums;

/**
 * 
 * <p>Title: com.opendata.enums.SqlFileMap</p>
 * <p>Description: 定義SQL代稱 與 實體SQL檔檔名</p>
 * <p>Copyright: (c) Copyright WebComm Corp. 2018. All Rights Reserved.</p>
 * <p>Company: WebComm Corp.</p>
 * @author Bill
 * @version 1.0
 * <p>Change history</p>
 */
public enum SqlFileMap {
	
	LICENSE("LicenseQuery"),
	LICENSE_LENGTH("LicenseQueryLength"),
	FUEL_COMP("FuelCompQuery"),
	PIPE_LIMIT("PerPipeLimitQuery"),
	COMMISSIONING("CommissioningQuery"),
	COMMISSIONING_LENGTH("CommissioningQueryLength"),
	DET_PIPE_LIST("DetPipeNoList"),
	DET_SEQ_LIST("DetSeqNoList"),
	DET_POSITION_LIST("DetPositionList"),
	DET_TYPE_LIST("DetTypeList"),
	EMISSIONS("emissionsQuery"),
	EMISSIONS_LENGTH("emissionsQueryLength"),
	MON_PIPE_LIST("MonPipeNoList"),
	MON_DATE_LIST("MonDateList"),
	PENALTY("PenaltyQuery"),
	PENALTY_LENGTH("PenaltyQueryLength"),
	UPDATE_COUNTER("UpdateCounter")
	;

	private String fileName;

	private SqlFileMap(String fileName) {
		this.fileName = fileName;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	
}
