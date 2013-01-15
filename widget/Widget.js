/*
 *  Copyright 2012 Choorp Studios
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
enyo.kind({
	name: "BatteryWidgetDash",
	kind: "HFlexBox",
	className: "dashboard",
	style: "color: #FFF;",
	published: {
		
	},
	components: [
		{kind: "VFlexBox", className: "dashContainer", flex: 1, align: "center", pack:"middle",components: [
			{name: "txtPercent", className: "dashValue", style: "", flex: 1, content: "00"},
			{name: "lblPercent", className: "dashLabel", content: "Percent"},
		]},
		{kind: "VFlexBox", className: "dashContainer", flex: 1, align: "center", components: [
			{name: "txtCurrent", className: "dashValue", flex: 1, content: "00"},
			{name: "lblCurrent", className: "dashLabel", content: "Current"},
		]},
		{kind: "VFlexBox", className: "dashContainer", flex: 1, align: "center", components: [
			{name: "txtTemp", className: "dashValue", flex: 1, content: "00"},
			{name: "lblTemp", className: "dashLabel", content: "Celsius"},
		]},
		{kind: "VFlexBox", className: "dashContainerEnd", flex: 1, align: "center", onclick: "setStyles", components: [
			{name: "txtVolts", className: "dashValue", flex: 1, content: "00"},
			{name: "lblVolts", className: "dashLabel", content: "Volts"},
		]},
		{kind: "ApplicationEvents", onWindowActivated: "dashOpened", onWindowDeactivated: "dashClosed", onWindowParamsChange: "handleWindowParams", onUnload: "dashExited"},
		{name: "screenState", kind: "enyo.PalmService", service: "palm://com.palm.display/control", method: "status", subscribe: true, onSuccess: "displayUpdate"},
		{name: "batteryService", kind: "PalmService", service: "palm://de.somline.drbattery", method: "ReadBatteryShort", onSuccess: "gotBattStats"},
	],
	create: function () {
		this.inherited(arguments);
		this.$.screenState.call();
		this.setStyles();
	},
	handleWindowParams2: function() {
		this.clrV = enyo.windowParams.wclrV;
		this.clrL = enyo.windowParams.wclrL;
		this.clrB = enyo.windowParams.wclrB;
	},
	dashOpened: function() {
		this.$.batteryService.call();
	},
	dashClosed: function() {
		this.dashStatus = "closed";
	},
	dashExited: function() {
		this.$.screenState.destroy();
	},
	displayUpdate: function(inSender, inResponse) {
		if(inResponse.event === "displayOn") {
			this.$.batteryService.call();
		}
	},
	setStyles: function(inSender, values, labels, background) {
		var style = enyo.windowParams.styles;
		
		if(style.clrV==undefined)
			style.clrV = "FFFFFF";
		this.$.txtPercent.addStyles("color: #" + style.clrV + ";");
		this.$.txtCurrent.addStyles("color: #" + style.clrV + ";");
		this.$.txtTemp.addStyles("color: #" + style.clrV + ";");
		this.$.txtVolts.addStyles("color: #" + style.clrV + ";");
		
		if(style.clrL==undefined)
			style.clrL = "FFFFFF";
		this.$.lblPercent.addStyles("color: #" + style.clrL + ";");
		this.$.lblCurrent.addStyles("color: #" + style.clrL + ";");
		this.$.lblTemp.addStyles("color: #" + style.clrL + ";");
		this.$.lblVolts.addStyles("color: #" + style.clrL + ";");
		
		if(style.clrB==undefined)
			style.clrB = "000000";
		enyo.$.batteryWidgetDash.addStyles("background: #" + style.clrB + ";");
		
		if(style.sizeV==undefined)
			style.sizeV = 26;
		this.$.txtPercent.addStyles("font-size: " + style.sizeV + "px;");
		this.$.txtCurrent.addStyles("font-size: " + style.sizeV + "px;");
		this.$.txtTemp.addStyles("font-size: " + style.sizeV + "px;");
		this.$.txtVolts.addStyles("font-size: " + style.sizeV + "px;");
		
		if(style.sizeL==undefined)
			style.sizeL = 12;
		this.$.lblPercent.addStyles("font-size: " + style.sizeL + "px;");
		this.$.lblCurrent.addStyles("font-size: " + style.sizeL + "px;");
		this.$.lblTemp.addStyles("font-size: " + style.sizeL + "px;");
		this.$.lblVolts.addStyles("font-size: " + style.sizeL + "px;");
	},
	gotBattStats: function(inSender, inResponse) {
		/*var time = new Date();
		this.$.txtTime.setContent(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());*/
		
		if (inResponse.getpercent != undefined) {
			var batteryLevel = inResponse.getpercent;
			this.$.txtPercent.setContent(batteryLevel);
		}
		else {
			this.$.txtPercent.setContent("?");
		}
		
		if (inResponse.getavgcurrent  != undefined) {
			var currentLevel = ((inResponse.getavgcurrent / 1000).toFixed(0));
			this.$.txtCurrent.setContent(currentLevel);
		}
		else {
			this.$.txtCurrent.setContent("?");
		}
		
		if (inResponse.gettemp != undefined) {
			var tempLevel = inResponse.gettemp;
			this.$.txtTemp.setContent(tempLevel);
		}
		else {
			this.$.txtTemp.setContent("?");
		}
		
		if (inResponse.getvoltage != undefined) {
			var voltsLevel = ((inResponse.getvoltage / 1000000).toFixed(1));
			this.$.txtVolts.setContent(voltsLevel);
		}
		else {
			this.$.txtVolts.setContent("?");
		}
	},
});