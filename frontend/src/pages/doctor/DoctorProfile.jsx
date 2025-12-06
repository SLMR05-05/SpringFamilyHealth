import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import doctorApi from '../../api/doctorApi';
import userApi from '../../api/userApi';

export default function DoctorProfile() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [doctor, setDoctor] = useState(null);

  // derive doctor id from localStorage (fallback)
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();
  const effectiveDoctorId = storedUser.doctorId ?? storedUser.userId ?? storedUser.id ?? null;

  const [form] = Form.useForm();

  useEffect(() => {
    const load = async () => {
      if (!effectiveDoctorId) return;
      setLoading(true);
      try {
        const resp = await doctorApi.getById(effectiveDoctorId);
        const data = resp?.data || resp || {};
        setDoctor(data);
        // populate form
        form.setFieldsValue({
          name: data.name,
          email: data.email,
          phone: data.phone,
          certificateNumber: data.certificateNumber,
          specialization: data.specialization,
          address: data.address,
          clinicName: data.clinicName,
          yearsOfExperience: data.yearsOfExperience,
          education: data.education,
          languagesSpoken: data.languagesSpoken,
          consultationFee: data.consultationFee,
        });
      } catch (err) {
        console.error('Failed to load doctor profile', err);
        message.error('Không thể tải thông tin bác sĩ');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [effectiveDoctorId, form]);

  const onFinish = async (values) => {
    if (!effectiveDoctorId || !doctor) {
      message.error('Không có thông tin bác sĩ để cập nhật');
      return;
    }

    setSaving(true);
    try {
      // 1) try update user profile (may be blocked by backend security)
      try {
        await userApi.updateMe({ name: values.name, phone: values.phone, email: values.email });
      } catch (e) {
        // show warning but continue
        console.warn('Failed to update user profile', e);
        message.warning('Không thể cập nhật thông tin cá nhân (email/ tên). Kiểm tra phân quyền.');
      }

      // 2) update doctor-specific fields
      const payload = {
        userId: doctor.userId,
        certificateNumber: values.certificateNumber,
        specialization: values.specialization,
        address: values.address,
        clinicName: values.clinicName,
        yearsOfExperience: values.yearsOfExperience,
        education: values.education,
        languagesSpoken: values.languagesSpoken,
        consultationFee: values.consultationFee,
      };
      await doctorApi.update(effectiveDoctorId, payload);

      message.success('Cập nhật thông tin thành công');
      // reload
      const resp = await doctorApi.getById(effectiveDoctorId);
      const data = resp?.data || resp || {};
      setDoctor(data);
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
        certificateNumber: data.certificateNumber,
        specialization: data.specialization,
        address: data.address,
        clinicName: data.clinicName,
        yearsOfExperience: data.yearsOfExperience,
        education: data.education,
        languagesSpoken: data.languagesSpoken,
        consultationFee: data.consultationFee,
      });
    } catch (err) {
      console.error('Failed to save profile', err);
      message.error('Lưu thông tin thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8"><Spin size="large" /></div>;

  return (
    <div className="p-6">
      <Card title="Hồ sơ bác sĩ" bordered>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{}}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item name="certificateNumber" label="Mã chứng chỉ hành nghề" rules={[{ required: true, message: 'Nhập mã chứng chỉ' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="specialization" label="Chuyên môn">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="clinicName" label="Tên phòng khám/Bệnh viện">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ phòng khám">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="yearsOfExperience" label="Số năm kinh nghiệm">
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item name="education" label="Trình độ học vấn">
            <Input.TextArea rows={3} placeholder="VD: Bác sĩ Đại học Y Hà Nội, Thạc sĩ Tim mạch..." />
          </Form.Item>

          <Form.Item name="languagesSpoken" label="Ngôn ngữ">
            <Input placeholder="VD: Tiếng Việt, English" />
          </Form.Item>

          <Form.Item name="consultationFee" label="Phí tư vấn (VNĐ)">
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
