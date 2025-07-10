package com.travel5.be.controller;

import com.travel5.be.entity.Voucher;
import com.travel5.be.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin("*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    // API để tạo voucher mới
    @PostMapping
    public ResponseEntity<?> createVoucher(@RequestBody Voucher voucher) {
        // Kiểm tra xem voucher có hợp lệ không
        if (voucher.getVoucherCode() == null || voucher.getDiscountPercentage().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Voucher data is invalid.");
        }
        // Lưu voucher vào database
        Voucher savedVoucher = voucherService.createVoucher(voucher);
        return ResponseEntity.ok(savedVoucher);
    }

    // API để lấy tất cả voucher
    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        List<Voucher> vouchers = voucherService.getAllVouchers();
        return ResponseEntity.ok(vouchers);
    }

    // API để kiểm tra tính hợp lệ của voucher
    @GetMapping("/validate/{voucherCode}")
    public ResponseEntity<Boolean> validateVoucher(@PathVariable String voucherCode) {
        boolean isValid = voucherService.isVoucherValid(voucherCode);
        return ResponseEntity.ok(isValid);
    }

    // API để lấy thông tin chi tiết của voucher theo mã
    @GetMapping("/{voucherCode}")
    public ResponseEntity<Voucher> getVoucherByCode(@PathVariable String voucherCode) {
        Voucher voucher = voucherService.getVoucherByCode(voucherCode);
        return voucher != null ? ResponseEntity.ok(voucher) : ResponseEntity.notFound().build();
    }

    // API để sửa voucher
    @PutMapping("/{voucherId}")
    public ResponseEntity<?> updateVoucher(@PathVariable Integer voucherId, @RequestBody Voucher voucher) {
        try {
            voucher.setVoucherId(voucherId); // Set voucherId để cập nhật
            Voucher updatedVoucher = voucherService.createVoucher(voucher); // Cả createVoucher đã xử lý việc cập nhật
            return ResponseEntity.ok(updatedVoucher);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error updating voucher: " + e.getMessage());
        }
    }

    // API để xóa voucher
    @DeleteMapping("/{voucherId}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Integer voucherId) {
        try {
            voucherService.deleteVoucher(voucherId); // Thực hiện xóa voucher
            return ResponseEntity.ok("Voucher deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error deleting voucher: " + e.getMessage());
        }
    }
}
