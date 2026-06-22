const Card = require('../models/Card')

const DEFAULT_CARDS = {
  achievements: [
    { id:0, init:"AS", name:"Arjun Sharma",   city:"Bhopal",   robot:"AutoPilot V3",  type:"competition",   title:"1st Place — National Robotics Championship", sub:"Autonomous Navigation · New Delhi 2025",    quote:"The ROS2 curriculum was a complete game-changer for me.",         tags:["ROS2","SLAM","Vision"],    level:"Advanced",     date:"Mar 2025" },
    { id:1, init:"PM", name:"Priya Mehta",    city:"Indore",   robot:"AgroBot 2.0",   type:"project",       title:"Best Innovation — Bhopal Science Expo",      sub:"Smart agriculture robot using ESP32",        quote:"I built something I never thought possible at my age.",           tags:["ESP32","IoT","Sensors"],   level:"Intermediate", date:"Feb 2025" },
    { id:2, init:"RV", name:"Rahul Verma",    city:"Bhopal",   robot:"LineTracer X",  type:"certification", title:"Advanced ROS2 Certification — Top of Batch", sub:"Scored 98% — Highest in Batch 14",          quote:"Every module built perfectly on the previous one.",               tags:["ROS2","Python","Nav"],     level:"Advanced",     date:"Jan 2025" },
    { id:3, init:"SP", name:"Sneha Patel",    city:"Bhopal",   robot:"MediBot",       type:"special",       title:"Youngest Project Lead — Age 13",             sub:"Led team of 4 to build a hospital robot",   quote:"Age is just a number with the right guidance.",                   tags:["Arduino","Leadership"],   level:"Beginner",     date:"Dec 2024" },
    { id:4, init:"KT", name:"Karan Trivedi",  city:"Jabalpur", robot:"PCBTrack v2",   type:"certification", title:"PCB Design & Electronics — Distinction",    sub:"Completed with distinction, Batch 11",      quote:"Designing my own PCB felt like actual engineering.",               tags:["KiCad","PCB","SMD"],       level:"Intermediate", date:"Nov 2024" },
    { id:5, init:"AR", name:"Aisha Rawat",    city:"Bhopal",   robot:"VisionBot",     type:"competition",   title:"2nd Place — MP State Robowar 2024",          sub:"Computer vision autonomous combat robot",   quote:"Competing at state level showed me what's possible.",             tags:["OpenCV","RPi","Vision"],   level:"Advanced",     date:"Oct 2024" },
    { id:6, init:"VK", name:"Vikram Kaur",    city:"Bhopal",   robot:"EcoSense",      type:"project",       title:"Smart City Challenge — Finalist",            sub:"Air quality monitoring IoT network",         quote:"Real-world impact from a school project — surreal.",               tags:["ESP32","Cloud","API"],     level:"Intermediate", date:"Sep 2024" },
    { id:7, init:"NK", name:"Naina Kapoor",   city:"Bhopal",   robot:"ChemBot",       type:"special",       title:"Girls in STEM Recognition Award",            sub:"Inspired 40+ girls to join robotics",       quote:"I want every girl to know — robotics is for us too.",             tags:["Arduino","Advocacy"],     level:"Beginner",     date:"Aug 2024" },
    { id:8, init:"RM", name:"Rajan Mishra",   city:"Sagar",    robot:"AutoDriveX",    type:"certification", title:"Python for AI & ML — 95% Score",            sub:"Top performer across all Python batches",   quote:"AI stopped feeling like magic and started feeling like maths.",   tags:["Python","ML","AI"],        level:"Advanced",     date:"Jul 2024" },
  ],
  robots: [
    { emoji:"🚗", color:"#FF6B35", rgb:"255,107,53",  type:"Line Follower / Maze Solver",   name:"AutoBot V1",    built:"1,200+ students", level:"Beginner",
      desc:"The first robot every beginner builds. Sensors detect the line, motors follow. Simple concept — deeply satisfying result.",
      specs:["Arduino Mega + IR Sensor Array","L298N Dual Motor Driver","4WD Chassis — 200 RPM","PID Control Loop"] },
    { emoji:"📡", color:"#00F5FF", rgb:"0,245,255",    type:"IoT Environmental Monitor",     name:"SensorBot Pro", built:"640+ students",   level:"Intermediate",
      desc:"Monitors temperature, humidity, air quality and streams live data to a cloud dashboard accessible from any phone.",
      specs:["ESP32 Wi-Fi + BLE","DHT22 + MQ135 Sensors","OLED 128×64 Display","AWS IoT Core Integration"] },
    { emoji:"🦾", color:"#A855F7", rgb:"168,85,247",   type:"Autonomous Navigation Robot",   name:"AutonomBot X",  built:"120+ students",   level:"Advanced",
      desc:"Self-navigates unknown environments using LIDAR, builds a real-time map, and avoids obstacles with zero human input.",
      specs:["Raspberry Pi 4 + Ubuntu 22","RPLiDAR A1M8 360°","ROS2 Humble + Nav2 Stack","TensorFlow Lite Vision"] },
    { emoji:"✋", color:"#FF006E", rgb:"255,0,110",     type:"Gesture-Controlled Robot",      name:"GestureBot",    built:"280+ students",   level:"Intermediate",
      desc:"Controlled entirely by hand gestures via flex sensors in a custom glove. No joystick, no app — just intuition.",
      specs:["Arduino Nano + Flex × 5","NRF24L01 Wireless Module","Custom Glove Controller","Real-time Response < 20ms"] },
    { emoji:"👁️", color:"#FF6B35", rgb:"255,107,53",   type:"Computer Vision Platform",      name:"VisionBot V2",  built:"95+ students",    level:"Advanced",
      desc:"Detects faces, reads QR codes, and tracks coloured objects in real time using OpenCV running on Raspberry Pi.",
      specs:["Raspberry Pi 4 + Pi Camera v2","OpenCV 4.8 + Python 3.11","Custom Flask Web Dashboard","Object Tracking @ 30 FPS"] },
  ],
  stars: [
    { init:"AS", name:"Arjun Sharma",  city:"Bhopal",   spec:"ROS2 & Autonomous Systems",   color:"#A855F7", achs:4, tags:["National Champion","Advanced Cert"] },
    { init:"PM", name:"Priya Mehta",   city:"Indore",   spec:"IoT & ESP32 Engineering",      color:"#FF6B35", achs:3, tags:["Science Expo Win","Best Innovation"] },
    { init:"RV", name:"Rahul Verma",   city:"Bhopal",   spec:"Python AI & Machine Learning", color:"#00F5FF", achs:3, tags:["Top of Batch","98% Score"] },
    { init:"SP", name:"Sneha Patel",   city:"Bhopal",   spec:"Arduino & Team Leadership",    color:"#FF006E", achs:2, tags:["Youngest Lead","Girls in STEM"] },
    { init:"KT", name:"Karan Trivedi", city:"Jabalpur", spec:"PCB Design & Electronics",     color:"#FF6B35", achs:2, tags:["PCB Certified","Distinction"] },
    { init:"AR", name:"Aisha Rawat",   city:"Bhopal",   spec:"Computer Vision & RPi",        color:"#A855F7", achs:3, tags:["State 2nd Place","Vision Expert"] },
  ],
  testimonials: [
    { q:"Nimo Labs completely changed how I see engineering. I came in knowing nothing about electronics — six months later I won a national competition. The instructors here are world-class.", name:"Arjun Sharma",  role:"Student, Age 17 — National Champion 2025", color:"#FF6B35", init:"AS" },
    { q:"I was skeptical — my daughter was only 13. But watching her lead a team of four students to build a working hospital robot made me a true believer. This program is exceptional.",   name:"Kavitha Patel", role:"Parent of Sneha Patel",                    color:"#A855F7", init:"KP" },
    { q:"The hands-on approach is what sets Nimo Labs apart. No death-by-PowerPoint. You build on Day 1, you debug on Day 2. By Day 10 you have something real to show your parents.",        name:"Priya Mehta",   role:"Student, Age 16 — Science Expo Winner",   color:"#00F5FF", init:"PM" },
    { q:"My son went from gaming all day to spending weekends voluntarily in the lab. Whatever Nimo Labs is doing — more institutions in India need to do it.",                                name:"Ramesh Verma",  role:"Parent of Rahul Verma",                    color:"#FF006E", init:"RV" },
  ],
  certs: [
    {icon:"🏅",txt:"Arduino Fundamentals",color:"#FF6B35"},{icon:"🏅",txt:"ESP32 & IoT",color:"#00F5FF"},
    {icon:"🏅",txt:"Python for AI",color:"#A855F7"},{icon:"🏅",txt:"ROS2 Advanced",color:"#FF006E"},
    {icon:"🏅",txt:"PCB Design",color:"#FF6B35"},{icon:"🏅",txt:"Computer Vision",color:"#A855F7"},
    {icon:"🏅",txt:"Raspberry Pi & Linux",color:"#00F5FF"},{icon:"🏅",txt:"Autonomous Systems",color:"#FF006E"},
  ],
  photos: [
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM.jpeg", label:"Build Kickoff Session",  date:"Apr 2025", tag:"Workshop" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (1).jpeg", label:"Chassis Assembly",     date:"Mar 2025", tag:"Build" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (2).jpeg", label:"Electronics Integration",   date:"Jun 2024", tag:"Lab" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.11 PM.jpeg", label:"Motor Configuration",          date:"Feb 2025", tag:"Build" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM.jpeg", label:"Sensor Integration",   date:"Mar 2025", tag:"Testing" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM (1).jpeg", label:"PCB Soldering Session",        date:"Jan 2025", tag:"Lab" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM.jpeg", label:"Wiring Installation",       date:"Dec 2024", tag:"Integration" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM (1).jpeg", label:"Power System Setup",    date:"Feb 2025", tag:"Testing" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.25 PM.jpeg", label:"Field Testing Phase",date:"Jan 2025",tag:"Validation" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM.jpeg", label:"Deployment Ready",            date:"Apr 2025", tag:"Complete" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM (1).jpeg", label:"Team Success Moment",      date:"Nov 2024", tag:"Milestone" },
    { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.28 PM.jpeg", label:"Final Robot Showcase",  date:"Oct 2024", tag:"Success" },
  ]
}

async function initializeCards() {
  try {
    // Clear existing cards
    await Card.deleteMany({})
    console.log('✓ Cleared existing cards')

    // Initialize each card type
    for (const [cardType, cardsData] of Object.entries(DEFAULT_CARDS)) {
      const normalizedCardType = cardType.slice(0, -1) // Convert 'achievements' to 'achievement'
      for (let i = 0; i < cardsData.length; i++) {
        await Card.create({
          cardType: normalizedCardType,
          page: 'achievements',
          index: i,
          data: cardsData[i],
          active: true,
        })
      }
    }

    console.log('✓ Cards initialized successfully with photos')
  } catch (err) {
    console.error('✗ Error initializing cards:', err.message)
  }
}

module.exports = initializeCards
