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
	kind: "VFlexBox",
	className: "dashboard",
	style: "color: #FFF;",
	components: [
		{style: "padding: 3px; height: 52px; width: 100%;", components: [
			{name: "batteryBar", style: "height: 46px; width: 50%; background: #006600;"}
		]},
		{kind: "HFlexBox", className: "overlay", components: [
			{kind: "VFlexBox", className: "dashContainer", flex: 1, align: "center", pack:"middle",components: [
				{name: "txtPercent", className: "dashValue", style: "", flex: 1, content: "00"},
				{name: "lblPercent", className: "dashLabel", content: "Percent"}
			]},
			{kind: "VFlexBox", className: "dashContainer", flex: 1, align: "center", components: [
				{name: "txtPercentDrain", className: "dashValue", flex: 1, content: "00"},
				{name: "lblPercentDrain", className: "dashLabel", content: "%/h"}
			]},			
			{kind: "VFlexBox", className: "dashContainer", flex: 1, align: "center", components: [
				{name: "txtCurrent", className: "dashValue", flex: 1, content: "00"},
				{name: "lblCurrent", className: "dashLabel", content: "Current"}
			]},
			{kind: "VFlexBox", className: "dashContainer", flex: 1, align: "center", components: [
				{name: "txtTemp", className: "dashValue", flex: 1, content: "00"},
				{name: "lblTemp", className: "dashLabel", content: "Celsius"}
			]},
			{kind: "VFlexBox", className: "dashContainerEnd", flex: 1, align: "center", onclick: "setStyles", components: [
				{name: "txtVolts", className: "dashValue", flex: 1, content: "00"},
				{name: "lblVolts", className: "dashLabel", content: "Volts"}
			]}
		]},
		{kind: "ApplicationEvents", onWindowActivated: "dashOpened", onWindowDeactivated: "dashClosed", onWindowParamsChange: "handleWindowParams", onUnload: "dashExited"},
		{name: "screenState", kind: "enyo.PalmService", service: "palm://com.palm.display/control", method: "status", subscribe: true, onSuccess: "displayUpdate"},
		{name: "batteryService", kind: "PalmService", service: "palm://de.somline.drbattery", method: "ReadBatteryShort", onSuccess: "gotBattStats"}
	],
	startTime: null,
	startBatteryLevel: null,
	create: function () {
		this.startTime = (new Date()).getTime();
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
		var time = enyo.windowParams.styles.interval || 10;
		time = parseInt(time);
		time = time * 60000;
		this.timer = setInterval(function() {
			enyo.log("setInterval: " + "fired");
			this.$.batteryService.call();
		}.bind(this), time);
	},
	dashClosed: function() {
		this.dashStatus = "closed";
		clearInterval(this.timer);
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
		this.$.txtPercentDrain.addStyles("color: #" + style.clrV + ";");
		this.$.txtCurrent.addStyles("color: #" + style.clrV + ";");
		this.$.txtTemp.addStyles("color: #" + style.clrV + ";");
		this.$.txtVolts.addStyles("color: #" + style.clrV + ";");
		
		if(style.clrL==undefined)
			style.clrL = "FFFFFF";
		this.$.lblPercent.addStyles("color: #" + style.clrL + ";");
		this.$.lblPercentDrain.addStyles("color: #" + style.clrL + ";");
		this.$.lblCurrent.addStyles("color: #" + style.clrL + ";");
		this.$.lblTemp.addStyles("color: #" + style.clrL + ";");
		this.$.lblVolts.addStyles("color: #" + style.clrL + ";");
		
		if(style.clrB==undefined)
			style.clrB = "000000";
		enyo.$.batteryWidgetDash.addStyles("background: #" + style.clrB + ";");

		if(style.clrBar==undefined)
			style.clrBar = "006600";
		this.$.batteryBar.addStyles("background: #" + style.clrBar + ";");
		
		if(style.sizeV==undefined)
			style.sizeV = 26;
		this.$.txtPercent.addStyles("font-size: " + style.sizeV + "px;");
		this.$.txtPercentDrain.addStyles("font-size: " + style.sizeV + "px;");
		this.$.txtCurrent.addStyles("font-size: " + style.sizeV + "px;");
		this.$.txtTemp.addStyles("font-size: " + style.sizeV + "px;");
		this.$.txtVolts.addStyles("font-size: " + style.sizeV + "px;");
		
		if(style.sizeL==undefined)
			style.sizeL = 12;
		this.$.lblPercent.addStyles("font-size: " + style.sizeL + "px;");
		this.$.lblPercentDrain.addStyles("font-size: " + style.sizeL + "px;");
		this.$.lblCurrent.addStyles("font-size: " + style.sizeL + "px;");
		this.$.lblTemp.addStyles("font-size: " + style.sizeL + "px;");
		this.$.lblVolts.addStyles("font-size: " + style.sizeL + "px;");
	},
	gotBattStats: function(inSender, inResponse) {
		enyo.log("gotBattStats: " + "called");
		
		if (inResponse.getpercent != undefined) {
			var batteryLevel = inResponse.getpercent;
			this.$.txtPercent.setContent(batteryLevel);
			this.$.batteryBar.applyStyle("width", batteryLevel + "%");
						
			if (batteryLevel >= 35)//green
			{
				 this.$.batteryBar.applyStyle("background", "#006600");
			};			
			
			if ((batteryLevel < 35) & (batteryLevel >= 20))//yellow
			{
				 this.$.batteryBar.applyStyle("background", "#dddd00");
			};

			if ((batteryLevel < 20) & (batteryLevel >= 15))//orange
			{
				 this.$.batteryBar.applyStyle("background", "#ee5500");
			};
			
			if (batteryLevel < 15)//red
			{
				 this.$.batteryBar.applyStyle("background", "#cc0000");
			};			
			
			
			
			if (this.startBatteryLevel) {
				var thisTime = (new Date()).getTime();
				var durationSecs = (this.startTime - thisTime) / 1000;
				var batteryLevel = inResponse.getpercent;
				var batteryDrain = (this.startBatteryLevel - inResponse.getpercent) / durationSecs * 3600;
				
				faktor = Math.pow(10,1);
				enyo.log(batteryDrain);
				batteryDrain = Math.abs(Math.round(batteryDrain * faktor) / faktor);
				enyo.log("rd " + batteryDrain);
				
				this.$.txtPercentDrain.setContent(batteryDrain);			
			} else
			{
				var batteryLevel = inResponse.getpercent;
				this.startBatteryLevel = inResponse.getpercent;
				this.$.txtPercentDrain.setContent("-");				
			}			
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
