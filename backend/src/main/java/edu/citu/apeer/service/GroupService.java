package edu.citu.apeer.service;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.*;
import edu.citu.apeer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GroupService {
    
    private final StudentGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final EvaluationActivityRepository activityRepository;
    
    public List<GroupDTO> getAllGroups() {
        return groupRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public GroupDTO createGroupSimple(CreateGroupSimpleRequest request) {
        EvaluationActivity activity = null;
        if (request.getActivityId() != null && !request.getActivityId().isEmpty()) {
            activity = activityRepository.findById(request.getActivityId())
                    .orElse(null);
        }
        
        StudentGroup group = StudentGroup.builder()
                .name(request.getName())
                .activity(activity)
                .build();
        
        group = groupRepository.save(group);
        return convertToDTO(group);
    }
    
    public GroupDTO createGroup(CreateGroupRequest request) {
        StudentGroup group = StudentGroup.builder()
                .name(request.getName())
                .build();
        
        group = groupRepository.save(group);
        
        // Assign members if provided
        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            for (String userId : request.getMemberIds()) {
                assignStudentToGroup(group.getId(), userId);
            }
        }
        
        return convertToDTO(group);
    }
    
    public GroupDTO assignStudentToGroup(String groupId, String studentId) {
        StudentGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Remove from previous group if any
        if (user.getGroup() != null) {
            StudentGroup oldGroup = user.getGroup();
            oldGroup.getMembers().remove(user);
            groupRepository.save(oldGroup);
        }
        
        // Assign to new group
        user.setGroup(group);
        userRepository.save(user);
        
        // Refresh group to get updated members list
        group = groupRepository.findById(groupId).orElse(group);
        return convertToDTO(group);
    }
    
    public void removeStudentFromGroup(String groupId, String studentId) {
        User user = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getGroup() != null && user.getGroup().getId().equals(groupId)) {
            user.setGroup(null);
            userRepository.save(user);
        }
    }
    
    public GroupDTO updateGroup(String groupId, UpdateGroupRequest request) {
        StudentGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        if (request.getName() != null) {
            group.setName(request.getName());
        }
        
        if (request.getMemberIds() != null) {
            List<User> members = userRepository.findAllById(request.getMemberIds());
            group.setMembers(members);
        }
        
        group = groupRepository.save(group);
        return convertToDTO(group);
    }
    
    public void deleteGroup(String groupId) {
        groupRepository.deleteById(groupId);
    }
    
    public GroupDTO addMemberToGroup(String groupId, String userId) {
        // Use the new assign method
        return assignStudentToGroup(groupId, userId);
    }
    
    public GroupDTO removeMemberFromGroup(String groupId, String userId) {
        removeStudentFromGroup(groupId, userId);
        StudentGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return convertToDTO(group);
    }
    
    private GroupDTO convertToDTO(StudentGroup group) {
        // Fetch members from UserRepository where group_id matches
        List<User> members = userRepository.findByGroupId(group.getId());
        List<UserDTO> memberDTOs = members.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .status(user.getStatus().name())
                        .build())
                .collect(Collectors.toList());
        
        return GroupDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .members(memberDTOs)
                .memberCount(memberDTOs.size())
                .build();
    }
}

