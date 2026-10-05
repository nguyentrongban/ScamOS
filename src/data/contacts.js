const contacts = [
  {
    id: 1,
    name: "Nguyễn Minh",
    handle: "@minh_work",
    avatar: "NM",
    online: true,
    trust: 74,
    emotion: 62,
    suspicion: 18,
    messages: [
      { from: "them", text: "Chào bạn, bên bạn đang hỗ trợ khoản hoàn tiền đúng không?", time: "14:03" },
      { from: "me", text: "Đúng rồi, mình kiểm tra hồ sơ cho bạn nhé.", time: "14:04" },
      { from: "them", text: "Ok, mình cần chuẩn bị gì?", time: "14:05" }
    ]
  },
  {
    id: 2,
    name: "Trần Huy",
    handle: "@huy1989",
    avatar: "TH",
    online: true,
    trust: 58,
    emotion: 79,
    suspicion: 31,
    messages: [
      { from: "them", text: "Mình vừa nhận được thông báo, nhưng chưa hiểu lắm.", time: "13:42" },
      { from: "me", text: "Mình giải thích từng bước cho bạn.", time: "13:43" }
    ]
  },
  {
    id: 3,
    name: "Lê An",
    handle: "@lean",
    avatar: "LA",
    online: false,
    trust: 41,
    emotion: 37,
    suspicion: 64,
    messages: [
      { from: "them", text: "Cho mình hỏi lại tên công ty được không?", time: "12:18" },
      { from: "me", text: "Bạn xem phần thông tin ở trên nhé.", time: "12:20" }
    ]
  },
  {
    id: 4,
    name: "Phạm Quang",
    handle: "@pq_support",
    avatar: "PQ",
    online: true,
    trust: 83,
    emotion: 51,
    suspicion: 11,
    messages: [
      { from: "them", text: "Mình đã online, bạn cứ gửi thông tin.", time: "11:54" }
    ]
  }
];

export default contacts;
