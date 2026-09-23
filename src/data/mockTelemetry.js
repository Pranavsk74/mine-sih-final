// MINE SENSE - CLAUDE'S PLAN - Hardware & Telemetry Data Source

export const PIPELINE_NODES = [
  {
    id: 'rover',
    step: '01',
    title: 'ROVER CHASSIS',
    subtitle: 'Hazard Inspection Unit',
    category: 'Hardware',
    status: 'ACTIVE',
    summary: 'Custom rugged 4-wheel drive mobile platform engineered to navigate high-risk subterranean environments.',
    details: {
      mcu: 'ESP32 Dual-Core @ 240MHz',
      chassis: 'Heavy-Duty Reinforced Polymer & Aluminum',
      motors: '4x Geared DC Motors with Metal Encoders',
      power: 'LiFePO4 High-Current Battery Bank via INA219 Power Monitor',
      safety: 'Physical Emergency Cut-Off Switch + High-Decibel Buzzer + High-Power LED Search Array'
    },
    specs: [
      { label: 'Payload Capacity', value: '3.5 kg' },
      { label: 'Drive Speed', value: '1.2 m/s' },
      { label: 'Ground Clearance', value: '65 mm' },
      { label: 'Operating Temp', value: '-10°C to +65°C' }
    ]
  },
  {
    id: 'mcu',
    step: '02',
    title: 'ESP32 / MCU',
    subtitle: 'On-Board Microcontroller Unit',
    category: 'Processing',
    status: 'ACTIVE',
    summary: 'Real-time embedded controller executing high-frequency sensor acquisition, IMU fusion, and LoRa packet framing.',
    details: {
      chipset: 'Espressif Systems ESP32-WROOM-32U',
      clock: '240 MHz Dual Core Tensilica LX6',
      memory: '520 KB SRAM / 4 MB Flash',
      busInterfaces: 'I2C (0x68 MPU6050, 0x76 BME280, 0x33 MLX90640), SPI (LoRa SX1276), ADC (MQ-4, MQ-7)',
      firmware: 'FreeRTOS Multi-Threaded Sensor Pipeline (Task0: Sensors, Task1: LoRa TX)'
    },
    specs: [
      { label: 'I2C Clock Rate', value: '400 kHz' },
      { label: 'ADC Resolution', value: '12-bit (0-4095)' },
      { label: 'Power Consumption', value: '160 mA' },
      { label: 'Uptime', value: '04h 12m 44s' }
    ]
  },
  {
    id: 'sensors',
    step: '03',
    title: 'SENSORS + CAMERAS',
    subtitle: 'Multi-Modal Environmental Sensing',
    category: 'Sensing',
    status: 'ACTIVE',
    summary: 'Integrated environmental gas sensors, 6-axis inertial tracking, visual optics, and thermal grid array.',
    details: {
      gasSensors: 'MQ-4 (Combustible Methane CH4), MQ-7 (Toxic Carbon Monoxide CO)',
      environmental: 'BME280 (Precision Barometric Pressure, Temp, Humidity)',
      motion: 'MPU6050 6-DOF Gyroscope & Accelerometer for seismic/structural tilt detection',
      thermalVision: 'MLX90640 32x24 Far-Infrared Thermal Matrix + HD Optical Cam + IR Illumination'
    },
    specs: [
      { label: 'Methane Range', value: '300 - 10,000 ppm' },
      { label: 'CO Range', value: '20 - 2,000 ppm' },
      { label: 'Thermal Grid', value: '768 Pixels (32x24)' },
      { label: 'IMU Refresh Rate', value: '100 Hz' }
    ]
  },
  {
    id: 'lora',
    step: '04',
    title: 'LONG-RANGE RADIO (LoRa)',
    subtitle: 'Sub-GHz Telemetry Link',
    category: 'Communication',
    status: 'ACTIVE',
    summary: 'Ultra-reliable sub-gigahertz wireless transmission engineered for rock-dense subterranean penetration without cell infrastructure.',
    details: {
      transceiver: 'Semtech SX1276 LoRa Module',
      frequency: '868 MHz / 915 MHz ISM Band',
      antenna: '5 dBi Subterranean High-Gain Dipole Antenna',
      modulation: 'LoRa Chirp Spread Spectrum (CSS)',
      bandwidth: '125 kHz | Spreading Factor SF9 | Coding Rate 4/5'
    },
    specs: [
      { label: 'Tx Power', value: '+20 dBm (100 mW)' },
      { label: 'Subterranean Range', value: '1.8 km (Tunnel Line-of-Sight)' },
      { label: 'Packet Delivery', value: '99.4%' },
      { label: 'RSSI / SNR', value: '-94 dBm / +8.2 dB' }
    ]
  },
  {
    id: 'surface',
    step: '05',
    title: 'SURFACE STATION',
    subtitle: 'Gateway & Signal Concentrator',
    category: 'Infrastructure',
    status: 'ACTIVE',
    summary: 'Surface-level receiver gateway positioned at the mine shaft entry, receiving raw encrypted packets from subterranean rovers.',
    details: {
      gateway: 'LoRa Concentrator Base Station with High-Gain Yagi Array',
      demodulation: 'Hardened ESP32 Gateway / USB-UART Serial Bridge to Edge Unit',
      powerSupply: 'Solar-Assisted Battery Backup Unit',
      integrity: 'CRC16 Packet Validation & Timestamp Alignment'
    },
    specs: [
      { label: 'Latency', value: '< 45 ms' },
      { label: 'Ingress Rate', value: '10 Hz Telemetry Packets' },
      { label: 'Enclosure', value: 'IP67 Weatherproof Dust/Water-tight' },
      { label: 'Uptime', value: '99.99%' }
    ]
  },
  {
    id: 'edge',
    step: '06',
    title: 'EDGE COMPUTER',
    subtitle: 'Surface Field Compute Unit',
    category: 'Compute',
    status: 'ACTIVE',
    summary: 'Field-deployed ruggedized workstation executing high-efficiency local data ingestion, anomaly scoring, and ML inferencing.',
    details: {
      hardware: 'Industrial Edge AI Station (NVIDIA Jetson / x86 Quad-Core IPC)',
      execution: 'Local Zero-Cloud Pipeline (Completely functional offline during tunnel disasters)',
      storage: 'Encrypted NVMe Field Journal & Log Database',
      security: 'Hardware-Enforced Protocol Isolator'
    },
    specs: [
      { label: 'Inference Delay', value: '12.4 ms' },
      { label: 'Local Storage', value: '1 TB NVMe SSD' },
      { label: 'Power Draw', value: '35 Watts' },
      { label: 'Cloud Required', value: 'NONE (100% Edge)' }
    ]
  },
  {
    id: 'ai',
    step: '07',
    title: 'AI / ML ENGINE',
    subtitle: 'Hazard & Worker Detection Pipeline',
    category: 'Intelligence',
    status: 'ACTIVE',
    summary: 'Neural networks analyzing thermal heat signatures, gas concentration curves, and structural tilt variance.',
    details: {
      workerModel: 'YOLOv8-Nano Custom Thermal Model (Trained on 36-38°C human signatures in low-light environments)',
      gasModel: 'Multivariate LSTM Anomaly Detector forecasting hazardous gas accumulation curves',
      visionModel: 'Convolutional Gas Density & Structural Fracture Inspection Network'
    },
    specs: [
      { label: 'Worker Detection FPS', value: '28.5 FPS' },
      { label: 'Thermal Precision', value: '±0.4°C' },
      { label: 'False Alarm Rate', value: '< 0.8%' },
      { label: 'Model Footprint', value: '14.2 MB TensorRT' }
    ]
  },
  {
    id: 'mission',
    step: '08',
    title: 'MISSION CONTROL',
    subtitle: 'Tactical Rescue Command Interface',
    category: 'Operations',
    status: 'ACTIVE',
    summary: 'Unified tactical command console providing real-time situational awareness, worker pinpointing, and emergency dispatch alerts.',
    details: {
      interface: 'Architectural Archive CAD Interface',
      alerts: 'Multi-tier Audio-Visual Emergency Broadcast System',
      map: 'Underground Tunnel Section Grid with Spatial Hotspots and Rover Path Tracking',
      export: 'Single-Click Subterranean Incident Log Export'
    },
    specs: [
      { label: 'Update Cycle', value: 'Real-time Streaming' },
      { label: 'Rescue Status', value: 'STANDBY / READY' },
      { label: 'Connected Operators', value: '3 Stations' },
      { label: 'Tactical Rating', value: 'GRADE ALPHA-1' }
    ]
  }
];

