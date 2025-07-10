package com.travel5.be.entity;

public enum TourActivityStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive");

    private String status;

    TourActivityStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return this.status;
    }

    public static TourActivityStatus fromString(String status) {
        for (TourActivityStatus ts : TourActivityStatus.values()) {
            if (ts.status.equalsIgnoreCase(status)) {
                return ts;
            }
        }
        throw new IllegalArgumentException("No enum constant " + TourActivityStatus.class.getCanonicalName() + "." + status);
    }
}
