package com.travel5.be.service;

import com.travel5.be.entity.Voucher;
import com.travel5.be.entity.VoucherStatus;
import com.travel5.be.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    // Kiểm tra tính hợp lệ của voucher
    public boolean isVoucherValid(String voucherCode) {
        Optional<Voucher> voucherOpt = voucherRepository.findByVoucherCode(voucherCode);
        if (voucherOpt.isPresent()) {
            Voucher voucher = voucherOpt.get();
            LocalDate today = LocalDate.now();
            return !(today.isBefore(voucher.getValidFrom()) || today.isAfter(voucher.getValidTo()) || voucher.getStatus() == VoucherStatus.USED);
        }
        return false;
    }

    // Đánh dấu voucher đã sử dụng
    public void markVoucherAsUsed(Voucher voucher) {
        voucher.setStatus(VoucherStatus.USED);
        voucherRepository.save(voucher);
    }

    // Tạo hoặc cập nhật voucher
    public Voucher createVoucher(Voucher voucher) {
        // Kiểm tra xem voucher có hợp lệ không
        if (voucher.getDiscountPercentage().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Discount percentage must be greater than 0.");
        }

        return voucherRepository.save(voucher);
    }

    // Lấy voucher theo mã
    public Voucher getVoucherByCode(String voucherCode) {
        return voucherRepository.findByVoucherCode(voucherCode).orElse(null);
    }

    // Lấy tất cả voucher
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    // Xóa voucher theo ID
    public void deleteVoucher(Integer voucherId) {
        Optional<Voucher> voucher = voucherRepository.findById(voucherId);
        if (voucher.isPresent()) {
            voucherRepository.delete(voucher.get());
        } else {
            throw new RuntimeException("Voucher not found");
        }
    }
}