export const MINE_HAZARDS = [
  {
    id: 'ch4',
    code: 'HAZ-01',
    title: 'METHANE GAS ACCUMULATION',
    sensor: 'MQ-4 Sensor',
    threshold: '1.25% (12,500 ppm Explosive Lower Limit Alert)',
    impact: 'Catastrophic subterranean gas explosion risk triggered by minor electrical sparks or friction.',
    mitigation: 'Rover deploys continuous suction sampling to identify pocket boundaries before personnel enter.'
  },
  {
    id: 'co',
    code: 'HAZ-02',
    title: 'CARBON MONOXIDE POISONING',
    sensor: 'MQ-7 Sensor',
    threshold: '50 ppm (OSHA TWA) / 200 ppm (Critical Lethal)',
    impact: 'Odorless, toxic asphyxiant gas resulting from incomplete combustion or smoldering subterranean fires.',
    mitigation: 'High-frequency electrochemical sensing maps gas plume dispersion in real time.'
  },
  {
    id: 'structural',
    code: 'HAZ-03',
    title: 'STRUCTURAL TILT & SEISMIC INSTABILITY',
    sensor: 'MPU6050 6-DOF IMU',
    threshold: '> 3.5° Micro-Tilt / High Accelerometer Shock',
    impact: 'Roof falls, pillar failure, and tunnel collapse caused by geological pressure shifts.',
    mitigation: 'IMU tilt integration triggers instant retreat warnings and structural hazard logging.'
  },
  {
    id: 'flooding',
    code: 'HAZ-04',
    title: 'SUBTERRANEAN FLOODING & HUMIDITY',
    sensor: 'BME280 Sensor',
    threshold: '> 95% RH / Sudden Barometric Pressure Drops',
    impact: 'Water ingress from breached underground aquifers impairing rescue paths and shorting equipment.',
    mitigation: 'Precision relative humidity and pressure monitoring predict water table breaches.'
  },
  {
    id: 'trapped',
    code: 'HAZ-05',
    title: 'TRAPPED PERSONNEL IDENTIFICATION',
    sensor: 'MLX90640 Thermal + YOLO Engine',
    threshold: 'Human Thermal Envelope (35.5°C - 37.8°C)',
    impact: 'Inability to locate unconscious or trapped miners in pitch-black or smoke-filled tunnels.',
    mitigation: 'Dual infrared thermal imaging locks onto human heat signatures through thick soot.'
  }
];

