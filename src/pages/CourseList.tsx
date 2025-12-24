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
import { 
  COURSE_CATEGORIES, 
  COURSE_LEVELS, 
  LEVEL_COLORS, 
  PAGINATION, 
  DEFAULTS, 
  ROUTES, 
  MESSAGES 
} from '../constants';
import './CourseList.css';

const { Search } = Input;

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [pageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
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
      message.error(MESSAGES.ERROR.FETCH_COURSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, filters]);

  // Handle search by title
  const handleSearch = (value: string) => {
    setPage(PAGINATION.DEFAULT_PAGE);
    setFilters(prev => ({ ...prev, title: value }));
  };

  // Handle filter by category
  const handleCategoryChange = (value: string | undefined) => {
    setPage(PAGINATION.DEFAULT_PAGE);
    setFilters(prev => ({ ...prev, category: value }));
  };

  // Handle filter by level
  const handleLevelChange = (value: string | undefined) => {
    setPage(PAGINATION.DEFAULT_PAGE);
    setFilters(prev => ({ ...prev, level: value }));
  };

  // Handle pagination change
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current || PAGINATION.DEFAULT_PAGE);
  };

  // Navigate to Create page
  const handleCreate = () => {
    navigate(ROUTES.COURSE_ADD);
  };

  // Navigate to Edit page
  const handleEdit = (id: number | string) => {
    navigate(`/courses/edit/${id}`);
  };

  // Handle Delete
  const handleDelete = async (id: number | string) => {
    try {
      await deleteCourse(id);
      message.success(MESSAGES.SUCCESS.COURSE_DELETED);
      fetchCourses(); // Reload table
    } catch (error) {
      message.error(MESSAGES.ERROR.DELETE_COURSE);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
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
        const levelKey = level.toLowerCase().replace(/\s+/g, '-');
        const colorClass = LEVEL_COLORS[level] ? `level-${levelKey}` : 'level-default';
        return <span className={colorClass}>{level}</span>;
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
    <div className="course-list-container">
      {/* Header */}
      <Card className="course-list-header">
        <div className="course-list-header-content">
          <div className="course-list-brand">
            <img 
              src={DEFAULTS.LOGO_URL} 
              alt="Logo" 
              className="course-list-logo" 
            />
            <h1 className="course-list-title">Course Management</h1>
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
      <Card className="course-list-filters">
        <Space wrap>
          <Search
            placeholder="Search by title"
            allowClear
            onSearch={handleSearch}
            className="course-list-search"
          />
          <Select
            placeholder="Select Category"
            allowClear
            className="course-list-select"
            onChange={handleCategoryChange}
            options={[...COURSE_CATEGORIES]}
          />
          <Select
            placeholder="Select Level"
            allowClear
            className="course-list-select"
            onChange={handleLevelChange}
            options={[...COURSE_LEVELS]}
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
