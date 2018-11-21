package com.opendata.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * <p>Title: com.opendata.controller.CommonController</p>
 * <p>Description: 共用模組controller</p>
 * <p>Copyright: (c) Copyright WebComm Corp. 2018. All Rights Reserved.</p>
 * <p>Company: WebComm Corp.</p>
 * @author Bill
 * @version 1.0
 * <p>Change history</p>
 */
@RestController
@RequestMapping(path = "rest/common")
public class CommonController {
	
	/**
	 * 取得縣市選項
	 * @author David
	 *
	 * @return
	 */
	@RequestMapping(path = "/getCityOptions", method = RequestMethod.POST)
	public void getCityOptions() {
		//
	}
	
}
