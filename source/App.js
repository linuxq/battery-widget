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
	name: "BatteryWidgetApp",
	kind: enyo.VFlexBox,
	className: "main",
	components: [
		{kind: "Scroller", flex:1, components: [
			{kind: "Header", content: "Battery Widget", className: "enyo-header-dark"},
			//{kind: "Group", caption: "Description", components: [
				{className: "text", allowHtml: true, content: "Battery Widget gives you a way to quickly glance at your battery status. The widget displays (from left to right):<br>- Percentage (%)<br>- Current (mA)<br>- Temperature (&deg;C)<br> - Volts (V)"},
				{className: "text", content: "These values are updated when you activate the dashboard window or when you turn the screen on. This way, the info will always be current whenever you want to look at it."},
			//]},
			{kind: "Group", caption: "Configure", components: [
				{className: "text", content: "Use these settings to customize the battery widget."},
				{kind: "Divider", caption: "Colors"},
				{name: "inputClrV", kind: "Input", style: "color: #007;", value: "FFFFFF", selectAllOnFocus:true, spellcheck:false, autocorrect:false, components: [
					{style: "color: rgb(31,117,191);", content: "Values"},
				]},
				{name: "inputClrL", kind: "Input", style: "color: #007;", value: "FFFFFF", selectAllOnFocus:true, spellcheck:false, autocorrect:false, components: [
					{style: "color: rgb(31,117,191);", content: "Labels"},
				]},
				{name: "inputClrB", kind: "Input", style: "color: #007;", value: "000000", selectAllOnFocus:true, spellcheck:false, autocorrect:false, components: [
					{style: "color: rgb(31,117,191);", content: "Background"},
				]},
				{kind: "Divider", caption: "Font Size"},
				{kind: "HFlexBox", style: "padding: 0 10px 0 10px;", align: "center", components: [
					{name: "displaySizeV", content: "26"},
					{name: "inputSizeV", kind: "Slider", className: "bufferH", flex:1, minimum: 20, maximum: 40, position: 26, onChanging: "updateDisplayV"},
					{className: "config-label", content: "Values"},
				]},
				{kind: "HFlexBox", style: "padding: 0 10px 0 10px;", align: "center", components: [
					{name: "displaySizeL", content: "12"},
					{name: "inputSizeL", kind: "Slider", className: "bufferH", flex:1, minimum: 10, maximum: 20, position: 12, onChanging: "updateDisplayL"},
					{className: "config-label", content: "Labels"},
				]},
			]},
			{className: "text", content: "This card does not need to be open for the widget to work."},
		]},
		{name: "openWidget", kind: "Button", caption: "Load Widget", className: "enyo-button-affirmative btnLoadWidget", onclick: "loadWidget"},
		{kind: "ApplicationEvents", onLoad: "loadValues", onUnload: "saveValues"},
		{kind: "AppMenu", components: [
			{caption: "Contact", onclick: "openContact"},
		]},
		{name: "popupContact", kind: "Popup", components: [
			{content: "Twitter: @Choorp"},
			{content: "Email: Garrett92C@gmail.com"},
			{kind: "Button", caption: "Close", onclick: "closeContact"},
		]},
	],
	create: function () {
		this.inherited(arguments);
	},
	saveValues: function () {
		enyo.application.appPrefs = {
			colorV: this.$.inputClrV.getValue(),
			colorL: this.$.inputClrL.getValue(),
			colorB: this.$.inputClrB.getValue(),
			sizeV: this.$.inputSizeV.getPosition(),
			sizeL: this.$.inputSizeL.getPosition(),
		}
		enyo.setCookie("appPrefs", enyo.json.stringify(enyo.application.appPrefs));
	},
	loadValues: function() {
		enyo.application.appPrefs = {
			colorV: "FFFFFF",
			colorL: "FFFFFF",
			colorB: "000000",
			sizeV: 26,
			sizeL: 12,
		}
		var cookie = enyo.getCookie("appPrefs");
		if(cookie) {
			enyo.application.appPrefs = enyo.mixin(enyo.application.appPrefs, enyo.json.parse(cookie));
		}
		
		var config = enyo.application.appPrefs;
		this.$.inputClrV.setValue(config.colorV);
		this.$.inputClrL.setValue(config.colorL);
		this.$.inputClrB.setValue(config.colorB);
		this.$.inputSizeV.setPosition(config.sizeV);
		this.$.displaySizeV.setContent(config.sizeV);
		this.$.inputSizeL.setPosition(config.sizeL);
		this.$.displaySizeL.setContent(config.sizeL);
		
	},
	openContact: function() {
		this.$.popupContact.openAtCenter();
	},
	closeContact: function() {
		this.$.popupContact.close();
	},
	updateDisplayV: function() {
		var num = this.$.inputSizeV.getPosition();
		this.$.displaySizeV.setContent(num);
	},
	updateDisplayL: function() {
		var num = this.$.inputSizeL.getPosition();
		this.$.displaySizeL.setContent(num);
	},
	loadWidget: function() {
		var settings = {
			clrV: this.$.inputClrV.getValue(),
			clrL: this.$.inputClrL.getValue(),
			clrB: this.$.inputClrB.getValue(),
			sizeV: this.$.inputSizeV.getPosition(),
			sizeL: this.$.inputSizeL.getPosition(),
		}
		enyo.windows.openDashboard("widget/index.html", "batteryWidgetDash", {styles: settings}, {clickableWhenLocked:true});
	},
});