package com.travel5.be.service;

import com.travel5.be.entity.Booking;
import com.travel5.be.entity.PaymentStatus;
import com.travel5.be.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PaymentService {

    @Value("${sepay.api-key}")
    private String sepayApiKey;

    private final BookingRepository bookingRepository;

    public PaymentService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * ✅ Tạo QR thanh toán
     */
    public void generateQrAndUpdateBooking(Booking booking) {
        // Nếu đơn hàng đã thanh toán, không tạo mã QR
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            System.out.println("⚠ Đơn hàng đã thanh toán. Không tạo mã QR.");
            return; // Không tạo mã QR nữa
        }

        String accountNumber = "5516122003";
        String bankCode = "MB";

        // Lấy giá cuối cùng (sau giảm voucher, trừ điểm)
        BigDecimal amount = booking.getDiscountedPrice() != null
                ? booking.getDiscountedPrice()
                : booking.getTour().getPrice();

        // Nếu giá âm thì đặt về 0
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            amount = BigDecimal.ZERO;
        }

        String note = "BOOKING_" + booking.getBookingId();

        String qrUrl = String.format(
                "https://qr.sepay.vn/img?acc=%s&bank=%s&amount=%.0f&des=%s&template=compact",
                accountNumber, bankCode, amount.doubleValue(), note
        );

        booking.setBankQrCode(qrUrl);
        bookingRepository.save(booking);
    }


    /**
     * ✅ Tự động kiểm tra thanh toán từ SePay mỗi 5 giây
     */
    @Scheduled(fixedDelay = 5000)
    public void checkPaymentStatusScheduled() {
        List<Booking> unpaidBookings = bookingRepository.findByPaymentStatus(PaymentStatus.UNPAID);
        if (unpaidBookings.isEmpty()) return;

        List<Map<String, Object>> transactions = fetchTransactionsFromSePay();
        if (transactions.isEmpty()) {
            System.out.println("⚠ Không có giao dịch nào từ SePay.");
            return;
        }

        for (Booking booking : unpaidBookings) {
            String keywordWithUnderscore = "BOOKING_" + booking.getBookingId();
            String keywordWithoutUnderscore = "BOOKING" + booking.getBookingId();
            BigDecimal expectedAmount = booking.getDiscountedPrice() != null
                    ? booking.getDiscountedPrice()
                    : booking.getTour().getPrice();

            for (Map<String, Object> tx : transactions) {
                String content = ((String) tx.get("transaction_content")).replaceAll("\\s+", "");
                String amountStr = (String) tx.get("amount_in");

                try {
                    BigDecimal receivedAmount = new BigDecimal(amountStr);

                    if ((content.contains(keywordWithUnderscore) || content.contains(keywordWithoutUnderscore))
                            && receivedAmount.compareTo(expectedAmount) == 0) {
                        booking.setPaymentStatus(PaymentStatus.PAID);
                        bookingRepository.save(booking);
                        System.out.println("✅ Đã xác nhận thanh toán thành công cho booking ID: " + booking.getBookingId());
                        break;
                    }
                } catch (Exception e) {
                    System.out.println("❌ Lỗi khi xử lý giao dịch: " + e.getMessage());
                }
            }
        }
    }

    /**
     * ✅ Gọi API SePay lấy danh sách giao dịch
     */
    private List<Map<String, Object>> fetchTransactionsFromSePay() {
        String url = "https://my.sepay.vn/userapi/transactions/list";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + sepayApiKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map body = response.getBody();
            if (body != null && body.get("transactions") instanceof List<?>) {
                return (List<Map<String, Object>>) body.get("transactions");
            }
        } catch (Exception e) {
            System.out.println("❌ Lỗi khi gọi SePay: " + e.getMessage());
        }

        return Collections.emptyList();
    }
}