export const MOCK_HARDWARE_SPECS = [
  { group: 'PROCESSING & CONTROLLER', item: 'ESP32-WROOM-32U Dual-Core Tensilica LX6 @ 240MHz' },
  { group: 'CHASSIS & MOTORS', item: 'Reinforced Polymer Frame + 4x Geared DC Motors (1:45 ratio)' },
  { group: 'POWER MONITORING', item: 'Texas Instruments INA219 High-Side Voltage/Current I2C Monitor' },
  { group: 'GAS SENSING ARRAY', item: 'MQ-4 (Methane CH4) + MQ-7 (Carbon Monoxide CO) Analog Sensors' },
  { group: 'ENVIRONMENTAL CLIMATE', item: 'Bosch BME280 (Barometric Pressure, Humidity, Temperature)' },
  { group: 'INERTIAL MEASUREMENT', item: 'InvenSense MPU6050 6-DOF Accelerometer & Gyroscope' },
  { group: 'THERMAL VISION GRID', item: 'Melexis MLX90640 32x24 IR Array (768 Thermal Data Points)' },
  { group: 'SUB-GHZ TRANSCEIVER', item: 'Semtech SX1276 LoRa SPI Transceiver @ 868MHz / 915MHz' },
  { group: 'SAFETY & EMERGENCY', item: 'High-Decibel Piezo Buzzer + High-Lumen Searchlight + Manual Kill Switch' },
];

export const INITIAL_TELEMETRY = {
  ch4: 0.74, // %
  co: 18, // ppm
  temp: 24.6, // °C
  humidity: 68.2, // %
  pressure: 1013.25, // hPa
  tiltX: 0.8, // degrees
  tiltY: -0.4, // degrees
  vibration: 0.05, // g
  voltage: 12.4, // Volts (INA219)
  current: 820, // mA (INA219)
  signalRssi: -92, // dBm
  signalSnr: 9.4, // dB
  roverStatus: 'INSPECTION ACTIVE',
  roverLocation: 'Tunnel Section B-4 (142m Depth)',
  hazardLevel: 'NORMAL',
  activeWorkersDetected: 2,
};
