import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Card, message, Spin, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getCourseById, createCourse, updateCourse } from '../services/courseService';
import type { Course } from '../types';

const { TextArea } = Input;

const CourseForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const course = await getCourseById(Number(id));
      if (course) {
        form.setFieldsValue(course);
      } else {
        message.error('Course not found');
        navigate('/courses');
      }
    } catch (error) {
      message.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: Omit<Course, 'id'>) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        // UPDATE
        await updateCourse({ ...values, id: Number(id) });
        message.success('Course updated successfully');
      } else {
        // CREATE
        await createCourse(values);
        message.success('Course created successfully');
      }
      navigate('/courses');
    } catch (error) {
      message.error(`Failed to ${isEditMode ? 'update' : 'create'} course`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Card 
        title={isEditMode ? 'Edit Course' : 'Create New Course'}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/courses')}>
            Back
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            thumbnail: 'https://dummyjson.com/image/150'
          }}
        >
          <Form.Item
            label="Course Title"
            name="title"
            rules={[{ required: true, message: 'Please enter course title!' }]}
          >
            <Input placeholder="Enter course title" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select 
              placeholder="Select category"
              options={[
                { value: 'SPEAKING', label: 'SPEAKING' },
                { value: 'VOCABULARY', label: 'VOCABULARY' },
                { value: 'GRAMMAR', label: 'GRAMMAR' },
                { value: '4SKILLS', label: '4 Skills' },
                { value: 'WRITING', label: 'WRITING' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: 'Please select level!' }]}
          >
            <Select 
              placeholder="Select level"
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
                { value: 'Total Comprehension', label: 'Total Comprehension' },
                { value: 'Elementary', label: 'Elementary' },
                { value: 'Upper Intermediate', label: 'Upper Intermediate' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>

          <Form.Item
            label="Thumbnail URL"
            name="thumbnail"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => navigate('/courses')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CourseForm;
