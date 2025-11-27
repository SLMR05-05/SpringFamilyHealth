package com.example.backend.dto.response;

import java.util.List;

public class FamilyDashboardResponse {
    private FamilyInfo family;
    private List<MemberInfo> members;
    private StatisticsInfo statistics;
    private List<AppointmentInfo> upcomingAppointments;
    private List<NotificationInfo> recentNotifications;

    public static class FamilyInfo {
        private Integer familyId;
        private String address;
        private String contactNumber;
        private String doctorName;

        public Integer getFamilyId() { return familyId; }
        public void setFamilyId(Integer familyId) { this.familyId = familyId; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getContactNumber() { return contactNumber; }
        public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    }

    public static class MemberInfo {
        private Integer memberId;
        private String name;
        private Integer age;
        private String dayOfBirth;
        private String gender;
        private String roleInFamily;
        private String relationship;
        private String phone;
        private String email;
        private String address;
        private Float weight;
        private Float height;
        private String bloodType;
        private String allergies;
        private String chronicConditions;
        private String lastVisit;
        private String status;

        public Integer getMemberId() { return memberId; }
        public void setMemberId(Integer memberId) { this.memberId = memberId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Integer getAge() { return age; }
        public void setAge(Integer age) { this.age = age; }
        public String getDayOfBirth() { return dayOfBirth; }
        public void setDayOfBirth(String dayOfBirth) { this.dayOfBirth = dayOfBirth; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getRoleInFamily() { return roleInFamily; }
        public void setRoleInFamily(String roleInFamily) { this.roleInFamily = roleInFamily; }
        public String getRelationship() { return relationship; }
        public void setRelationship(String relationship) { this.relationship = relationship; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public Float getWeight() { return weight; }
        public void setWeight(Float weight) { this.weight = weight; }
        public Float getHeight() { return height; }
        public void setHeight(Float height) { this.height = height; }
        public String getBloodType() { return bloodType; }
        public void setBloodType(String bloodType) { this.bloodType = bloodType; }
        public String getAllergies() { return allergies; }
        public void setAllergies(String allergies) { this.allergies = allergies; }
        public String getChronicConditions() { return chronicConditions; }
        public void setChronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; }
        public String getLastVisit() { return lastVisit; }
        public void setLastVisit(String lastVisit) { this.lastVisit = lastVisit; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class StatisticsInfo {
        private Integer totalMembers;
        private Integer healthyMembers;
        private Integer needAttention;
        private Integer upcomingAppointments;
        private Integer unreadNotifications;

        public Integer getTotalMembers() { return totalMembers; }
        public void setTotalMembers(Integer totalMembers) { this.totalMembers = totalMembers; }
        public Integer getHealthyMembers() { return healthyMembers; }
        public void setHealthyMembers(Integer healthyMembers) { this.healthyMembers = healthyMembers; }
        public Integer getNeedAttention() { return needAttention; }
        public void setNeedAttention(Integer needAttention) { this.needAttention = needAttention; }
        public Integer getUpcomingAppointments() { return upcomingAppointments; }
        public void setUpcomingAppointments(Integer upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
        public Integer getUnreadNotifications() { return unreadNotifications; }
        public void setUnreadNotifications(Integer unreadNotifications) { this.unreadNotifications = unreadNotifications; }
    }

    public static class AppointmentInfo {
        private Integer appointmentId;
        private String title;
        private String patientName;
        private String date;
        private String doctorName;
        private String status;

        public Integer getAppointmentId() { return appointmentId; }
        public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class NotificationInfo {
        private Integer notificationId;
        private String title;
        private String message;
        private String date;
        private String priority;

        public Integer getNotificationId() { return notificationId; }
        public void setNotificationId(Integer notificationId) { this.notificationId = notificationId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }

    public static class MedicalRecordInfo {
        private Integer recordId;
        private String type;
        private String title;
        private String patientName;
        private String date;
        private String diagnosis;
        private String followUpDate;
        private String status;

        public Integer getRecordId() { return recordId; }
        public void setRecordId(Integer recordId) { this.recordId = recordId; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
        public String getFollowUpDate() { return followUpDate; }
        public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public FamilyInfo getFamily() { return family; }
    public void setFamily(FamilyInfo family) { this.family = family; }
    public List<MemberInfo> getMembers() { return members; }
    public void setMembers(List<MemberInfo> members) { this.members = members; }
    public StatisticsInfo getStatistics() { return statistics; }
    public void setStatistics(StatisticsInfo statistics) { this.statistics = statistics; }
    public List<AppointmentInfo> getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(List<AppointmentInfo> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
    public List<NotificationInfo> getRecentNotifications() { return recentNotifications; }
    public void setRecentNotifications(List<NotificationInfo> recentNotifications) { this.recentNotifications = recentNotifications; }
}
