package com.travel5.be.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class DashboardStats {
    private long totalBookings;
    private double totalRevenue;
    private List<MonthlyStat> monthlyStats;
    private List<TopTourStat> topTours;
    private long domesticTours;  // Thêm trường cho số lượng tour nội địa
    private long internationalTours;  // Thêm trường cho số lượng tour quốc tế

    @Getter
    @Setter
    @NoArgsConstructor
    public static class MonthlyStat {
        private String month;
        private long bookings;
        private double revenue;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class TopTourStat {
        private String tourName;
        private long bookings;
        private double revenue;
        private Integer tourId;      // Thêm dòng này
        private String imagePath;    // Thêm dòng này
    }

}
