package com.travel5.be.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRequest {
    private Integer userId;
    private Integer tourId;
}
