sap.ui.define([], function () {
	"use strict";

	// return {

	// 	/**
	// 	 * Rounds the number unit value to 2 digits
	// 	 * @public
	// 	 * @param {string} sValue the number string to be rounded
	// 	 * @returns {string} sValue with 2 digits rounded
	// 	 */
	// 	numberUnit : function (sValue) {
	// 		if (!sValue) {
	// 			return "";
	// 		}
	// 		return parseFloat(sValue).toFixed(2);
	// 	}

	// };
	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */

		getMessageType: function (type) {
			if (type === "E") {
				return "Error";
			} else if (type === "S") {
				return "Success";
			} else if (type === "W") {
				return "Warning";
			} else {
				return "None";
			}
		},
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		parseQualification: function (d) {
			if (d === "S" || d === "C" || d === "QP") {
				return true;
			} else {
				return false;
			}

		},

		numberCheck: function (n) {
			if (n === "") {
				return "0.0";
			} else {
				return n;
			}
		},
		title: function (a, c) {
			if (a === "" || c === "" || c === '0') return "";

			else return a + " " + "(" + c + ")";
		},
		iconFormatter: function (v) {
			if (v === "" || v === null || v === undefined) return "";
			if (v === 'MASS') return "sap-icon://approvals";

			else return "";
		},

		visibility: function (v, V) {
			if ((v === undefined || v === "" || v === null || v === "|#|" || v === "|#-#|") && (V === undefined || V === "" || V === null || v ===
					"|#|" || v === "|#-#|")) {
				return false;
			} else {
				return true;
			}
		},

		_timeConvert: function (t) {
			if (t) {
				var time = t.split(":");
				var hr = time[0];
				var min = time[1];
				var sec = time[2];

				if (hr.length === 1) {
					hr = "0" + hr;
				}
				if (min.length === 1) {
					min = "0" + min;
				}
				if (sec.length === 1) {
					sec = "0" + sec;
				}
				var ft = "PT" + hr + "H" + min + "M" + sec + "S";
			} else {
				var ft = "PT00H00M00S";
			}
			return ft;
		},

		EntityText: function (a, c) {
			if (a === 'CREATE' && c === '183') {
				return this.getView().getModel("i18n").getProperty("NewEquipment");
			} else if (a === 'CHANGE' && c === '183') {
				return this.getView().getModel("i18n").getProperty("ChangedEquipment");
			} else if (a === 'CREATE' && c === '237') {
				return this.getView().getModel("i18n").getProperty("NEWMBOM");
			} else if (a === 'CHANGE' && c === '237') {
				return this.getView().getModel("i18n").getProperty("ChangedMBOM");
			} else if (a === 'CREATE' && c === '185') {
				return this.getView().getModel("i18n").getProperty("NewFloc");
			} else if (a === 'CHANGE' && c === '185') {
				return this.getView().getModel("i18n").getProperty("ChangedFloc");
			} else if (a === 'CREATE' && c === '1223') {
				return this.getView().getModel("i18n").getProperty("NewMPlan");
			} else if (a === 'CHANGE' && c === '1223') {
				return this.getView().getModel("i18n").getProperty("ChangedMPlan");
			} else if (a === 'CREATE' && c === '1230') {
				return this.getView().getModel("i18n").getProperty("NewMsPoint");
			} else if (a === 'CHANGE' && c === '1230') {
				return this.getView().getModel("i18n").getProperty("ChangedMsPoint");
			} else if (a === 'CREATE' && c === '493') {
				return this.getView().getModel("i18n").getProperty("NewWc");
			} else if (a === 'CHANGE' && c === '493') {
				return this.getView().getModel("i18n").getProperty("ChangedWc");
			} else if (a === 'CREATE' && c === '/UGI/TLFL') {
				return this.getView().getModel("i18n").getProperty("NewTLF");
			} else if (a === 'CHANGE' && c === '/UGI/TLFL') {
				return this.getView().getModel("i18n").getProperty("ChangedTLF");
			} else if (a === 'CREATE' && c === '/UGI/TLEQ') {
				return this.getView().getModel("i18n").getProperty("NewTLEQ");
			} else if (a === 'CHANGE' && c === '/UGI/TLEQ') {
				return this.getView().getModel("i18n").getProperty("ChangedTLEQ");
			} else if (a === 'CREATE' && c === '/UGI/TL') {
				return this.getView().getModel("i18n").getProperty("NewTLG");
			} else if (a === 'CHANGE' && c === '/UGI/TL') {
				return this.getView().getModel("i18n").getProperty("ChangedTLG");
			} else if (a === 'CREATE' && c === "DRF_0038") {
				return this.getView().getModel("i18n").getProperty("NewON");
			} else if (a === 'CHANGE' && c === "DRF_0038") {
				return this.getView().getModel("i18n").getProperty("ChangedON");
			} else if (a === 'CHANGE' && c === "DRF_0039") {
				return this.getView().getModel("i18n").getProperty("ChangedOL");
			} else if (a === 'CREATE' && c === 'DRF_0039') {
				return this.getView().getModel("i18n").getProperty("NewOL");
			}
		},

		requestedBy: function (c) {
			if (c === "" || c === null || c === undefined) return "";
			else return this.getView().getModel("i18n").getProperty("RequestedBy") + ": " + c;
		},
		indicatorCheck: function (v) {
			if (v) {
				return "X";
			} else {
				return "";
			}
		},
		typeCheck: function (v) {

			if (v) {

				var temp = "";
				if (typeof v === "boolean") {
					return v;
				} else if (typeof v === "string") {

					if (v.indexOf("false") > -1) {
						temp = false;
					} else if (v.indexOf("true") > -1) {
						temp = true;
					} else if (v.indexOf("X") > -1) {
						temp = true;
					} else {
						temp = false;
					}

					return temp;
				}
			} else {
				return false;
			}
		},

		Date: function (v) {
			if (v) {
				return sap.ca.ui.model.format.DateFormat.getDateInstance().format(v);
			} else {
				return "";
			}
		},

		convertDate: function (v) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd/MM/yyyy"
			});
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;

			// format date and time to strings offsetting to GMT
			var dateStr = dateFormat.format(new Date(v.getTime() + TZOffsetMs));
		},

		dateFormat: function (date) {
			if (date !== "" && date !== null && date !== undefined) {
				var i = new Date(date);
				var j = i.getDate();
				var l = i.getMonth() + 1;
				var y = i.getFullYear();
				if (j < 10) {
					j = '0' + j;
				}
				if (l < 10) {
					l = '0' + l;
				}
				return l + '/' + j + '/' + y;
			} else {
				return "";
			}
		},

		isValidDate: function (date) {
			var valid = true;
			date = date.replace('/-/g', '');

			var month = parseInt(date.substring(0, 2), 10);
			var day = parseInt(date.substring(3, 5), 10);
			var year = parseInt(date.substring(6, 10), 10);

			if ((month < 1) || (month > 12)) {
				valid = false;
			} else if ((day < 1) || (day > 31)) {
				valid = false;
			} else if (((month === 4) || (month === 6) || (month === 9) || (month === 11)) && (day > 30)) {
				valid = false;
			} else if ((month === 2) && (((year % 400) === 0) || ((year % 4) === 0)) && ((year % 100) !== 0) && (day > 29)) {
				valid = false;
			} else if ((month === 2) && ((year % 100) === 0) && (day > 29)) {
				valid = false;
			} else if ((month === 2) && (day > 28)) {
				valid = false;
			}
			return valid;
		},

		currentDate: function () {
			var newDate = "";
			var date = new Date();
			var yyyy = date.getFullYear();
			var mm = date.getMonth() + 1;
			if (mm < 10) {
				mm = "0" + mm;
			}
			var dd = date.getDate();
			if (dd < 10) {
				dd = "0" + dd;
			}

			newDate = mm + "/" + dd + "/" + yyyy;
			return newDate;
		},
		PendingCRIconSet: function (sValue) {
			if (sValue) {
				return "sap-icon://fob-watch";
			} else {
				return "";
			}
		},

		//To set REQUIRED property of labels
		statusCheckLBL: function (status) {
			if (status === "+") {
				return true;
			} else if (status === "." || status === "-") {
				return false;
			}
		},

		statusCheck: function (status) {
			if (status === ".") {
				return true;
			} else if (status === "+" || status === "-") {
				return false;
			}

		},

		statusSel: function (s) {
			if (s === "X") {
				return true;
			} else {
				return false;
			}
		},

		revSatusSel: function (s) {
			if (s === true) {
				return "X";
			} else {
				return false;
			}
		},
		typeCheckObject: function (t) {
			if (t === "E") {
				return "Equipment";
			} else if (t === "T") {
				return "Functional Location";
			} else {
				return "";
			}
		},

		typeCheck2: function (v) {
			if (v) {
				var temp = "";
				if (typeof v === "boolean") {
					return v;
				} else if (typeof v === "string") {

					if (v.indexOf("false") > -1) {
						temp = false;
					} else if (v.indexOf("true") > -1) {
						temp = true;
					} else if (v.indexOf("X") > -1) {
						temp = true;
					} else {
						temp = false;
					}

					return temp;
				}
			} else {
				return false;
			}
		},
		status: function (s) {
			if (s === "1") {
				return "sap-icon://fob-watch";
			} else {
				return "";
			}
		},

		_formatDate: function (keyDate) {
			if (keyDate !== null) {
				var formatDate = "";
				var date = new Date(keyDate);
				var yyyy = date.getFullYear();
				var mm = date.getMonth() + 1;
				if (mm < 10) {
					mm = "0" + mm;
				}
				var dd = date.getDate();
				if (dd < 10) {
					dd = "0" + dd;
				}
				var hh = date.getHours();
				if (hh < 10) {
					hh = "0" + hh;
				}
				var min = date.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				var ss = date.getSeconds();
				if (ss < 10) {
					ss = "0" + ss;
				}
				formatDate = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + min + ":" + ss;
				return formatDate;
			} else {
				return keyDate;
			}
		},

		getDateFormat: function (_date) {
			if (_date !== "" && _date !== null && _date !== undefined) {
				var formatDate = "";
				var date = new Date(_date);
				var yyyy = date.getFullYear();
				var mm = date.getMonth();
				if (mm < 10) {
					mm = mm + 1;
					if (mm.length === 1) {
						mm = "0" + mm;
					}
				} else {
					mm = mm + 1;
				}
				var dd = date.getDate();
				if (dd < 10) {
					dd = "0" + dd;
				}
				var hh = date.getHours();
				if (hh < 10) {
					hh = "0" + hh;
				}
				var min = date.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				var ss = date.getSeconds();
				if (ss < 10) {
					ss = "0" + ss;
				}
				formatDate = mm + "/" + dd + "/" + yyyy;
				return formatDate;
			} else if (_date === null) {
				return null;
			}
		},

		getCurrentTime: function () {
			var date = new Date();
			var hh = date.getHours();
			if (hh < 10) {
				hh = "0" + hh;
			}
			var min = date.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			var ss = date.getSeconds();
			if (ss < 10) {
				ss = "0" + ss;
			}

			return hh + ":" + min + ":" + ss;
		},

		getTime: function (time) {
			if (time) {
				var date = new Date(time.ms).toUTCString();
				var temp = date.split(" ");
				var str = temp[4];
				// var hh = date.getHours();
				// if (hh < 10) {
				//  hh = "0" + hh;
				// }
				// var min = date.getMinutes();
				// if (min < 10) {
				//  min = "0" + min;
				// }
				// var ss = date.getSeconds();
				// if (ss < 10) {
				//  ss = "0" + ss;
				// }
				return str;
			} else {
				return "00:00:00";
			}

		},

		acceptOnlyNumerics: function (event) {
			var keycodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
			if (!($.inArray(event.which, keycodes) >= 0)) {
				event.preventDefault();
			}
		},

		formatForceInstall: function (value) {
			if (value === 'X') {
				return true;
			} else {
				return false;
			}
		},

		// getMessageType: function (type) {
		// 	if (type === "E") {
		// 		return "Error";
		// 	} else if (type === "S") {
		// 		return "Success";
		// 	} else if (type === "W") {
		// 		return "Warning";
		// 	} else {
		// 		return "";
		// 	}
		// }

		convertTimetoString: function (time) {
			var timeString = "";
			if (time !== "") {
				var temp = time.split("PT")[1];
				var sHour = temp.split("H")[0];

				var temp2 = temp.split("H")[1];
				var sMinute = temp2.split("M")[0];

				var temp3 = temp2.split("M")[1];
				var sSec = temp3.split("S")[0];

				timeString = sHour + ":" + sMinute + ":" + sSec
			} else {
				return time;
			}
		},

		truetoX: function (s) {
			if (s === true) {
				return "X";
			} else {
				return "";
			}
		},

		XtoTrue: function (s) {
			if (s === 'X') {
				return true;
			} else {
				return false;
			}
		},

		TLPRTtitle: function (category) {
			var sTitle = "";
			switch (category) {
			case "M":
				sTitle = "Material";
				break;
			case "E":
				sTitle = "Equipment";
				break;
			case "P":
				sTitle = "Measuring Point";
				break;
			case "D":
				sTitle = "Document";
				break;
			case "O":
				sTitle = "Others";
				break;
			}

			return sTitle;
		},

		checkBooleanString: function (v) {
			if (typeof v === "boolean") {
				return v;
			} else if (typeof v === "string") {
				if (v === "X") {
					return true;
				} else {
					return false;
				}
			}
		}

	};

});