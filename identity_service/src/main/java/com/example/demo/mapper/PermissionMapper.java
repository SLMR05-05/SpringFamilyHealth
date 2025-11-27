package com.example.demo.mapper;

import com.example.demo.DTO.request.PermissionRequest;
import com.example.demo.DTO.response.PermissionResponse;
import com.example.demo.Entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
