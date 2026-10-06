export const money = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'
const pad = (n: number) => String(n).padStart(2, '0')
export const clock = (minute: number) => { const m = 540 + minute; return `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}` }
