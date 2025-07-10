package com.travel5.be.service;

import com.travel5.be.dto.UserDTO;
import com.travel5.be.dto.UserUpdateDTO;
import com.travel5.be.dto.request.PasswordChangeRequest;
import com.travel5.be.dto.request.RegisterRequest;
import com.travel5.be.entity.Role;
import com.travel5.be.entity.User;
import com.travel5.be.repository.RoleRepository;
import com.travel5.be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;
    @Autowired private RoleRepository roleRepo;
    @Autowired private PasswordEncoder encoder;

    public void register(RegisterRequest req) {
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setDob(req.getDob());
        user.setLoyaltyPoints(0); // ✅ thêm dòng này

        Role userRole = roleRepo.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.getRoles().add(userRole);
        userRepo.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }
    public User getUserByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    }
    public void updatePassword(String email, String newPassword) {
        User user = userRepo.findAll()
                .stream()
                .filter(u -> email.equals(u.getEmail()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        PasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);
    }
    public List<UserDTO> getAllUserDTOs() {
        return userRepo.findAll().stream().map(user -> {
            return UserDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .dob(user.getDob())
                    .loyaltyPoints(user.getLoyaltyPoints()) // ✅ Thêm dòng này
                    .roles(user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toSet()))
                    .build();
        }).toList();
    }



    public User getUserById(Integer id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
    }

    public void createUser(UserDTO dto) {
        if (userRepo.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Tên người dùng đã tồn tại");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setDob(dto.getDob());

        // ✅ Cho phép nhập loyaltyPoints, nếu null thì mặc định là 0
        user.setLoyaltyPoints(dto.getLoyaltyPoints() != null ? dto.getLoyaltyPoints() : 0);

        Set<Role> roles = dto.getRoles().stream()
                .map(roleName -> roleRepo.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Vai trò không tồn tại: " + roleName)))
                .collect(Collectors.toSet());
        user.setRoles(roles);

        userRepo.save(user);
    }

    public void updateUser(Integer id, UserDTO dto) {
        User user = getUserById(id);

        // ✅ Cho phép cập nhật username nếu khác
        if (!user.getUsername().equals(dto.getUsername())) {
            // Kiểm tra nếu username mới đã tồn tại
            if (userRepo.existsByUsername(dto.getUsername())) {
                throw new RuntimeException("Tên người dùng mới đã tồn tại");
            }
            user.setUsername(dto.getUsername());
        }

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setDob(dto.getDob());
        if (dto.getLoyaltyPoints() != null) {
            user.setLoyaltyPoints(dto.getLoyaltyPoints()); // ✅ Cho phép cập nhật điểm
        }
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(dto.getPassword()));
        }

        Set<Role> roles = dto.getRoles().stream()
                .map(roleName -> roleRepo.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Vai trò không tồn tại: " + roleName)))
                .collect(Collectors.toSet());
        user.setRoles(roles);

        userRepo.save(user);
    }
    public void deleteUser(Integer id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("Người dùng không tồn tại!");
        }
        userRepo.deleteById(id);
    }
    public List<UserDTO> searchUsers(String keyword) {
        return userRepo.searchUsersByUsernameOrName(keyword).stream().map(user -> UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .dob(user.getDob())
                        .loyaltyPoints(user.getLoyaltyPoints()) // ✅ thêm vào
                        .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                        .build())
                .collect(Collectors.toList());
    }

    public void updateUserProfile(Integer id, UserUpdateDTO dto) {
        User user = getUserById(id);

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setDob(dto.getDob());

        userRepo.save(user);
    }
    public String changePassword(Integer userId, PasswordChangeRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng!");
        }

        if (request.getNewPassword().length() < 8) {
            throw new RuntimeException("Mật khẩu mới phải có ít nhất 8 ký tự!");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepo.save(user);
        return "Đổi mật khẩu thành công!";
    }

}