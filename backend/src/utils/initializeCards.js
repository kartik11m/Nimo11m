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
  ],
  labs: [
    { id:1, name:'Robotics Lab', icon:'🤖', color:'#FF6B35', rgb:'255,107,53', tagline:'Build. Program. Compete.', desc:'End-to-end robotics infrastructure featuring workstations, robot kits, and a dedicated competition floor.', area:'400–800 sq ft', capacity:'24–32 Students', timeline:'4–6 Weeks', equipment:['Arduino & ESP32 kits','Robotic arm units','Sensor arrays','PCB fabrication tools','Competition arena'], suited:['school','institution','government','private'], tier:'Core' },
    { id:2, name:'AI & ML Lab', icon:'🧠', color:'#00F5FF', rgb:'0,245,255', tagline:'Train models. Deploy intelligence.', desc:'GPU-enabled workstations with pre-loaded AI frameworks, vision systems, and edge compute devices.', area:'300–600 sq ft', capacity:'20–28 Students', timeline:'3–5 Weeks', equipment:['GPU workstations','Raspberry Pi clusters','USB cameras & sensors','TFLite deployment kits','Cloud subscriptions'], suited:['institution','government','private'], tier:'Advanced' },
    { id:3, name:'ATL Lab', icon:'🔬', color:'#A855F7', rgb:'168,85,247', tagline:'AIM-compliant. Fully certified.', desc:'Atal Tinkering Lab setup aligned with NITI Aayog guidelines — documentation, equipment, and program support included.', area:'500–1000 sq ft', capacity:'30–40 Students', timeline:'6–8 Weeks', equipment:['3D printer','Electronics workbench','IoT dev kits','VR headsets','AIM-compliant materials'], suited:['school','government'], tier:'Government', badge:'AIM Compliant' },
    { id:4, name:'IoT Lab', icon:'📡', color:'#FF006E', rgb:'255,0,110', tagline:'Connect. Monitor. Control.', desc:'Smart device ecosystems with WiFi/Bluetooth hubs, cloud integration, and real-time sensor dashboards for environmental monitoring and home automation projects.', area:'250–500 sq ft', capacity:'16–24 Students', timeline:'3–4 Weeks', equipment:['ESP32 & NodeMCU boards','Wi-Fi & Bluetooth modules','Temperature & humidity sensors','Cloud server setup','MQTT brokers'], suited:['school','institution','private'], tier:'Core' },
    { id:5, name:'3D Design & Printing Lab', icon:'🖨️', color:'#00F5FF', rgb:'0,245,255', tagline:'Design. Prototype. Iterate.', desc:'CAD workstations with Fusion 360, SolidWorks training, and multi-material 3D printers for rapid prototyping and production-ready parts.', area:'350–700 sq ft', capacity:'18–28 Students', timeline:'4–6 Weeks', equipment:['3D printers (FDM & SLA)','CAD software licenses','Filament & resin supplies','Finishing tools & materials','Design tablets'], suited:['institution','government','private'], tier:'Advanced' },
    { id:6, name:'Embedded Systems Lab', icon:'⚙️', color:'#A855F7', rgb:'168,85,247', tagline:'Program hardware. Debug firmware.', desc:'RISC-V, ARM microcontroller programming with oscilloscopes, logic analyzers, and JTAG debuggers for low-level system development and real-time processing.', area:'320–620 sq ft', capacity:'20–26 Students', timeline:'5–7 Weeks', equipment:['RISC-V dev boards','ARM Cortex-M boards','Oscilloscopes & analyzers','JTAG debuggers','Real-time RTOS setup'], suited:['institution','government'], tier:'Advanced' },
    { id:7, name:'Drone & Drone Swarm Lab', icon:'🛸', color:'#FF6B35', rgb:'255,107,53', tagline:'Fly. Swarm. Innovate.', desc:'Multi-copter design, autonomous flight programming, and swarm coordination using ROS2 for drone racing, mapping, and autonomous missions.', area:'600–1200 sq ft', capacity:'24–40 Students', timeline:'6–8 Weeks', equipment:['Racing drones (DJI)','Custom build kits','Flight simulators','GPS & RTK modules','Swarm coordination software'], suited:['institution','government','private'], tier:'Advanced', badge:'Specialized' },
    { id:8, name:'Biotech & Biorobotics Lab', icon:'🧬', color:'#FF006E', rgb:'255,0,110', tagline:'Bio meets Bytes.', desc:'DNA sequencing, bioreactors, microfluidics, and bio-inspired robot design for exploring intersection of life sciences and robotics engineering.', area:'400–800 sq ft', capacity:'16–20 Students', timeline:'8–10 Weeks', equipment:['PCR machines','Microfluidic devices','Bioreactor systems','Microscopy setup','Bio-modeling software'], suited:['institution','government'], tier:'Government', badge:'STEM Research' },
  ],
  process: [
    { step:'01', title:'Site Assessment', icon:'📐', color:'#FF6B35', rgb:'255,107,53', desc:'Our engineers visit your campus. We evaluate space dimensions, power infrastructure, connectivity, and student flow to recommend the optimal lab layout.' },
    { step:'02', title:'Custom Blueprint', icon:'📋', color:'#00F5FF', rgb:'0,245,255', desc:'A detailed floor plan, equipment manifest, curriculum alignment document, and phased installation plan — tailored to your institution.' },
    { step:'03', title:'Professional Installation', icon:'🔧', color:'#A855F7', rgb:'168,85,247', desc:'Our certified technicians handle all hardware setup, software configuration, network integration, and safety compliance.' },
    { step:'04', title:'Faculty Certification', icon:'👨‍🏫', color:'#FF006E', rgb:'255,0,110', desc:'40-hour hands-on training for your teachers — lab operation, safety protocols, curriculum delivery, and student project guidance.' },
    { step:'05', title:'Ongoing AMC & Support', icon:'🛡️', color:'#FF6B35', rgb:'255,107,53', desc:'Annual Maintenance Contract covering equipment servicing, curriculum updates, remote support, and student program management.' },
  ],
  packages: [
    { name:'Starter', subtitle:'For schools getting started', color:'#FF6B35', rgb:'255,107,53', price:'₹8–15 Lakhs', includes:['1 Lab Type','Basic Equipment Set','Site Assessment','20-hr Teacher Training','6-month AMC','Curriculum Kit'], suited:'Small schools, government primary schools', highlight:false },
    { name:'Standard', subtitle:'For institutions scaling up', color:'#00F5FF', rgb:'0,245,255', price:'₹15–35 Lakhs', includes:['2 Lab Types','Full Equipment Set','Custom Blueprint','40-hr Teacher Certification','1-year AMC','Digital Curriculum','Student Program Support'], suited:'Secondary schools, junior colleges', highlight:true },
    { name:'Premium', subtitle:'For centres of excellence', color:'#A855F7', rgb:'168,85,247', price:'₹35 Lakhs+', includes:['3+ Lab Types','Premium Equipment','Innovation Center Design','Full Faculty Certification','2-year AMC','Curriculum Co-development','Competition Program','Dedicated Lab Manager'], suited:'Universities, group institutions, government centres', highlight:false },
  ],
  whyus: [
    { icon:'🔬', title:'End-to-End Ownership', color:'#FF6B35', rgb:'255,107,53', body:'We dont just supply equipment. We design, install, train, and support — one partner for the entire lab lifecycle.' },
    { icon:'📋', title:'Curriculum-First Design', color:'#00F5FF', rgb:'0,245,255', body:'Every lab is designed around a working curriculum, not just a hardware catalogue. Students use every piece of equipment from day one.' },
    { icon:'🏛️', title:'Government Compliant', color:'#A855F7', rgb:'168,85,247', body:'ATL, NEP 2020, and CBSE STEM guidelines fully covered. We handle documentation, reporting, and AIM compliance paperwork.' },
    { icon:'🛡️', title:'Long-Term AMC', color:'#FF006E', rgb:'255,0,110', body:'Our Annual Maintenance Contracts ensure your lab never sits idle. Remote diagnostics, on-site visits, and replacement parts on call.' },
  ],
  blogs: [
    { id:1, tag:'Tutorial', cat:'hardware', title:'Building a PID Controller on Arduino From Absolute Zero', excerpt:'PID looks scary on paper. We break it down with real code, an oscilloscope trace, and a motor that actually behaves. No maths degree required.', date:'May 14, 2025', readTime:'8 min', color:'#FF6B35', rgb:'255,107,53', featured:true },
    { id:2, tag:'Deep Dive', cat:'iot', title:'ESP-NOW vs MQTT: Which Protocol Wins for Your Robot?', excerpt:'We ran both protocols on identical hardware and measured latency, range, and reliability. The results might surprise you.', date:'May 8, 2025', readTime:'6 min', color:'#00F5FF', rgb:'0,245,255', featured:false },
    { id:3, tag:'Project', cat:'ai', title:'Running TFLite Object Detection at 30fps on a Raspberry Pi 4', excerpt:'Step-by-step: quantize a MobileNet model, deploy it on RPi, and stream live inference video. All offline, zero cloud.', date:'April 29, 2025', readTime:'11 min', color:'#A855F7', rgb:'168,85,247', featured:false },
    { id:4, tag:'Guide', cat:'hardware', title:'Your First PCB in KiCad: Schematic to Gerber in One Afternoon', excerpt:'A practical walkthrough that skips the theory and gets you to a manufacturable board as fast as possible.', date:'April 21, 2025', readTime:'9 min', color:'#FF006E', rgb:'255,0,110', featured:false },
    { id:5, tag:'Tutorial', cat:'iot', title:'Building Real-Time IoT Dashboards with InfluxDB and Grafana', excerpt:'Store sensor data efficiently, query it, and visualize on beautiful dashboards. Perfect for monitoring your lab or home setup.', date:'March 2, 2025', readTime:'10 min', color:'#00F5FF', rgb:'0,245,255', featured:false },
    { id:6, tag:'Project', cat:'hardware', title:'Custom Motion Tracking Robot Using OpenCV and Servo Motors', excerpt:'Build a turret that follows moving objects in real-time. Computer vision + servo control = hours of fun and learning.', date:'February 22, 2025', readTime:'13 min', color:'#FF006E', rgb:'255,0,110', featured:false },
    { id:7, tag:'Explainer', cat:'ai', title:'How Convolutional Neural Networks See Images (Visualized)', excerpt:'CNNs seem magical until you understand feature maps, pooling, and activation. We show you the actual math with interactive examples.', date:'February 14, 2025', readTime:'10 min', color:'#A855F7', rgb:'168,85,247', featured:false },
    { id:8, tag:'Guide', cat:'robotics', title:'Setting Up a Multi-Robot ROS2 Network Over WiFi', excerpt:'Communication between multiple robots is tricky. This guide covers networking, time sync, message passing, and debugging tips we learned the hard way.', date:'February 5, 2025', readTime:'11 min', color:'#FF6B35', rgb:'255,107,53', featured:false },
    { id:9, tag:'Project', cat:'ai', title:'Building a Voice-Controlled Arduino with ML on Edge', excerpt:'Train a keyword detector, quantize it with TFLite, and run it on Arduino Nano 33. Voice commands without WiFi or cloud.', date:'January 28, 2025', readTime:'9 min', color:'#00F5FF', rgb:'0,245,255', featured:false },
    { id:10, tag:'Deep Dive', cat:'hardware', title:'Debugging Electrical Problems: Why Your Circuit Isnt Working', excerpt:'Oscilloscope basics, multimeter tricks, and systematic debugging strategies that always find the culprit — shorts, noise, or components gone bad.', date:'January 18, 2025', readTime:'12 min', color:'#A855F7', rgb:'168,85,247', featured:false },
  ]
}

async function initializeCards() {
  try {
    // Clear existing cards
    await Card.deleteMany({})
    console.log('✓ Cleared existing cards')

    // Initialize each card type
    for (const [cardTypeKey, cardsData] of Object.entries(DEFAULT_CARDS)) {
      // Normalize card type: 'achievements' -> 'achievement', 'process' -> 'process', etc.
      let normalizedCardType = cardTypeKey
      // For keys ending in 's', try to pluralize correctly
      if (cardTypeKey.endsWith('s') && !['process', 'whyus'].includes(cardTypeKey)) {
        normalizedCardType = cardTypeKey.slice(0, -1)
      }
      
      // Determine page based on card type
      const page = ['lab', 'process', 'package', 'whyus', 'blog'].includes(normalizedCardType) ? 'explore' : 'achievements'
      
      for (let i = 0; i < cardsData.length; i++) {
        await Card.create({
          cardType: normalizedCardType,
          page: page,
          index: i,
          data: cardsData[i],
          active: true,
        })
      }
    }

    console.log('✓ Cards initialized successfully (achievements + explore)')
  } catch (err) {
    console.error('✗ Error initializing cards:', err.message)
  }
}

module.exports = initializeCards
