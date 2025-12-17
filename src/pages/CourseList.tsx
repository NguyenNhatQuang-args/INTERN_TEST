import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, Button, Input, Select, Space, Popconfirm, message, Card, Image 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAuth } from '../contexts/AuthContext';
import { getCourses, deleteCourse } from '../services/courseService';
import type { Course, CourseFilter } from '../types';

const { Search } = Input;

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // 10 items per page
  const [filters, setFilters] = useState<CourseFilter>({});
  
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const result = await getCourses(page, pageSize, filters);
      setCourses(result.data);
      setTotal(result.total);
    } catch (error) {
      message.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, filters]);

  // Handle search by title
  const handleSearch = (value: string) => {
    setPage(1);
    setFilters(prev => ({ ...prev, title: value }));
  };

  // Handle filter by category
  const handleCategoryChange = (value: string | undefined) => {
    setPage(1);
    setFilters(prev => ({ ...prev, category: value }));
  };

  // Handle filter by level
  const handleLevelChange = (value: string | undefined) => {
    setPage(1);
    setFilters(prev => ({ ...prev, level: value }));
  };

  // Handle pagination change
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current || 1);
  };

  // Navigate to Create page
  const handleCreate = () => {
    navigate('/courses/add');
  };

  // Navigate to Edit page
  const handleEdit = (id: number | string) => {
    navigate(`/courses/edit/${id}`);
  };

  // Handle Delete
  const handleDelete = async (id: number | string) => {
    try {
      await deleteCourse(id);
      message.success('Course deleted successfully');
      fetchCourses(); // Reload table
    } catch (error) {
      message.error('Failed to delete course');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Table columns definition
  const columns: ColumnsType<Course> = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (url: string) => <Image src={url} width={50} height={50} />
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 200,
      render: (level: string) => {
        const colors: Record<string, string> = {
          Beginner: 'green',
          Intermediate: 'orange',
          Advanced: 'red',
          'Total Comprehension': 'gray',
          Elementary: 'gray',
          'Upper Intermediate': 'gray'
        };
        return <span style={{ color: colors[level] || 'gray' }}>{level}</span>;
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Course"
            description="Are you sure to delete this course?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img 
              src="https://jaxtina.com/wp-content/themes/jax2024/img/logo.svg" 
              alt="Logo" 
              style={{ height: 40 }} 
            />
            <h1 style={{ margin: 0 }}>Course Management</h1>
          </div>
          <Space>
            <span>Welcome, {user?.firstName || 'User'}!</span>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </div>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="Search by title"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Select Category"
            allowClear
            style={{ width: 150 }}
            onChange={handleCategoryChange}
            options={[
              { value: 'SPEAKING', label: 'SPEAKING' },
              { value: 'VOCABULARY', label: 'VOCABULARY' },
              { value: 'GRAMMAR', label: 'GRAMMAR' },
              { value: '4SKILLS', label: '4 Skills' },
              { value: 'WRITING', label: 'WRITING' },
            ]}
          />
          <Select
            placeholder="Select Level"
            allowClear
            style={{ width: 150 }}
            onChange={handleLevelChange}
            options={[
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
              { value: 'Total Comprehension', label: 'Total Comprehension' },
              { value: 'Elementary', label: 'Elementary' },
              { value: 'Upper Intermediate', label: 'Upper Intermediate' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Course
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} courses`
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default CourseList;
