package com.opendata.form;

import lombok.Data;

@Data
public class CommissioningQueryForm {
	
	/** 縣市 */
	private String cityCode;
	/** 管編或廠名 */
	private String factoryName;
	/** 位移量 */
	private int offset;
	/** 筆數 */
	private int pageSize;
	/** 當前頁數 */
	private int currentPage;
	/** 排序欄位 */
	private String sortDirection;
	/** 排序方向 */
	private String sortValue;
}
