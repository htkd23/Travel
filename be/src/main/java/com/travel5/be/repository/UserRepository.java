package com.travel5.be.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.travel5.be.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByUsername(String username);  // Đổi kiểu từ Integer thành String
    Optional<User> findByUsername(String username);
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findUsersByRole(@Param("roleName") String roleName);
    @Query("""
    SELECT u FROM User u
    WHERE LOWER(CONCAT(u.firstName, ' ', u.lastName))
        LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<User> searchUsersByName(@Param("keyword") String keyword);
    @Query("""
    SELECT u FROM User u
    WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<User> searchUsersByUsernameOrName(@Param("keyword") String keyword);

}