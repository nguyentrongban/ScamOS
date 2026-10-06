// Phân tích tin nhắn của người chơi để giải thích ngắn gọn dấu hiệu nào làm nạn nhân nghi ngờ.
// Chỉ mô tả dấu hiệu chung, không đưa câu nhắn mẫu để sử dụng.

const normalize = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");

const CATEGORIES = {
  urgency: {
    keywords: ["gap", "khan", "ngay", "nhanh", "het han", "hom nay", "bay gio"],
    label: "tạo áp lực thời gian",
    tip: "Tạo áp lực thời gian. Người thật thường tỉnh táo hơn khi bị giục."
  },
  sensitive: {
    keywords: ["otp", "mat khau", "ma xac nhan", "so the", "cccd", "cmnd", "chuyen tien", "stk", "so tai khoan"],
    label: "hỏi thông tin cá nhân hoặc tiền",
    tip: "Hỏi thông tin cá nhân hoặc tiền. Đây là dấu hiệu lừa đảo phổ biến nhất."
  },
  authority: {
    keywords: ["ngan hang", "cong an", "co quan", "bo phan ho tro", "nhan vien"],
    label: "tự xưng là tổ chức",
    tip: "Tự xưng là tổ chức. Người thật sẽ muốn kiểm chứng qua kênh chính thức."
  }
};

export function detectFlags(text) {
  const t = normalize(text);
  return Object.keys(CATEGORIES).filter((key) =>
    CATEGORIES[key].keywords.some((k) => t.includes(k))
  );
}

// Độ tăng nghi ngờ phụ thuộc vào số dấu hiệu, nên gợi ý luôn khớp với thay đổi thực tế.
export function suspicionDelta(flags, rand) {
  return rand(0, 3) + flags.length * 3;
}

export function buildTip(flags) {
  if (flags.length === 0) return "Tin nhắn bình thường, không có dấu hiệu đặc biệt.";
  return `Nạn nhân nghi ngờ hơn. ${CATEGORIES[flags[0]].tip}`;
}

export function buildSummary(flagsSeen = []) {
  const used = flagsSeen.length
    ? flagsSeen.map((k) => CATEGORIES[k].label).join(", ")
    : "không có dấu hiệu lừa đảo rõ ràng";
  return [
    "KẾT THÚC: nạn nhân đã nhận ra và không làm theo.",
    `Dấu hiệu bạn đã dùng: ${used}.`,
    "Nếu bạn gặp tình huống tương tự ngoài đời:",
    "1. Dừng lại, không chuyển tiền và không đưa mã OTP hay mật khẩu.",
    "2. Tự gọi lại đúng số của ngân hàng hoặc cơ quan (số in trên thẻ hoặc trang chính thức).",
    "3. Hỏi người thân tin cậy trước khi làm bất cứ điều gì."
  ].join("\n");
}

export function buildSuccessSummary(flagsSeen = []) {
  const used = flagsSeen.length
    ? flagsSeen.map((k) => CATEGORIES[k].label).join(", ")
    : "không có dấu hiệu lừa đảo rõ ràng";
  return [
    "KẾT THÚC: nạn nhân tin và làm theo mà không kiểm chứng.",
    `Dấu hiệu bạn đã dùng: ${used}.`,
    "Vì sao đây nguy hiểm: người lừa đảo ngoài đời dựa vào đúng việc nạn nhân không gọi lại số chính thức.",
    "Nếu bạn gặp tình huống tương tự:",
    "1. Luôn kiểm chứng qua kênh chính thức, không dùng số hay đường link trong tin nhắn.",
    "2. Không bao giờ chia sẻ mã OTP, mật khẩu hay số thẻ với bất kỳ ai.",
    "3. Báo ngay cho ngân hàng và cơ quan công an nếu đã lỡ làm theo."
  ].join("\n");
}
