package com.travel5.be.service;

import com.travel5.be.dto.DashboardStats;
import com.travel5.be.repository.BookingRepository;
import com.travel5.be.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;
import com.travel5.be.entity.TourType;  // Thêm dòng import này vào

@Service
public class DashboardService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();

        List<Object[]> rawData = bookingRepository.countAndSumByMonth();
        long totalBookings = 0;
        double totalRevenue = 0;

        List<DashboardStats.MonthlyStat> monthlyStats = new ArrayList<>();
        for (Object[] row : rawData) {
            int monthNum = (int) row[0];
            long bookings = ((Number) row[1]).longValue();
            double revenue = ((Number) row[2]).doubleValue();  // Thay đổi chỗ này nếu cần lấy giá đã giảm

            DashboardStats.MonthlyStat stat = new DashboardStats.MonthlyStat();
            stat.setMonth(Month.of(monthNum).getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            stat.setBookings(bookings);
            stat.setRevenue(revenue);

            monthlyStats.add(stat);
            totalBookings += bookings;
            totalRevenue += revenue;
        }

        stats.setTotalBookings(totalBookings);
        stats.setTotalRevenue(totalRevenue);  // Doanh thu sẽ được tính từ giá đã giảm
        stats.setMonthlyStats(monthlyStats);

        // Lấy danh sách các tour được đặt nhiều nhất
        List<Object[]> topTourData = bookingRepository.findTopTourStats();
        List<DashboardStats.TopTourStat> topTours = new ArrayList<>();
        for (int i = 0; i < Math.min(5, topTourData.size()); i++) {
            Object[] row = topTourData.get(i);
            String tourName = (String) row[0];
            long bookings = ((Number) row[1]).longValue();
            double revenue = ((Number) row[2]).doubleValue();
            Integer tourId = (Integer) row[3];
            String imagePath = (String) row[4];

            DashboardStats.TopTourStat tourStat = new DashboardStats.TopTourStat();
            tourStat.setTourName(tourName);
            tourStat.setBookings(bookings);
            tourStat.setRevenue(revenue);
            tourStat.setTourId(tourId);
            tourStat.setImagePath(imagePath);

            topTours.add(tourStat);
        }

        stats.setTopTours(topTours);

        // Tính số lượng tour quốc tế và nội địa
        long domesticTours = tourRepository.countToursByType(TourType.domestic);
        long internationalTours = tourRepository.countToursByType(TourType.international);

        stats.setDomesticTours(domesticTours);
        stats.setInternationalTours(internationalTours);

        return stats;
    }

}
