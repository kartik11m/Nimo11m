const Course = require('../models/Course')

async function initializeCourses() {
  try {
    const count = await Course.countDocuments()
    if (count > 0) {
      console.log(`✓ Courses already initialized (${count} courses found)`)
      return
    }

    const defaultCourses = [
      {
        courseId: 'course-001',
        title: 'Arduino Masterclass',
        sub: 'Embedded Systems',
        level: 'beginner',
        category: 'hardware',
        description: 'From zero to hero with Arduino. Learn microcontroller basics, sensor interfacing, actuators, and build 10+ real-world projects.',
        duration: '8 Weeks',
        sessions: '24 Sessions',
        students: '2,400+',
        modules: ['Microcontroller Basics', 'Digital & Analog I/O', 'Sensors & Actuators', 'Serial Communication (I2C, SPI)', 'OLED Displays & Motors', 'Final Capstone Project'],
        price: '₹2,999',
        order: 0,
      },
      {
        courseId: 'course-002',
        title: 'ESP32 & IoT Dev',
        sub: 'Internet of Things',
        level: 'intermediate',
        category: 'hardware',
        description: 'Master the ESP32 ecosystem — WiFi/BLE programming, cloud connectivity, MQTT, and build smart home & industrial monitoring systems.',
        duration: '10 Weeks',
        sessions: '30 Sessions',
        students: '1,800+',
        modules: ['ESP32 Architecture', 'WiFi & BLE Programming', 'MQTT & Cloud (AWS/GCP)', 'Web Dashboards', 'Deep Sleep & Power Mgmt', 'Smart Home Project'],
        price: '₹3,999',
        order: 1,
      },
      {
        courseId: 'course-003',
        title: 'Raspberry Pi & Linux',
        sub: 'Single-Board Computing',
        level: 'intermediate',
        category: 'hardware',
        description: 'Explore Linux, Python programming, computer vision with OpenCV, and build a complete AI-enabled smart camera system from scratch.',
        duration: '8 Weeks',
        sessions: '24 Sessions',
        students: '1,200+',
        modules: ['Linux CLI Basics', 'Python on RPi', 'GPIO & Hardware Control', 'OpenCV Vision', 'Flask API Server', 'Smart Camera Build'],
        price: '₹3,499',
        order: 2,
      },
      {
        courseId: 'course-004',
        title: 'Python for AI & ML',
        sub: 'Artificial Intelligence',
        level: 'beginner',
        category: 'software',
        description: 'Start your AI journey with Python. Covers NumPy, Pandas, Scikit-learn, and builds up to training real machine learning models.',
        duration: '12 Weeks',
        sessions: '36 Sessions',
        students: '3,100+',
        modules: ['Python Fundamentals', 'NumPy & Pandas', 'Data Visualization', 'Scikit-learn Basics', 'Neural Networks Intro', 'ML Project Deployment'],
        price: '₹4,499',
        order: 3,
      },
      {
        courseId: 'course-005',
        title: 'Robotics with ROS',
        sub: 'Robot Operating System',
        level: 'advanced',
        category: 'robotics',
        description: 'Industry-standard ROS2 for building autonomous robots. Covers SLAM, navigation, robot perception, and simulation in Gazebo.',
        duration: '14 Weeks',
        sessions: '42 Sessions',
        students: '680+',
        modules: ['ROS2 Architecture', 'Nodes, Topics & Services', 'URDF Robot Modeling', 'SLAM & Mapping', 'Autonomous Navigation', 'Gazebo Simulation'],
        price: '₹6,999',
        order: 4,
      },
      {
        courseId: 'course-006',
        title: 'PCB Design & Electronics',
        sub: 'Hardware Engineering',
        level: 'intermediate',
        category: 'hardware',
        description: 'Design and manufacture professional PCBs using KiCad. From schematic capture to Gerber files and SMD soldering techniques.',
        duration: '6 Weeks',
        sessions: '18 Sessions',
        students: '950+',
        modules: ['Schematic Design', 'PCB Layout Rules', 'KiCad Workflow', 'DFM & Fabrication', 'SMD Soldering', 'Functional PCB Project'],
        price: '₹2,499',
        order: 5,
      },
    ]

    await Course.insertMany(defaultCourses)
    console.log(`📚 Default courses initialized (${defaultCourses.length} courses created)`)
  } catch (error) {
    console.error('Error initializing courses:', error.message)
  }
}

module.exports = initializeCourses
