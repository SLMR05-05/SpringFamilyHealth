-- =====================================================
-- MIGRATION SCRIPT: Thêm các trường và bảng thiếu
-- Ngày tạo: 2025-11-26
-- Mô tả: Bổ sung các trường cần thiết cho frontend
-- =====================================================

USE FamilyHealth;

-- =====================
-- 1. Thêm trường locked vào bảng user
-- =====================
ALTER TABLE `user` ADD COLUMN `locked` BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái khóa tài khoản: TRUE = Khóa, FALSE = Kích hoạt';

-- =====================
-- 2. Thêm timestamp cho bảng user
-- =====================
ALTER TABLE `user` ADD COLUMN `created_at` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo tài khoản';
ALTER TABLE `user` ADD COLUMN `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật cuối';

-- =====================
-- 3. Thêm thông tin liên hệ cho member
-- =====================
ALTER TABLE `member` ADD COLUMN `phone` varchar(255) NULL COMMENT 'Số điện thoại member (nếu khác user)';
ALTER TABLE `member` ADD COLUMN `email` varchar(255) NULL COMMENT 'Email member (nếu khác user)';
ALTER TABLE `member` ADD COLUMN `address` text NULL COMMENT 'Địa chỉ cụ thể của member';

-- =====================
-- 4. Thêm doctor_id vào visit_history
-- =====================
ALTER TABLE `visit_history` ADD COLUMN `doctor_id` int NULL COMMENT 'Bác sĩ thực hiện khám';
ALTER TABLE `visit_history` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`);

-- =====================
-- 5. Tạo bảng doctor_approval
-- =====================
CREATE TABLE `doctor_approval` (
  `approval_id` int PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `status` varchar(50) DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED',
  `submitted_at` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày đăng ký',
  `reviewed_at` timestamp NULL COMMENT 'Ngày duyệt/từ chối',
  `reviewed_by` int NULL COMMENT 'Admin duyệt (user_id)',
  `rejection_reason` text NULL COMMENT 'Lý do từ chối (nếu có)',
  FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`),
  FOREIGN KEY (`reviewed_by`) REFERENCES `admin` (`admin_id`)
) COMMENT 'Quản lý phê duyệt tài khoản bác sĩ';

-- =====================
-- 6. Tạo bảng appointment
-- =====================
CREATE TABLE `appointment` (
  `appointment_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `appointment_date` datetime NOT NULL COMMENT 'Ngày giờ hẹn',
  `status` varchar(50) DEFAULT 'SCHEDULED' COMMENT 'SCHEDULED, COMPLETED, CANCELLED, NO_SHOW',
  `reason` text NULL COMMENT 'Lý do khám',
  `notes` text NULL COMMENT 'Ghi chú',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`)
) COMMENT 'Quản lý lịch hẹn khám bệnh';

-- =====================
-- 7. Tạo bảng notification
-- =====================
CREATE TABLE `notification` (
  `notification_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'INFO' COMMENT 'INFO, WARNING, SUCCESS, ERROR',
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) COMMENT 'Thông báo cho người dùng';

-- =====================
-- 8. Update dữ liệu hiện có
-- =====================
-- Set locked = FALSE cho tất cả user hiện tại
UPDATE `user` SET `locked` = FALSE WHERE `locked` IS NULL;

-- Set created_at cho users hiện có (giả định tất cả tạo cùng lúc)
UPDATE `user` SET `created_at` = NOW() WHERE `created_at` IS NULL;

-- =====================
-- 9. Thêm dữ liệu mẫu cho các bảng mới
-- =====================

-- Approval cho doctor hiện tại (đã được duyệt)
INSERT INTO doctor_approval (doctor_id, status, submitted_at, reviewed_at, reviewed_by) VALUES
(5, 'APPROVED', '2025-11-01 08:00:00', '2025-11-01 10:00:00', 1),
(6, 'APPROVED', '2025-11-02 08:00:00', '2025-11-02 09:30:00', 1);

-- Appointments mẫu
INSERT INTO appointment (member_id, doctor_id, appointment_date, status, reason, notes) VALUES
(4, 5, '2025-12-01 09:00:00', 'SCHEDULED', 'Tái khám huyết áp', 'Mang theo kết quả xét nghiệm'),
(5, 5, '2025-12-05 10:30:00', 'SCHEDULED', 'Khám thai định kỳ', 'Siêu âm thai'),
(6, 5, '2025-11-25 14:00:00', 'COMPLETED', 'Khám ho, sốt', 'Đã khám xong'),
(9, 6, '2025-11-28 15:00:00', 'SCHEDULED', 'Tái khám dạ dày', 'Nội soi dạ dày');

-- Notifications mẫu
INSERT INTO notification (user_id, title, message, type, is_read) VALUES
(7, 'Lịch hẹn sắp tới', 'Bạn có lịch hẹn khám vào ngày 01/12/2025 lúc 09:00', 'INFO', FALSE),
(8, 'Lịch hẹn sắp tới', 'Bạn có lịch hẹn khám vào ngày 05/12/2025 lúc 10:30', 'INFO', FALSE),
(9, 'Lịch hẹn sắp tới', 'Bạn có lịch hẹn khám vào ngày 28/11/2025 lúc 15:00', 'INFO', FALSE),
(5, 'Bệnh nhân mới', 'Bạn có lịch hẹn mới từ bệnh nhân Nguyễn Văn An', 'SUCCESS', FALSE);

-- Update visit_history với doctor_id
UPDATE visit_history SET doctor_id = 5 WHERE member_id IN (4, 5, 6, 7, 8);
UPDATE visit_history SET doctor_id = 6 WHERE member_id IN (9, 10);

COMMIT;
