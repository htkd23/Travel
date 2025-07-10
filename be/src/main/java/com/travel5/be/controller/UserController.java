package com.travel5.be.controller;

import com.travel5.be.dto.UserDTO;
import com.travel5.be.dto.UserUpdateDTO;
import com.travel5.be.dto.request.PasswordChangeRequest;
import com.travel5.be.entity.User;
import com.travel5.be.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Lấy toàn bộ danh sách user
    @GetMapping
    public List<UserDTO> getAllUserDTOs() {
        return userService.getAllUserDTOs();
    }

    // Lấy chi tiết 1 user theo ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }
    @PostMapping
    public String createUser(@Valid @RequestBody UserDTO dto) {
        userService.createUser(dto);
        return "Tạo người dùng thành công!";
    }
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return "Xóa người dùng thành công!";
    }
    @GetMapping("/search")
    public List<UserDTO> search(@RequestParam String keyword) {
        return userService.searchUsers(keyword);
    }
    @PutMapping("/{id}/profile")
    public String updateProfile(@PathVariable Integer id, @RequestBody UserUpdateDTO dto) {
        userService.updateUserProfile(id, dto);
        return "Cập nhật thông tin cá nhân thành công!";
    }
    @PutMapping("/change-password/{id}")
    public String changePassword(@PathVariable Integer id, @RequestBody PasswordChangeRequest request) {
        return userService.changePassword(id, request);
    }
    @PutMapping("/{id}")
    public String updateUser(@Valid @PathVariable Integer id, @RequestBody UserDTO dto) {
        userService.updateUser(id, dto);
        return "Cập nhật người dùng thành công!";
    }
}
