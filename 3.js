const express = require('express');
const app = express();

app.listen(666);
const fs = require("fs")
const url = require("url")
const gbk = require("gbk")
const JSDOM = require("jsdom").JSDOM
const Segment = require('segment');
let seg = new Segment();
seg.useDefault();

let myJSON = {}
let arr2 = []
let nextUrl
let nextObj
let allhtml = ''
let myhtml = ''
let http = ''
let n = 0
let mid

function getUrl(Ourl, success) {
	var urlObj = url.parse(Ourl)
	if (urlObj.protocol == "http:") {
		http = require("http")
	} else {
		http = require("https")
	}
	var req = http.request({
		"hostname": urlObj.hostname,
		"path": urlObj.path
	}, res => {
		console.log(res.statusCode)
		var arr = []
		res.on('data', buffer => {
			arr.push(buffer)
		})
		res.on('end', () => {
			let b = Buffer.concat(arr)
			success && success(b)
		})
	})
	req.end()
}

function load(uurl) {
	n++
	getUrl(uurl, data => {
		console.log(uurl)
		/**
		 * 处理虚拟dom，才能使用dom
		 */
		var DOM = new JSDOM(data)
		var document = DOM.window.document
		myhtml = document.querySelector('.read-content').innerHTML.replace(/<[^>]+>/g, '')
		allhtml += myhtml
		nextObj = document.querySelector("#j_chapterNext")
		nextUrl = "https:" + nextObj.href;
		console.log(nextUrl)

		/**
		 * 爬10页就好，多了就容易miss了
		 */
		if (n < 10) {
			load(nextUrl)
		} else {

			var arr = seg.doSegment(allhtml)

			var myarr = []
			arr.forEach((data) => {
				if (data.p != 2048) {
					myarr.push(data.w)
				}
			})

			myarr.forEach((item) => {
				if (!myJSON[item]) {
					myJSON[item] = 1
				} else {
					myJSON[item]++
				}
			})

			for (let index in myJSON) {
				if (myJSON[index] > 3) {//一页出现小于3次没什么意义
					arr2.push({
						w: index,
						c: myJSON[index]
					})
				}
			}
			arr2.sort((a, b) => b.c - a.c);
			console.log(arr2)

			/**
			 * 再次过滤筛选结果
			 */
			arr2.splice(0, 1)//去掉“的”
			arr2 = arr2.slice(0, Math.floor(arr2.length / 12))//页数越多取越少
			mid.send({ 'book': arr2 });
		}
	})
}

app.use('/count', (req, res) => {
	mid = res
	load(req.query.str)
})

app.use(express.static('./'))
