package com.crm.mapper;

import com.crm.dto.user.UserResponse;
import com.crm.entity.User;
import org.mapstruct.Mapper;

@Mapper
public interface UserMapper {
    UserResponse toResponse(User user);
}
