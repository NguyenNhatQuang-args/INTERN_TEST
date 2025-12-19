import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Card, message, Spin, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getCourseById, createCourse, updateCourse } from '../services/courseService';
import type { Course } from '../types';
import { COURSE_CATEGORIES, COURSE_LEVELS, DEFAULTS, ROUTES, MESSAGES } from '../constants';
import './CourseForm.css';

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
        message.error(MESSAGES.ERROR.COURSE_NOT_FOUND);
        navigate(ROUTES.COURSES);
      }
    } catch (error) {
      message.error(MESSAGES.ERROR.FETCH_COURSE);
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
        message.success(MESSAGES.SUCCESS.COURSE_UPDATED);
      } else {
        // CREATE
        await createCourse(values);
        message.success(MESSAGES.SUCCESS.COURSE_CREATED);
      }
      navigate(ROUTES.COURSES);
    } catch (error) {
      message.error(isEditMode ? MESSAGES.ERROR.UPDATE_COURSE : MESSAGES.ERROR.CREATE_COURSE);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="course-form-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <Card 
        title={isEditMode ? 'Edit Course' : 'Create New Course'}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.COURSES)}>
            Back
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            thumbnail: DEFAULTS.THUMBNAIL_URL
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
              options={[...COURSE_CATEGORIES]}
            />
          </Form.Item>

          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: 'Please select level!' }]}
          >
            <Select 
              placeholder="Select level"
              options={[...COURSE_LEVELS]}
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
              <Button onClick={() => navigate(ROUTES.COURSES)}>
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
