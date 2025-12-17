package edu.citu.apeer.controller;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.service.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class GroupController {
    
    private final GroupService groupService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        List<GroupDTO> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<GroupDTO> createGroup(@RequestBody CreateGroupSimpleRequest request) {
        GroupDTO group = groupService.createGroupSimple(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(group);
    }
    
    @PostMapping("/{groupId}/assign")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<GroupDTO> assignStudent(
            @PathVariable String groupId,
            @RequestBody AssignStudentRequest request) {
        GroupDTO group = groupService.assignStudentToGroup(groupId, request.getStudentId());
        return ResponseEntity.ok(group);
    }
    
    @DeleteMapping("/{groupId}/remove")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Void> removeStudent(
            @PathVariable String groupId,
            @RequestParam String studentId) {
        groupService.removeStudentFromGroup(groupId, studentId);
        return ResponseEntity.noContent().build();
    }
    
    // Keep old endpoints for backward compatibility
    @GetMapping("/teacher/groups")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<GroupDTO>> getAllGroupsOld() {
        return getAllGroups();
    }
    
    @PostMapping("/teacher/groups")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<GroupDTO> createGroupOld(@RequestBody CreateGroupRequest request) {
        GroupDTO group = groupService.createGroup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(group);
    }
    
    @PostMapping("/teacher/groups/{groupId}/members/{userId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<GroupDTO> addMember(
            @PathVariable String groupId,
            @PathVariable String userId) {
        GroupDTO group = groupService.addMemberToGroup(groupId, userId);
        return ResponseEntity.ok(group);
    }
    
    @DeleteMapping("/teacher/groups/{groupId}/members/{userId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<GroupDTO> removeMember(
            @PathVariable String groupId,
            @PathVariable String userId) {
        GroupDTO group = groupService.removeMemberFromGroup(groupId, userId);
        return ResponseEntity.ok(group);
    }
}

