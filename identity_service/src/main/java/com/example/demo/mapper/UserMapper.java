package com.example.demo.mapper;

import com.example.demo.DTO.request.UserCreationRequest;
import com.example.demo.DTO.request.UserUpdateRequest;
import com.example.demo.DTO.response.UserResponse;
import com.example.demo.Entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

//    @Mapping(source = "firstName", target = "lastName")
//    @Mapping(target = "lastName", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    UserResponse toUserResponse(User user);
}
