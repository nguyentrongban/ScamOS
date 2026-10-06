// Dữ liệu nạn nhân giả lập (fictional). Mỗi nạn nhân có bộ câu trả lời theo mức nghi ngờ.
export const initialContacts = [
  {
    id: 1,
    name: "Nguyễn Minh",
    handle: "@minh_work",
    avatar: "NM",
    online: true,
    trust: 74,
    emotion: 62,
    suspicion: 18,
    status: "active",
    typing: false,
    messages: [
      { from: "them", text: "Chào bạn, bên bạn đang hỗ trợ khoản hoàn tiền đúng không?", time: "14:03" },
      { from: "me", text: "Đúng rồi, mình kiểm tra hồ sơ cho bạn nhé.", time: "14:04" },
      { from: "them", text: "Ok, mình cần chuẩn bị gì?", time: "14:05" }
    ],
    replies: ["Ok, bạn nói tiếp đi.", "Được, mình đang xem.", "Cảm ơn bạn, mình chờ nhé."],
    warnings: ["Sao bạn không thể gọi trực tiếp được nhỉ?", "Mình muốn xác nhận lại thông tin này."],
    reportLine: "Mình đã báo cho bộ phận hỗ trợ của ngân hàng. Cuộc trò chuyện kết thúc tại đây."
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
    status: "active",
    typing: false,
    messages: [
      { from: "them", text: "Mình vừa nhận được thông báo, nhưng chưa hiểu lắm.", time: "13:42" },
      { from: "me", text: "Mình giải thích từng bước cho bạn.", time: "13:43" }
    ],
    replies: ["Bạn giải thích thêm được không?", "Ừ, mình hiểu rồi.", "Vậy mình làm bước tiếp theo thế nào?"],
    warnings: ["Khoan đã, mình thấy hơi lạ.", "Bạn cho mình số điện thoại để mình gọi lại được không?"],
    reportLine: "Mình đã nhờ người thân xem giúp. Mình sẽ không làm tiếp nữa."
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
    status: "active",
    typing: false,
    messages: [
      { from: "them", text: "Cho mình hỏi lại tên công ty được không?", time: "12:18" },
      { from: "me", text: "Bạn xem phần thông tin ở trên nhé.", time: "12:20" }
    ],
    replies: ["Mình đọc rồi, nhưng vẫn chưa rõ.", "Bạn nhắc lại giúp mình nhé."],
    warnings: ["Mình nghĩ nên dừng lại ở đây.", "Mình sẽ tự kiểm tra với ngân hàng.", "Bạn có thể cho mình mã xác nhận chính thức không?"],
    reportLine: "Mình đã chặn tài khoản này và báo cáo. Tạm biệt."
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
    status: "active",
    typing: false,
    messages: [
      { from: "them", text: "Mình đã online, bạn cứ gửi thông tin.", time: "11:54" }
    ],
    replies: ["Được rồi, bạn gửi tiếp đi.", "Mình đang chờ đây.", "Ok, mình theo dõi."],
    warnings: ["Có gì đó không đúng lắm.", "Bạn giải thích lại giúp mình được không?"],
    reportLine: "Mình đã báo cáo việc này. Cảm ơn bạn đã cảnh báo mình."
  }
];

export const createContacts = () => JSON.parse(JSON.stringify(initialContacts));

export default initialContacts;
