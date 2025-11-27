package com.example.demo.mapper;

import com.example.demo.DTO.request.PermissionRequest;
import com.example.demo.DTO.request.RoleRequest;
import com.example.demo.DTO.response.PermissionResponse;
import com.example.demo.DTO.response.RoleResponse;
import com.example.demo.Entity.Permission;
import com.example.demo.Entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
