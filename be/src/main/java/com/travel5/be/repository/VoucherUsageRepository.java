package com.travel5.be.repository;

import com.travel5.be.entity.Voucher;
import com.travel5.be.entity.VoucherUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, Integer> {
    List<VoucherUsage> findByVoucher(Voucher voucher);
}
