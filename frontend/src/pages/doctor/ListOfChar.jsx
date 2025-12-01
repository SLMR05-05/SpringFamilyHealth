// PatientListPage.jsx (Đã cập nhật để thêm Modal)

import React, { useState, useEffect } from 'react';
import { Card, Layout, Typography } from 'antd';
// Giả định component Modal được import từ đường dẫn hợp lệ
import PatientRecordModal from '../../components/modal/PatientRecordModal'; // Cần chắc chắn đường dẫn này đúng
import PatientListItem from '../../components/modal/PatientListItem.jsx'; 
import { useOutletContext } from 'react-router-dom';
import doctorApi from '../../api/doctorApi';
import memberApi from '../../api/memberApi';

const { Title, Paragraph } = Typography;

// Dữ liệu mẫu (Giữ nguyên)
const familyMembers = [
    {
        name: 'Trần Thị Bình', age: 38, gender: 'Nữ', role: 'Chủ hộ', priority: 'Trung bình',
        phone: '0902345678', email: 'binh.tran@email.com', lastCheckup: '20/9/2024', nextAppointment: '20/10/2024'
        // Thêm trường dữ liệu chi tiết cho Modal (ví dụ: medicalHistory)
    },
    {
        name: 'Võ Đức Nam', age: 40, gender: 'Nam', role: 'Chồng', priority: 'Thấp',
        phone: '0902345679', email: 'nam.vo@email.com', lastCheckup: '12/9/2024', nextAppointment: '12/10/2024'
    },
    {
        name: 'Trần Minh Khôi', age: 12, gender: 'Nam', role: 'Con trai', priority: 'Thấp',
        phone: '0902345680', email: 'khoi.tran@email.com', lastCheckup: '18/9/2024', nextAppointment: '18/12/2024'
    },
];

const PatientListPage = () => {
    // 1. STATE QUẢN LÝ
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy selectedFamily từ HorizontalLayout (Outlet context)
    const { selectedFamily } = useOutletContext();

    // 2. Fetch patients của bác sĩ và lọc theo selectedFamily
    useEffect(() => {
        const loadPatients = async () => {
            if (!selectedFamily) {
                setPatients([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.userId) {
                    setPatients([]);
                    return;
                }

                const resp = await doctorApi.getPatients(user.userId);
                const allPatients = resp?.data || resp || [];
                const familyPatients = allPatients.filter(p => p.familyId === selectedFamily.familyId);
                setPatients(familyPatients);
            } catch (error) {
                console.error('Lỗi khi tải danh sách bệnh nhân:', error);
                setPatients([]);
            } finally {
                setLoading(false);
            }
        };

        loadPatients();
    }, [selectedFamily]);

    // 3. HÀM XỬ LÝ MỞ MODAL (có thể fetch chi tiết member nếu cần)
    const handleViewRecord = async (patient) => {
        try {
            // Nếu patient có memberId, fetch chi tiết từ memberApi
            if (patient.memberId) {
                const resp = await memberApi.getById(patient.memberId);
                const member = resp?.data || resp || patient;
                setSelectedPatient(member);
            } else {
                setSelectedPatient(patient);
            }
            setIsModalOpen(true);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết bệnh nhân:', error);
            setSelectedPatient(patient);
            setIsModalOpen(true);
        }
    };

    // 3. HÀM XỬ LÝ SỰ KIỆN ĐÓNG MODAL
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Có thể giữ hoặc xóa selectedPatient tùy logic
        // setSelectedPatient(null); 
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Card className="shadow-lg">
            {/* Tiêu đề Trang */}
            <header className="mb-6">
                <Title level={2} className="m-0 text-2xl font-bold">
                    Danh sách bệnh nhân - {selectedFamily?.familyName || `Gia đình #${selectedFamily?.familyId || ''}`}
                </Title>
                <Paragraph className="text-gray-500 mt-1">
                    Quản lý và theo dõi {patients.length} bệnh nhân trong gia đình
                </Paragraph>
            </header>

            {/* Danh sách Bệnh nhân */}
            <section className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">Đang tải danh sách bệnh nhân...</div>
                ) : patients.length === 0 ? (
                    <div className="text-center py-8">Không có bệnh nhân trong gia đình này</div>
                ) : (
                    patients.map((patient, index) => (
                        <PatientListItem 
                            key={patient.memberId || index} 
                            patient={patient} 
                            onViewRecord={handleViewRecord}
                        />
                    ))
                )}
            </section>

            {/* MODAL (Nằm ở đây để quản lý trạng thái) */}
            {selectedPatient && (
                <PatientRecordModal
                    isVisible={isModalOpen}
                    onClose={handleCloseModal}
                    // Truyền dữ liệu bệnh nhân đã chọn (cần đảm bảo cấu trúc dữ liệu phù hợp với Modal)
                    patientData={selectedPatient} 
                />
            )}
            </Card>
        </div>
    );
};

export default PatientListPage;