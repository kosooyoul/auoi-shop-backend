var Schema = require('mongoose').Schema;
var ObjectId = require('mongoose').ObjectId;

/*
	Collection.AccountSchema: 계정 정보
	- sid!: 아이디 (Unique, Index)
	- password!: 비밀번호
	- name!: 이름
	- lastSignedInAt?: 마지막 로그인 일시
	- updatedAt!: 수정일시
	- createdAt!: 생성일시
*/
var AccountSchema = new Schema({
	sid: {type: String, unique: true, index: true, required: true},
	password: {type: String, required: true},
	name: {type: String, required: true},
	lastSignedInAt: {type: Date},
	updatedAt: {type: Date, default: Date.now},
	createdAt: {type: Date, default: Date.now},
}, {versionKey: false});

/*
	Collection.AccountDeviceSchema: 계정 디바이스 정보
	- accountSid!: 계정 아이디 (Index)
	- type!: 디바이스 종류
	- token!: 디바이스 토큰
	- ip!: 디바이스 아이피
	- createdAt!: 생성일시
*/
var AccountDeviceSchema = new Schema({
	accountSid: {type: String, index: true, required: true},
	type: {type: String, required: true},
	token: {type: String, required: true},
	ip: {type: String, required: true},
	createdAt: {type: Date, default: Date.now}
}, {versionKey: false});

/*
	Collection.ProductSchema: 상품 정보
	- code!: 상품 코드 (Unique, Index)
	- title!: 상품명
	- description?: 설명
	- unitPrice!: 가격
	- currency!: 통화 (Default: "KRW")
	- availableStock!: 재고수량 (Default: 0)
	- stockLogs?: 재고 로그
	- sellerAccountSid!: 작성자 계정 아이디 (Index)
	- updatedAt!: 수정일시
	- createdAt!: 생성일시
*/
var ProductSchema = new Schema({
	code: {type: String, unique: true, index: true, required: true},
	title: {type: String, required: true},
	description: {type: String},
	unitPrice: {type: Number, required: true},
	currency: {type: String, required: true, default: "KRW"},
	availableStock: {type: Number, required: true, default: 0},
	stockLogs: [{
		reason: {type: String, require: true},
		stock: {type: Number},
		loggedAt: {type: Date, default: Date.now}
	}],
	sellerAccountSid: {type: String, index: true, required: true},
	updatedAt: {type: Date, default: Date.now},
	createdAt: {type: Date, default: Date.now},
}, {versionKey: false});

/*
	Collection.OrderSchema: 주문 정보
	- code!: 주문 코드 (Unique, Index)
	- productCode!: 주문한 상품 코드 (Index)
	- product!: 주문 당시 상품 주요 정보
	- orderedStock!: 주문 수량
	- status!: 주문 상태
	- statusLogs!: 주문 상태 로그
	- ordererAccountSid!: 주문자 계정 아이디 (Index)
	- ordererAccountName!: 주문자 계정 이름
	- sellerAccountSid!: 판매자 계정 아이디 (Index)
	- createdAt!: 생성일시
*/
var OrderSchema = new Schema({
	code: {type: String, unique: true, index: true, required: true},
	productCode: {type: String, index: true, required: true},
	product: {
		title: {type: String, required: true},
		unitPrice: {type: Number, required: true},
		currency: {type: String, required: true}
	},
	orderedStock: {type: Number, required: true},
	status: {type: String, required: true},
	statusLogs: [{
		status: {type: String, required: true},
		loggedAt: {type: Date, default: Date.now}
	}],
	ordererAccountSid: {type: String, index: true, required: true},
	ordererAccountName: {type: String, required: true},
	sellerAccountSid: {type: String, index: true, required: true},
	createdAt: {type: Date, default: Date.now},
}, {versionKey: false});

/*
	Collection.OrderNotificationSchema: 주문 알림 정보
	- receiverAccountSid!: 수신자 계정 아이디 (Index)
	- orderCode!: 주문 코드
	- title: 알림 제목
	- body: 알림 내용
	- read!: 읽음 여부
	- createdAt!: 생성일시
*/
var OrderNotificationSchema = new Schema({
	receiverAccountSid: {type: String, index: true, required: true},
	orderCode: {type: String, required: true},
	title: {type: String},
	body: {type: String},
	read: {type: Boolean, required: true, default: false},
	createdAt: {type: Date, default: Date.now},
}, {versionKey: false});

/*
	Collection.NoticeSchema: 공지사항
	- title!: 제목
	- content!: 내용
	- createdAt!: 생성일시
*/
var NoticeSchema = new Schema({
	title: {type: String, required: true},
	content: {type: String},
	createdAt: {type: Date, default: Date.now},
}, {versionKey: false});

// exports schemas of db input
module.exports = {
	get: function(db) {
		return {
			Account: db.model('account', AccountSchema, 'accounts'),
			AccountDevice: db.model('account_device', AccountDeviceSchema, 'account_devices'),
			Product: db.model('product', ProductSchema, 'products'),
			Order: db.model('order', OrderSchema, 'orders'),
			OrderNotification: db.model('order_notification', OrderNotificationSchema, 'order_notifications'),
			Notice: db.model('notice', NoticeSchema, 'notices')
		};
	}
};