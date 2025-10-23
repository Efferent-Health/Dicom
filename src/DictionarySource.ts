namespace Efferent
{
    export const DICOM_DICT = `
tag,VR,VM,description
00080001,UL,,Length to End
5,CS,1-n,Specific Character Set
6,SQ,,Language Code Sequence
8,CS,2-n,Image Type
10,SH,,Recognition %2
12,DA,,Instance Creation Date
13,TM,,$1 $2 Time
14,UI,,$1 Creator UID
15,DT,,$1 Coercion DateTime
16,UI,,SOP Class %3
17,,,Acquisition $3
18,,,%1 Instance $2
19,,,Pyramid $3
1A,,1-n,Related General %1 Class $2
1B,,,Original Specialized $3 $4 $5
1C,CS,,Synthetic Data
20,DA,,Study Date
21,,,Series $2
22,,,Acquisition $2
23,,,Content $2
24,,,Overlay $2
25,,,Curve $2
2A,DT,,Acquisition DateTime
30,TM,,Study Time
31,,,Series $2
32,,,Acquisition $2
33,,,Content $2
34,,,Overlay $2
35,,,Curve $2
40,US,,Data Set Type
41,LO,,$1 $2 Subtype
42,CS,,Nuclear Medicine Series %3
50,SH,,Accession Number
51,SQ,,Issuer of $1 $2 Sequence
52,CS,,Query/Retrieve Level
53,,,$1 View
54,AE,1-n,Retrieve AE Title
55,,,Station $2 $3
56,CS,,Instance Availability
58,UI,1-n,Failed SOP $1 UID List
60,CS,,Modality
61,,1-n,Modalities in Study
62,UI,1-n,SOP Classes $2 $3
63,SQ,,Anatomic Regions $3 $4 Code Sequence
64,CS,,Conversion Type
68,,,Presentation Intent $2
70,LO,,Manufacturer
80,,,Institution Name
81,ST,,$1 Address
82,SQ,,$1 Code Sequence
90,PN,,Referring Physician's Name
92,ST,,$1 $2 Address
94,SH,1-n,$1 $2 Telephone Numbers
96,SQ,,$1 Physician Identification Sequence
9C,PN,1-n,Consulting %2 Name
9D,SQ,,$1 %2 %3 %4
100,SH,,Code Value
101,LO,,Extended $1 $2
102,SH,,Coding Scheme Designator
103,,,$1 $2 Version
104,LO,,Code Meaning
105,CS,,Mapping Resource
106,DT,,Context Group Version
107,,,$1 $2 Local $3
108,LT,,Extended Code Meaning
109,SQ,,Coding Scheme Resources Sequence
10A,CS,,$1 $2 URL Type
10B,,,Context Group Extension Flag
10C,UI,,%1 %2 UID
10D,,,%1 %2 %3 Creator $3
10E,UR,,%1 %2 URL
10F,CS,,%1 Identifier
110,SQ,,%1 %2 Identification Sequence
112,LO,,$1 $2 Registry
114,ST,,$1 $2 External ID
115,,,$1 $2 Name
116,,,$1 $2 Responsible Organization
117,UI,,Context UID
118,,,Mapping Resource $2
119,UC,,Long Code Value
120,UR,,URN $2 $3
121,SQ,,Equivalent $2 Sequence
122,LO,,Mapping Resource Name
123,SQ,,Context Group Identification %3
124,,,%1 %2 $3 $4
201,SH,,Timezone Offset From UTC
220,SQ,,Responsible Group Code %4
221,CS,,Equipment Modality
222,LO,,Manufacturer's Related Model %2
300,SQ,,Private Data Element Characteristics Sequence
301,US,,$1 %4 Reference
302,LO,,$1 Creator $3
303,CS,,Block Identifying Information Status
304,US,1-n,Nonidentifying %1 Elements
306,,1-n,%2 $2 $3
305,SQ,,Deidentification Action Sequence
307,CS,,$1 $2
308,US,,Private Data Element
309,UL,1-3,$1 $2 $3 Value Multiplicity
30A,CS,,$1 $2 $3 $4 Representation
30B,UL,1-2,$1 $2 $3 Number of Items
30C,UC,,$1 $2 $3 Name
30D,,,$1 $2 $3 Keyword
30E,UT,,$1 $2 $3 Description
30F,,,$1 $2 $3 Encoding
310,SQ,,$1 $2 $3 Definition Sequence
400,,,Scope of Inventory $5
401,LT,,$3 Purpose
402,,,$1 Instance Description
403,CS,,$1 Level
404,DT,,Item $1 DateTime
405,CS,,Removed from Operational Use
406,SQ,,Reason for Removal Code Sequence
407,UR,,Stored Instance Base URI
408,,,Folder Access $4
409,,,File $2 $3
40A,CS,,Container $1 Type
40B,UR,,Filename in $1
40C,UV,,%2 Offset $2 $3
40D,,,$1 Length $3 $4
40E,UI,,Stored Instance Transfer Syntax UID
40F,CS,1-n,Extended Matching Mechanisms
410,SQ,,Range $2 Sequence
411,,,List of UID $2 $3
412,,,Empty Value $4 $5
413,,,General $3 $4
414,US,,Requested Status Interval
415,CS,,Retain Instances
416,DT,,Expiration DateTime
417,CS,,Transaction Status
418,LT,,$1 $2 Comment
419,SQ,,File Set Access Sequence
41A,,,$1 $3 $4
41B,OB,,Record Key
41C,,,Prior $1 $2
41D,SQ,,Metadata Sequence
41E,,,Updated $1 $2
41F,DT,,Study Update DateTime
420,SQ,,Inventory Access End Points %3
421,,,%1 $2 $3 $4 $5
422,,,Incorporated %1 Instance $5
423,,,Inventoried Studies $4
424,,,$1 Series $3
425,,,$1 Instances $3
426,CS,,Inventory Completion Status
427,UL,,Number of Study Records in Instance
428,UV,,Total $1 $2 $3 $4
429,,,Maximum $2 $3 $5
1000,AE,,Network ID
1010,SH,,Station Name
1030,LO,,Study Description
1032,SQ,,Procedure Code Sequence
103E,LO,,Series %2
103F,SQ,,$1 $2 %2 %3
1040,LO,,Institutional Department Name
1041,SQ,,$1 $2 Type %3 %4
1048,PN,1-n,Physician(s) of Record
1049,SQ,,$1 $2 $3 Identification %5
1050,PN,1-n,Performing Physician's Name
1052,SQ,,$1 Physician %4 %5
1060,PN,1-n,%3 of Physician(s) Reading Study
1062,SQ,,$3 $4 $5 %3 %4
1070,PN,1-n,Operators' %1
1072,SQ,,Operator %4 %5
1080,LO,1-n,Admitting Diagnoses Description
1084,SQ,,$1 $2 Code %3
1088,LO,,Pyramid %3
1090,,,Manufacturer's Model Name
1100,SQ,,Referenced Results Sequence
1110,,,$1 Study $3
1111,,,$1 Performed Procedure Step $3
1112,,,$1 Instances by SOP Class $5
1115,,,$1 Series $6
1120,,,$1 Patient $3
1125,,,$1 Visit $3
1130,,,$1 Overlay $3
1134,,,$1 Stereometric Instance $3
113A,,,$1 Waveform $4
1140,,,$1 Image $3
1145,,,$1 Curve $3
114A,,,$1 Instance $3
114B,,,$1 Real World Value Mapping $2 $3
114C,,,$1 Segmentation $7
114D,,,$1 Surface $2 $3
1150,UI,,$1 SOP Class UID
1155,,,$1 $2 Instance $4
1156,SQ,,Definition Source Sequence
115A,UI,1-n,%2 Classes Supported
1160,IS,1-n,Referenced Frame Number
1161,UL,1-n,Simple $2 List
1162,,3-3n,Calculated $2 $3
1163,FD,2,Time Range
1164,SQ,,%2 Extraction Sequence
1167,UI,,Multi-frame Source SOP Instance UID
1190,UR,,Retrieve URL
1195,UI,,Transaction %5
1196,US,,Warning Reason
1197,,,Failure $2
1198,SQ,,Failed SOP Sequence
1199,,,Referenced $2 $3
119A,,,Other Failures $3
119B,,,Failed Study $3
1200,,,Studies Containing %1 Referenced Instances $3
1250,,,Related Series $6
1301,,,Principal Diagnosis Code $3
1302,,,Primary $2 $3 $4
1303,,,Secondary Diagnoses $3 $4
1304,,,Histological $2 $3 $4
2110,CS,,Lossy Image Compression (Retired)
2111,ST,,Derivation Description
2112,SQ,,Source %2 Sequence
2120,SH,,Stage Name
2122,IS,,$1 Number
2124,,,$2 of Stages
2127,SH,,View Name
2128,IS,,$1 %1
2129,,,$2 of Event Timers
212A,,,$1 $2 Views in Stage
2130,DS,1-n,%3 Elapsed Time(s)
2132,LO,1-n,$1 Timer Name(s)
2133,SQ,,$1 $2 Sequence
2134,FD,,$1 Time Offset
2135,SQ,,$1 Code %3
2142,IS,,Start Trim
2143,,,Stop $2
2144,,,Recommended Display Frame Rate
2200,CS,,Transducer Position
2204,,,$1 Orientation
2208,,,Anatomic Structure
2218,SQ,,$1 Region Sequence
2220,,,$1 $2 Modifier $3
2228,,,Primary $1 Structure $4
2229,,,$2 Structure, Space or %2 $4
2230,,,%1 $1 %3 Modifier $6
2240,,,Transducer Position $5
2242,,,$1 $2 %4 $3
2244,,,$1 Orientation $4
2246,,,$1 $2 %3 $3
2251,,,Anatomic Structure Space Or Region Code $4 (Trial)
2253,,,$1 Portal Of Entrance $6 $7 $8
2255,,,$1 Approach Direction $5 $6 $7
2256,ST,,$1 Perspective Description $6
2257,SQ,,$1 $2 %4 %5 $4
2258,ST,,$1 Location Of Examining Instrument %3 $5
2259,SQ,,$1 $2 $3 $4 $5 %3 %4 $7
225A,,,$1 Structure Space Or Region Modifier $6 $7 $8
225C,,,On Axis Background $1 $2 $7 $8 $9
3001,,,Alternate Representation $7
3002,UI,1-n,Available Transfer Syntax UID
3010,,1-n,Irradiation Event $4
3011,SQ,,Source $1 $2 Sequence
3012,UI,,Radiopharmaceutical Administration $3 %3
4000,LT,,Identifying Comments
9007,CS,4-5,Frame Type
9092,SQ,,Referenced Image Evidence Sequence
9121,,,$1 Raw Data $4
9123,UI,,Creator-Version UID
9124,SQ,,Derivation Image %4
9154,,,Source $2 Evidence $3
9205,CS,,Pixel Presentation
9206,,,Volumetric Properties
9207,,,Volume Based Calculation Technique
9208,,,Complex Image Component
9209,,,Acquisition Contrast
9215,SQ,,Derivation Code Sequence
9237,,,Referenced Presentation State $3
9410,,,$1 Other Plane $4
9458,,,Frame Display $4
9459,FL,,Recommended $2 $1 Rate in Float
9460,CS,,Skip $3 Range Flag
00100010,PN,,Patient's Name
11,SQ,,Person Names to Use Sequence
12,LT,,%2 $3 $4
13,UT,,$1 $2 $3 Comment
14,SQ,,Third Person Pronouns Sequence
15,,,Pronoun Code $4
16,UT,,$1 Comment
20,LO,,Patient ID
21,,,Issuer of $1 $2
22,CS,,Type $2 $3 $4
24,SQ,,%1 $2 $3 $4 Qualifiers Sequence
26,,,Source $3 Group Identification $6
27,,,$3 %2 Patients $4 $5
28,US,3,Subject Relative Position in Image
30,DA,,Patient's Birth Date
32,TM,,$1 $2 Time
33,LO,,$1 $2 %3 in Alternative Calendar
34,,,$1 Death $3 $4 $5 $6
35,CS,,$1 $5 $6
40,,,$1 Sex
41,SQ,,Gender Identity Sequence
42,UT,,%2 Parameters for Clinical Use Category Comment
43,SQ,,$1 $2 $3 $4 $5 $6 %3
44,,,Gender Identity Code $7
45,UT,,$1 $2 Comment
46,SQ,,Sex Parameters for Clinical Use Category %3 %4
47,UR,1-n,$1 $2 $3 $4 $5 $6 Reference
50,SQ,,Patient's Insurance Plan %7 %8
101,,,$1 Primary Language $4 $5
102,,,$1 $2 $3 Modifier $4 $5
200,CS,,Quality Control Subject
201,SQ,,$1 $2 $3 Type %5 %6
212,UC,,Strain Description
213,LO,,$1 Nomenclature
214,,,$1 Stock Number
215,SQ,,$1 Source Registry Code Sequence
216,,,$1 %2 $5
217,LO,,$1 %2
218,UT,,$1 Additional Information
219,SQ,,$1 Code Sequence
221,,,Genetic Modifications $3
222,UC,,$1 $2 Description
223,LO,,$1 $2 Nomenclature
229,SQ,,$1 $2 Code Sequence
1000,LO,1-n,Other Patient IDs
1001,PN,1-n,$1 $2 Names
1002,SQ,,$1 $2 %3 Sequence
1005,PN,,Patient's Birth Name
1010,AS,,$1 Age
1020,DS,,$1 Size
1021,SQ,,$1 $2 Code Sequence
1022,DS,,$1 Body Mass Index
1023,,,Measured AP Dimension
1024,,,$1 Lateral $3
1030,,,Patient's Weight
1040,LO,,$1 Address
1050,,1-n,Insurance Plan Identification
1060,PN,,%1 Mother's Birth Name
1080,LO,,Military Rank
1081,,,Branch of Service
1090,,,Medical Record Locator
1100,SQ,,Referenced Patient Photo Sequence
2000,LO,1-n,%1 Alerts
2110,,1-n,Allergies
2150,,,Country of Residence
2152,,,Region $2 $3
2154,SH,1-n,Patient's Telephone Numbers
2155,LT,,$1 Telecom Information
2160,SH,,Ethnic Group
2161,SQ,,$1 $2 Code Sequence
2162,UC,1-n,$1 Groups
2180,SH,,Occupation
21A0,CS,,Smoking Status
21B0,LT,,Additional Patient History
21C0,US,,Pregnancy %2
21D0,DA,,Last Menstrual Date
21F0,LO,,Patient's Religious Preference
2201,,,Patient Species Description
2202,SQ,,$1 $2 Code Sequence
2203,CS,,Patient's Sex Neutered
2210,,,Anatomical Orientation Type
2292,LO,,Patient Breed Description
2293,SQ,,$1 $2 Code Sequence
2294,,,$2 Registration $4
2295,LO,,$1 $2 Number
2296,SQ,,$1 Registry Code %3
2297,PN,,Responsible Person
2298,CS,,$1 $2 Role
2299,LO,,$1 Organization
4000,LT,,Patient Comments
9431,FL,,Examined Body Thickness
00180010,LO,,Contrast/Bolus Agent
12,SQ,,$1 $2 Sequence
13,FL,,$1 T1 Relaxivity
14,SQ,,$1 Administration Route %3
15,CS,,Body Part Examined
20,,1-n,Scanning %4
21,,1-n,$2 Variant
22,,1-n,Scan Options
23,,,MR Acquisition Type
24,SH,,Sequence Name
25,CS,,Angio Flag
26,SQ,,Intervention Drug Information %1
27,TM,,$1 $2 Stop Time
28,DS,,$1 $2 Dose
29,SQ,,$1 $2 Code Sequence
2A,,,Additional $2 $4
30,LO,1-n,Radionuclide
31,,,Radiopharmaceutical
32,DS,,Energy Window Centerline
33,,1-n,$1 $2 Total Width
34,LO,,Intervention Drug Name
35,TM,,$1 $2 Start Time
36,SQ,,$1 Sequence
37,CS,,Therapy Type
38,,,%1 Status
39,,,%1 Description
3A,ST,,%1 $2
40,IS,,Cine Rate
42,CS,,Initial $1 Run State
50,DS,,Slice Thickness
60,,,KVP
61,,,
70,IS,,Counts Accumulated
71,CS,,Acquisition Termination Condition
72,DS,,Effective Duration
73,CS,,%1 Start %3
74,IS,,$1 $2 $3 Data
75,,,$1 Termination $3 $4
80,DS,,Repetition Time
81,,,Echo $2
82,,,Inversion $2
83,,,Number of Averages
84,,,Imaging Frequency
85,SH,,Imaged Nucleus
86,IS,1-n,Echo Number(s)
87,DS,,Magnetic Field Strength
88,,,Spacing Between Slices
89,IS,,Number of Phase Encoding Steps
90,DS,,Data Collection Diameter
91,IS,,Echo Train Length
93,DS,,Percent Sampling
94,,,$1 Phase Field of View
95,,,Pixel Bandwidth
1000,LO,,Device Serial Number
1002,UI,,$1 UID
1003,LO,,$1 ID
1004,,,Plate $2
1005,,,Generator $2
1006,,,Grid $2
1007,,,Cassette $2
1008,,,Gantry $2
1009,UT,,Unique Device Identifier
100A,SQ,,UDI Sequence
100B,UI,1-n,Manufacturer's %2 Class UID
1010,LO,,Secondary Capture $2 ID
1011,,,Hardcopy Creation $3 $4
1012,DA,,Date of %1 %2
1014,TM,,Time $2 $3 $4
1016,LO,,$3 $4 Device Manufacturer
1017,,,Hardcopy $3 $4
1018,,,%1 %2 $2 Manufacturer's Model Name
1019,,1-n,$1 $2 $3 Software Versions
101A,,1-n,Hardcopy $3 $4 Version
101B,,,$1 $2 Manufacturer's Model Name
1020,,1-n,%3 Versions
1022,SH,,Video Image Format Acquired
1023,LO,,Digital $2 $3 $4
1030,,,Protocol Name
1040,,,Contrast/Bolus Route
1041,DS,,$1 Volume
1042,TM,,$1 Start Time
1043,,,$1 Stop $3
1044,DS,,$1 Total Dose
1045,IS,,Syringe Counts
1046,DS,1-n,Contrast Flow Rate
1047,,1-n,$1 $2 Duration
1048,CS,,Contrast/Bolus Ingredient
1049,DS,,$1 $2 Concentration
1050,,,Spatial Resolution
1060,,,Trigger Time
1061,LO,,$1 Source or Type
1062,IS,,Nominal Interval
1063,DS,,Frame Time
1064,LO,,Cardiac Framing Type
1065,DS,1-n,%1 %2 Vector
1066,,,$1 Delay
1067,,,Image Trigger $2
1068,,,Multiplex Group Time Offset
1069,,,%2 $3 $4
106A,CS,,Synchronization $1
106C,US,2,$1 Channel
106E,UL,,%2 Sample Position
1070,LO,,Radiopharmaceutical Route
1071,DS,,$1 Volume
1072,TM,,$1 Start Time
1073,,,$1 Stop $3
1074,DS,,Radionuclide Total Dose
1075,,,$1 Half Life
1076,,,$1 Positron Fraction
1077,,,Radiopharmaceutical Specific Activity
1078,DT,,$1 Start DateTime
1079,,,$1 Stop $3
1080,CS,,Beat Rejection Flag
1081,IS,,Low R-R Value
1082,,,High $2 $3
1083,,,Intervals Acquired
1084,,,$1 Rejected
1085,LO,,PVC Rejection
1086,IS,,Skip Beats
1088,,,Heart Rate
1090,,,Cardiac Number of Images
1094,,,Trigger Window
1100,DS,,Reconstruction Diameter
1110,,,Distance Source to Detector
1111,,,$1 $2 $3 Patient
1114,,,Estimated Radiographic Magnification Factor
1120,,,Gantry/Detector Tilt
1121,,,$1 Slew
1130,,,Table Height
1131,,,$1 Traverse
1134,CS,,$1 Motion
1135,DS,1-n,$1 Vertical Increment
1136,,1-n,$1 Lateral $3
1137,,1-n,$1 Longitudinal $3
1138,,,$1 Angle
113A,CS,,$1 Type
1140,,,Rotation Direction
1141,DS,,Angular Position
1142,,1-n,Radial $2
1143,,,Scan Arc
1144,,,Angular Step
1145,,,Center of Rotation Offset
1146,,1-n,$3 $4
1147,CS,,Field %2 View Shape
1149,IS,1-2,$1 $2 $3 Dimension(s)
1150,,,Exposure Time
1151,,,X-Ray Tube Current
1152,,,%1
1153,,,$1 in µAs
1154,DS,,Average Pulse Width
1155,CS,,Radiation Setting
1156,,,Rectification Type
115A,,,%1 Mode
115E,DS,,Image and Fluoroscopy Area Dose Product
1160,SH,,Filter Type
1161,LO,1-n,$2 of Filters
1162,DS,,Intensifier Size
1164,,2,Imager Pixel Spacing
1166,CS,1-n,Grid
1170,IS,,Generator Power
1180,SH,,Collimator/grid Name
1181,CS,,Collimator Type
1182,IS,1-2,Focal Distance
1183,DS,1-2,X Focus Center
1184,,1-2,Y $2 $3
1190,,1-n,Focal Spot(s)
1191,CS,,Anode Target Material
11A0,DS,,Body Part Thickness
11A2,,,Compression Force
11A3,,,$1 Pressure
11A4,LO,,Paddle Description
11A5,DS,,%1 Contact Area
11B0,LO,,Acquisition Mode
11B1,,,Dose $2 Name
11B2,CS,,Acquired Subtraction Mask Flag
11B3,,,Fluoroscopy Persistence $4
11B4,,,$1 Last Image Hold $2 $3
11B5,IS,,Upper Limit Number Of Persistent $1 Frames
11B6,CS,,Contrast/Bolus Auto Injection Trigger %6
11B7,FD,,$1 $3 Delay
11B8,SQ,,XA Acquisition Phase Details Sequence
11B9,FD,,$1 $2 Frame Rate
11BA,SQ,,$1 Plane %4 %5
11BB,LO,,%2 Field of View Label
11BC,SQ,,X-Ray Filter %3 %4
11BD,FD,,XA %1 Duration
11BE,CS,,Reconstruction Pipeline Type
11BF,SQ,,Image Filter Details Sequence
11C0,CS,,Applied Mask Subtraction Flag
11C1,SQ,,Requested Series Description Code %4
1200,DA,1-n,Date of Last Calibration
1201,TM,1-n,Time $2 $3 $4
1202,DT,,DateTime $2 $3 $4
1203,,,$4 $1
1204,DA,,Date %2 Manufacture
1205,,,$1 $2 Installation
1210,SH,1-n,Convolution Kernel
1240,IS,1-n,Upper/Lower Pixel Values
1242,,,Actual Frame Duration
1243,,,Count Rate
1244,US,,Preferred Playback Sequencing
1250,SH,,Receive Coil Name
1251,,,Transmit $2 $3
1260,,,Plate Type
1261,LO,,Phosphor $2
1271,FD,,Water Equivalent Diameter
1272,SQ,,$1 $2 $3 Calculation Method Code Sequence
1300,DS,,Scan Velocity
1301,CS,1-n,Whole Body Technique
1302,IS,,%1 Length
1310,US,4,Acquisition Matrix
1312,CS,,In-plane Phase Encoding Direction
1314,DS,,Flip Angle
1315,CS,,Variable $1 $2 Flag
1316,DS,,SAR
1318,,,dB/dt
1320,FL,,B1rms
1400,LO,,Acquisition Device Processing Description
1401,,,$1 $2 $3 Code
1402,CS,,Cassette Orientation
1403,,,$1 Size
1404,US,,Exposures on Plate
1405,IS,,Relative X-Ray Exposure
1411,DS,,$3 Index
1412,,,Target $1 $2
1413,,,Deviation $3
1450,,,Column Angulation
1460,,,Tomo Layer Height
1470,,,$1 Angle
1480,,,$1 Time
1490,CS,,$1 Type
1491,,,$1 Class
1495,IS,,Number of Tomosynthesis Source Images
1500,CS,,Positioner Motion
1508,,,$1 Type
1510,DS,,$1 Primary Angle
1511,,,$1 Secondary $3
1520,,1-n,$1 %2 $3 Increment
1521,,1-n,$1 %2 $3 $4
1530,,,Detector %2 $3
1531,,,$1 %2 $3
1600,CS,1-3,Shutter Shape
1602,IS,,$1 Left Vertical Edge
1604,,,$1 Right $3 $4
1606,,,$1 Upper Horizontal $4
1608,,,$1 Lower $3 $4
1610,,2,Center of Circular $1
1612,,,Radius $2 $3 $4
1620,,2-2n,Vertices $2 the Polygonal $4
1622,US,,$5 Presentation Value
1623,,,$1 Overlay Group
1624,,3,$1 %2 Color CIELab %3
1630,CS,,Outline Shape Type
1631,FD,,$1 Left Vertical Edge
1632,,,$1 Right $3 $4
1633,,,$1 Upper Horizontal $4
1634,,,$1 Lower $3 $4
1635,,2,Center of Circular $1
1636,,,Diameter $2 $3 $4
1637,UL,,Number $2 Polygonal Vertices
1638,OF,,$4 $2 the $3 %4
1700,CS,1-3,Collimator Shape
1702,IS,,$1 Left Vertical Edge
1704,,,$1 Right $3 $4
1706,,,$1 Upper Horizontal $4
1708,,,$1 Lower $3 $4
1710,,2,Center of Circular $1
1712,,,Radius $2 $3 $4
1720,,2-2n,Vertices $2 the Polygonal $4
1800,CS,,Acquisition Time Synchronized
1801,SH,,$2 Source
1802,CS,,$1 Distribution Protocol
1803,LO,,NTP %2 Address
2001,IS,1-n,Page Number Vector
2002,SH,1-n,Frame Label $3
2003,DS,1-n,$1 Primary Angle $3
2004,,1-n,$1 Secondary $3 $4
2005,,1-n,Slice Location $4
2006,SH,1-n,Display Window Label $3
2010,DS,2,Nominal Scanned Pixel Spacing
2020,CS,,Digitizing Device Transport Direction
2030,DS,,Rotation of %2 Film
2041,SQ,,Biopsy Target Sequence
2042,UI,,$2 UID
2043,FL,2,Localizing Cursor Position
2044,,3,Calculated %1 $3
2045,SH,,$2 Label
2046,FL,,Displayed Z Value
3100,CS,,IVUS Acquisition
3101,DS,,$1 Pullback Rate
3102,,,$1 Gated $3
3103,IS,,$1 %2 Start Frame Number
3104,,,$1 $2 Stop $4 $5
3105,,1-n,Lesion $5
4000,LT,,Acquisition Comments
5000,SH,1-n,Output Power
5010,LO,1-n,Transducer Data
5011,SQ,,$1 Identification Sequence
5012,DS,,Focus Depth
5020,LO,,Processing Function
5021,,,Postprocessing $2
5022,DS,,Mechanical Index
5024,,,Bone Thermal $2
5026,,,Cranial $2 $3
5027,,,Soft Tissue $2 $3
5028,,,$1 Tissue-focus $3 $4
5029,,,$1 Tissue-surface $3 $4
5030,,,Dynamic Range
5040,,,Total Gain
5050,IS,,Depth of Scan Field
5100,CS,,Patient Position
5101,,,View $2
5104,SQ,,Projection Eponymous Name Code Sequence
5210,DS,6,Image Transformation Matrix
5212,,3,$1 Translation Vector
6000,,,Sensitivity
6011,SQ,,Sequence of Ultrasound Regions
6012,US,,Region Spatial Format
6014,,,$1 Data Type
6016,UL,,$1 Flags
6018,,,$1 Location Min X0
601A,,,$1 $2 $3 Y0
601C,,,$1 $2 Max X1
601E,,,$1 $2 $3 Y1
6020,SL,,Reference Pixel X0
6022,,,$1 $2 Y0
6024,US,,Physical Units X Direction
6026,,,$1 $2 Y $4
6028,FD,,Reference Pixel $1 Value %3
602A,,,$1 $2 $3 $4 %3
602C,,,$3 Delta %5
602E,,,$1 $2 %5
6030,UL,,Transducer Frequency
6031,CS,,$1 Type
6032,UL,,Pulse Repetition %2
6034,FD,,Doppler Correction Angle
6036,,,Steering $3
6038,UL,,%1 Sample Volume X Position (Retired)
6039,SL,,$1 $2 $3 $4 $5
603A,UL,,$1 $2 $3 Y $5 %6
603B,SL,,$1 $2 $3 $4 $5
603C,UL,,TM-Line $5 X0 %6
603D,SL,,$1 $2 $3
603E,UL,,$1 $2 Y0 %4
603F,SL,,$1 $2 $3
6040,UL,,$1 $2 X1 %4
6041,SL,,$1 $2 $3
6042,UL,,$1 $2 Y1 %4
6043,SL,,$1 $2 $3
6044,US,,Pixel Component Organization
6046,UL,,$1 $2 Mask
6048,,,$1 $2 Range Start
604A,,,$1 $2 $3 Stop
604C,US,,$1 $2 Physical Units
604E,,,$1 $2 Data Type
6050,UL,,Number of Table Break Points
6052,,1-n,$3 $2 X $4 $5
6054,FD,1-n,$1 $2 Y $4 $5
6056,UL,,Number $2 $1 Entries
6058,,1-n,$3 $2 Pixel Values
605A,FL,1-n,$1 $2 Parameter $4
6060,,1-n,R Wave Time Vector
6070,US,,Active Image Area Overlay Group
7000,CS,,Detector Conditions Nominal Flag
7001,DS,,$1 Temperature
7004,CS,,$1 Type
7005,,,$1 Configuration
7006,LT,,$1 Description
7008,,,$1 Mode
700A,SH,,$1 ID
700C,DA,,Date of Last $1 Calibration
700E,TM,,Time $2 $3 $4 $5
7010,IS,,Exposures on $4 Since $3 $5
7011,,,$1 $2 $3 $4 Manufactured
7012,DS,,$3 Time $4 %5 Exposure
7014,,,$1 Active $2
7016,,,$1 Activation Offset From %5
701A,,2,$1 Binning
7020,,2,$1 Element Physical Size
7022,,2,$1 $2 Spacing
7024,CS,,$1 Active Shape
7026,DS,1-2,$1 $2 Dimension(s)
7028,,2,$1 $2 Origin
702A,LO,,$1 Manufacturer Name
702B,,,$1 Manufacturer's Model $3
7030,DS,2,Field of View Origin
7032,,,$1 $2 $3 Rotation
7034,CS,,$1 $2 $3 Horizontal Flip
7036,FL,2,Pixel Data Area Origin Relative To FOV
7038,,,$1 $2 $3 Rotation Angle $5 $6 $7
7040,LT,,Grid Absorbing Material
7041,,,$1 Spacing $3
7042,DS,,$1 Thickness
7044,,,$1 Pitch
7046,IS,2,$1 Aspect Ratio
7048,DS,,$1 Period
704C,,,$1 Focal Distance
7050,CS,1-n,Filter Material
7052,DS,1-n,$1 Thickness Minimum
7054,,1-n,$1 $2 Maximum
7056,FL,1-n,$1 Beam Path Length %3
7058,,1-n,$1 $2 $3 $4 %3
7060,CS,,Exposure Control Mode
7062,LT,,$1 $2 $3 Description
7064,CS,,$1 Status
7065,DS,,Phototimer Setting
8150,,,%1 Time in µS
8151,,,X-Ray Tube Current $3 µA
9004,CS,,Content Qualification
9005,SH,,Pulse Sequence Name
9006,SQ,,MR Imaging Modifier $2
9008,CS,,Echo %1 $4
9009,,,Inversion Recovery
9010,,,Flow Compensation
9011,,,Multiple Spin Echo
9012,,,Multi-planar Excitation
9014,,,Phase Contrast
9015,,,Time of Flight $2
9016,,,Spoiling
9017,,,Steady State Pulse Sequence
9018,,,Echo Planar $3 $4
9019,FD,,Tag Angle First Axis
9020,CS,,Magnetization Transfer
9021,,,T2 Preparation
9022,,,Blood Signal Nulling
9024,,,Saturation Recovery
9025,,,Spectrally Selected Suppression
9026,,,$1 $2 Excitation
9027,,,Spatial Pre-saturation
9028,,,Tagging
9029,,,Oversampling Phase
9030,FD,,Tag Spacing First Dimension
9032,CS,,Geometry of k-Space Traversal
9033,,,Segmented $3 $4
9034,,,Rectilinear Phase Encode Reordering
9035,FD,,Tag Thickness
9036,CS,,Partial Fourier Direction
9037,,,Cardiac Synchronization Technique
9041,LO,,Receive Coil Manufacturer Name
9042,SQ,,MR $1 $2 Sequence
9043,CS,,$2 $3 Type
9044,,,Quadrature $1 $2
9045,SQ,,Multi-Coil Definition Sequence
9046,LO,,$1 Configuration
9047,SH,,$1 Element Name
9048,CS,,$1 $2 Used
9049,SQ,,MR Transmit Coil Sequence
9050,LO,,$2 $3 Manufacturer Name
9051,CS,,$1 $2 Type
9052,FD,1-2,Spectral Width
9053,,1-2,Chemical Shift Reference
9054,CS,,Volume Localization Technique
9058,US,,MR Acquisition Frequency Encoding Steps
9059,CS,,De-coupling
9060,,1-2,De-coupled Nucleus
9061,FD,1-2,%1 Frequency
9062,CS,,$1 Method
9063,FD,1-2,$1 Chemical Shift Reference
9064,CS,,k-space Filtering
9065,,1-2,Time Domain $2
9066,US,1-2,Number of Zero Fills
9067,CS,,Baseline Correction
9069,FD,,Parallel Reduction Factor In-plane
9070,,,Cardiac R-R Interval Specified
9073,,,Acquisition Duration
9074,DT,,Frame $1 DateTime
9075,CS,,Diffusion Directionality
9076,SQ,,$1 Gradient Direction Sequence
9077,CS,,Parallel Acquisition
9078,,,$1 $2 Technique
9079,FD,1-n,Inversion Times
9080,ST,,Metabolite Map Description
9081,CS,,Partial Fourier
9082,FD,,Effective Echo Time
9083,SQ,,Metabolite Map Code Sequence
9084,,,Chemical Shift $4
9085,CS,,Cardiac Signal Source
9087,FD,,Diffusion b-value
9089,,3,$1 Gradient Orientation
9090,,3,Velocity Encoding Direction
9091,,,$1 $2 Minimum Value
9092,SQ,,$1 $2 Acquisition Sequence
9093,US,,Number of k-Space Trajectories
9094,CS,,Coverage $2 $3
9095,UL,,Spectroscopy Acquisition Phase Rows
9096,FD,,Parallel Reduction Factor In-plane (Retired)
9098,,1-2,Transmitter Frequency
9100,CS,1-2,Resonant Nucleus
9101,,,%2 Correction
9103,SQ,,MR Spectroscopy FOV/Geometry Sequence
9104,FD,,Slab Thickness
9105,,3,$1 Orientation
9106,,3,Mid $1 Position
9107,SQ,,MR Spatial Saturation Sequence
9112,,,$1 Timing and Related Parameters $4
9114,,,$1 Echo $6
9115,,,$1 Modifier $3
9117,,,$1 Diffusion $3
9118,,,Cardiac Synchronization $3
9119,,,%1 Averages $3
9125,,,$1 FOV/Geometry $3
9126,,,Volume Localization $3
9127,UL,,Spectroscopy Acquisition Data Columns
9147,CS,,Diffusion Anisotropy Type
9151,DT,,Frame Reference DateTime
9152,SQ,,MR Metabolite Map Sequence
9155,FD,,Parallel Reduction Factor out-of-plane
9159,UL,,Spectroscopy Acquisition Out-of-plane Phase Steps
9166,CS,,Bulk Motion Status
9168,FD,,Parallel Reduction Factor Second In-plane
9169,CS,,Cardiac Beat Rejection Technique
9170,,,Respiratory Motion Compensation $4
9171,,,$1 Signal Source
9172,,,Bulk %2 %3 %4
9173,,,$1 $2 %2 %3
9174,,,Applicable Safety Standard Agency
9175,LO,,$1 $2 $3 Description
9176,SQ,,Operating Mode Sequence
9177,CS,,$1 $2 Type
9178,,,$1 $2
9179,,,Specific Absorption Rate Definition
9180,,,Gradient Output Type
9181,FD,,%1 %2 %3 Value
9182,,,%1 %2
9183,CS,,Flow Compensation Direction
9184,FD,,Tagging Delay
9185,ST,,Respiratory Motion %2 Technique Description
9186,SH,,$1 Signal Source ID
9195,FD,,Chemical Shift Minimum Integration Limit in Hz
9196,,,$1 $2 Maximum $4 $5 $6 $7
9197,SQ,,MR Velocity Encoding Sequence
9198,CS,,First Order Phase Correction
9199,,,Water Referenced $3 $4
9200,,,MR Spectroscopy Acquisition Type
9214,,,Respiratory Cycle Position
9217,FD,,Velocity Encoding Maximum Value
9218,,,Tag Spacing Second Dimension
9219,SS,,$1 Angle $3 Axis
9220,FD,,Frame Acquisition Duration
9226,SQ,,MR Image $1 Type Sequence
9227,,,$1 Spectroscopy $3 $4 $5
9231,US,,$1 Acquisition Phase Encoding Steps in-plane
9232,,,$1 $2 $3 $4 $5 out-of-plane
9234,UL,,Spectroscopy $2 $3 Columns
9236,CS,,Cardiac Cycle Position
9239,SQ,,Specific Absorption Rate Sequence
9240,US,,RF Echo Train Length
9241,,,Gradient $2 $3 $4
9250,CS,,Arterial Spin Labeling Contrast
9251,SQ,,MR $1 $2 $3 Sequence
9252,LO,,ASL Technique Description
9253,US,,$1 Slab Number
9254,FD,,$1 $2 Thickness
9255,,3,$1 $2 Orientation
9256,,3,$1 Mid $2 Position
9257,CS,,$1 Context
9258,UL,,$1 Pulse Train Duration
9259,CS,,$1 Crusher Flag
925A,FD,,$1 $2 Flow Limit
925B,LO,,$1 $2 Description
925C,CS,,$1 Bolus Cut-off Flag
925D,SQ,,$1 $2 $3 Timing Sequence
925E,LO,,$1 $2 $3 Technique
925F,UL,,$1 $2 $3 Delay Time
9260,SQ,,$1 Slab Sequence
9295,FD,,Chemical Shift Minimum Integration Limit in ppm
9296,,,$1 $2 Maximum $4 $5 $6 $7
9297,CS,,Water Reference Acquisition
9298,IS,,Echo Peak Position
9301,SQ,,CT %3 Type Sequence
9302,CS,,$2 $3
9303,FD,,Tube Angle
9304,SQ,,CT %1 Details Sequence
9305,FD,,Revolution Time
9306,,,Single Collimation Width
9307,,,Total $2 $3
9308,SQ,,CT Table Dynamics Sequence
9309,FD,,$2 Speed
9310,,,$1 Feed per Rotation
9311,,,Spiral Pitch Factor
9312,SQ,,CT Geometry Sequence
9313,FD,3,Data Collection Center (Patient)
9314,SQ,,%1 Reconstruction %3
9315,CS,,$2 Algorithm
9316,,,Convolution Kernel Group
9317,FD,2,%1 Field of View
9318,,3,$1 Target Center (Patient)
9319,,,$1 Angle
9320,SH,,Image Filter
9321,SQ,,CT Exposure Sequence
9322,FD,2,Reconstruction Pixel Spacing
9323,CS,1-n,%2 Modulation Type
9324,FD,,Estimated Dose Saving
9325,SQ,,CT X-Ray Details Sequence
9326,,,$1 Position $4
9327,FD,,Table $2
9328,,,Exposure Time in ms
9329,SQ,,CT Image Frame Type Sequence
9330,FD,,X-Ray Tube Current %3 mA
9332,,,Exposure $4 mAs
9333,CS,,Constant Volume Flag
9334,,,Fluoroscopy $3
9335,FD,,Distance Source to Data Collection Center
9337,US,,Contrast/Bolus Agent Number
9338,SQ,,$1 Ingredient Code Sequence
9340,,,Contrast Administration Profile $4
9341,,,%1 Usage $4
9342,CS,,$1 Agent Administered
9343,,,$1 $2 Detected
9344,,,$1 $2 Phase
9345,FD,,CTDIvol
9346,SQ,,CTDI Phantom Type Code Sequence
9351,FL,,Calcium Scoring Mass Factor Patient
9352,,3,$1 $2 $3 $4 Device
9353,,,Energy Weighting $4
9360,SQ,,CT Additional X-Ray Source Sequence
9361,CS,,Multi-energy $1 Acquisition
9362,SQ,,$1 $2 $3 %5
9363,,,$1 $2 Processing $4
9364,,,$1 $2 Characteristics $4
9365,,,$1 $2 X-Ray Source $4
9366,US,,$3 $4 Index
9367,UC,,$1 $2 ID
9368,CS,,Multi-energy $2 Technique
9369,DT,,$2 Start DateTime
936A,,,$1 End $3
936B,US,,Switching Phase Number
936C,DS,,$1 $2 Nominal Duration
936D,,,$1 $2 Transition $4
936E,,,Effective Bin Energy
936F,SQ,,Multi-energy CT X-Ray Detector Sequence
9370,US,,$3 $4 Index
9371,UC,,$1 $2 ID
9372,CS,,Multi-energy $2 Type
9373,ST,,%1 $2 Label
9374,DS,,Nominal Max Energy
9375,,,$1 Min $3
9376,US,1-n,Referenced X-Ray Detector Index
9377,,1-n,$1 $2 Source $4
9378,,1-n,$1 Path $4
9379,SQ,,Multi-energy CT $2 Sequence
937A,US,,$1 $2 $3 %3
937B,UT,,$1 Acquisition Description
937C,FD,,Monoenergetic Energy Equivalent
937D,SQ,,Material Code Sequence
937E,CS,,Decomposition Method
937F,UT,,$1 Description
9380,SQ,,$1 Algorithm Identification Sequence
9381,,,$1 Material $4
9382,,,$2 Attenuation $3
9383,DS,,Photon Energy
9384,,,X-Ray Mass %2 Coefficient
9401,SQ,,Projection Pixel Calibration Sequence
9402,FL,,Distance Source to Isocenter
9403,,,$1 Object $3 Table Top
9404,,2,$2 Pixel Spacing in Center of Beam
9405,SQ,,Positioner Position Sequence
9406,,,Table $2 $3
9407,,,Collimator Shape $3
9410,CS,,Planes in Acquisition
9412,SQ,,XA/XRF Frame Characteristics %3
9417,,,$2 %3 $4
9420,CS,,X-Ray Receptor Type
9423,LO,,%2 Protocol Name
9424,LT,,$1 $2 Description
9425,CS,,Contrast/Bolus Ingredient Opaque
9426,FL,,Distance Receptor Plane to Detector Housing
9427,CS,,Intensifier Active Shape
9428,FL,1-2,$1 $2 Dimension(s)
9429,,2,Physical Detector Size
9430,,2,Position of Isocenter Projection
9432,SQ,,Field $2 View Sequence
9433,LO,,$1 $2 $3 Description
9434,SQ,,Exposure Control Sensing Regions %4
9435,CS,,$1 $2 $3 Region Shape
9436,SS,,$1 $2 $3 $4 Left Vertical Edge
9437,,,$1 $2 $3 $4 Right $6 $7
9438,,,$1 $2 $3 $4 Upper Horizontal $7
9439,,,$1 $2 $3 $4 Lower $6 $7
9440,,2,Center of Circular $1 $2 $3 $4
9441,US,,Radius $2 $3 $4 $5 $6 $7
9442,SS,2-n,Vertices $2 the Polygonal $4 $5 $6 $7
9447,FL,,Column Angulation (Patient)
9449,,,Beam Angle
9451,SQ,,Frame Detector Parameters Sequence
9452,FL,,Calculated Anatomy Thickness
9455,SQ,,Calibration %4
9456,,,Object %3 $2
9457,CS,,Plane Identification
9461,FL,1-2,Field of View Dimension(s) in Float
9462,SQ,,Isocenter Reference System Sequence
9463,FL,,Positioner $1 Primary Angle
9464,,,$1 $2 Secondary $4
9465,,,$1 $2 Detector Rotation $4
9466,,,Table X Position to $2
9467,,,$1 Y $3 $4 $5
9468,,,$1 Z $3 $4 $5
9469,,,$1 Horizontal Rotation Angle
9470,,,$1 Head Tilt $4
9471,,,$1 Cradle $3 $4
9472,SQ,,Frame Display Shutter Sequence
9473,FL,,Acquired Image Area Dose Product
9474,CS,,C-arm Positioner Tabletop Relationship
9476,SQ,,X-Ray Geometry Sequence
9477,,,Irradiation Event Identification $3
9504,,,%1 3D Frame Type $4
9506,,,Contributing Sources $5
9507,,,%1 %2 Acquisition $3
9508,FL,,Primary Positioner Scan Arc
9509,,,Secondary $2 $3 $4
9510,,,%1 $2 $3 Start Angle
9511,,,%1 $2 $3 $4 $5
9514,,,%1 $2 Increment
9515,,,%1 $2 $3
9516,DT,,Start Acquisition DateTime
9517,,,End $2 $3
9518,SS,,Primary Positioner Increment Sign
9519,,,Secondary $2 $3 $4
9524,LO,,Application Name
9525,,,$1 Version
9526,,,$1 Manufacturer
9527,CS,,Algorithm Type
9528,LO,,$1 Description
9530,SQ,,X-Ray 3D Reconstruction Sequence
9531,LO,,$3 %2
9538,SQ,,Per Projection Acquisition %4
9541,,,Detector Position $4
9542,,,X-Ray %3 Dose $3
9543,FD,,$1 Source Isocenter Primary Angle
9544,,,$1 $2 $3 Secondary $5
9545,,,Breast Support $3 %4 $5
9546,,,$1 $2 $3 %4 $5
9547,,,$1 $2 X Position to $3
9548,,,$1 $2 Y $4 $5 $6
9549,,,$1 $2 Z $4 $5 $6
9550,,,Detector $6 Primary Angle
9551,,,$1 $2 Secondary $4
9552,,,$1 X Position to $2
9553,,,$1 Y $3 $4 $5
9554,,,$1 Z $3 $4 $5
9555,SQ,,X-Ray Grid Sequence
9556,,,$1 Filter $3
9557,FD,3,Detector Active Area TLHC Position
9558,,6,$1 $2 $3 Orientation
9559,CS,,Positioner Primary Angle Direction
9601,SQ,,Diffusion b-matrix Sequence
9602,FD,,$1 b-value XX
9603,,,$1 $2 XY
9604,,,$1 $2 XZ
9605,,,$1 $2 YY
9606,,,$1 $2 YZ
9607,,,$1 $2 ZZ
9621,SQ,,Functional MR Sequence
9622,CS,,$1 Settling Phase Frames Present
9623,DT,,$1 Sync Pulse
9624,CS,,%2 %3 Frame
9701,DT,,Decay Correction DateTime
9715,FD,,Start Density Threshold
9716,,,$1 Relative $2 Difference $3
9717,,,$1 Cardiac Trigger Count $5
9718,,,$1 Respiratory $3 $4 $5
9719,,,Termination Counts $5
9720,,,$1 Density $3
9721,,,$1 Relative $2 $3
9722,,,$1 Time $4
9723,,,$1 Cardiac Trigger Count $3
9724,,,$1 Respiratory $3 $4 $5
9725,CS,,Detector Geometry
9726,FD,,Transverse $1 Separation
9727,,,Axial $2 Dimension
9729,US,,Radiopharmaceutical Agent Number
9732,SQ,,PET Frame Acquisition Sequence
9733,,,$1 Detector Motion Details $4
9734,,,$1 Table Dynamics $5
9735,,,$1 Position $4
9736,,,$1 Frame Correction Factors $3
9737,,,Radiopharmaceutical Usage $5
9738,CS,,Attenuation %3 Source
9739,US,,Number of Iterations
9740,,,$1 $2 Subsets
9749,SQ,,PET Reconstruction Sequence
9751,,,$1 Frame Type $3
9755,CS,,Time of Flight Information Used
9756,,,Reconstruction %3
9758,,,Decay Corrected
9759,,,Attenuation $2
9760,,,Scatter $2
9761,,,Dead Time $2
9762,,,Gantry Motion $3
9763,,,Patient $2 $3
9764,,,Count Loss Normalization $3
9765,,,Randoms $4
9766,,,Non-uniform Radial Sampling $2
9767,,,Sensitivity Calibrated
9768,,,Detector Normalization Correction
9769,,,Iterative Reconstruction Method
9770,,,Attenuation %3 Temporal Relationship
9771,SQ,,Patient Physiological State Sequence
9772,,,$1 $2 $3 Code $4
9801,FD,1-n,Depth(s) of Focus
9803,SQ,,Excluded Intervals %5
9804,DT,,Exclusion Start DateTime
9805,FD,,$1 Duration
9806,SQ,,US Image Description Sequence
9807,,,$2 Data Type $4
9808,CS,,$2 $3
9809,SQ,,Transducer Scan Pattern Code %4
980B,CS,,Aliased %1 %2
980C,,,Position Measuring Device Used
980D,SQ,,Transducer Geometry Code Sequence
980E,,,$1 Beam Steering $3 $4
980F,,,$1 Application $4 $5
9810,US/SS,,Zero Velocity Pixel Value
9821,SQ,,Photoacoustic Excitation Characteristics %4
9822,FD,,$2 Spectral Width
9823,,,$1 Energy
9824,,,$1 Pulse Duration
9825,SQ,,$1 Wavelength Sequence
9826,FD,,$1 $2
9828,CS,,Illumination Translation Flag
9829,,,Acoustic Coupling Medium $3
982A,SQ,,$1 $2 $3 Code Sequence
982B,FD,,$1 $2 $3 Temperature
982C,SQ,,Transducer Response %5
982D,FD,,Center Frequency
982E,,,Fractional Bandwidth
982F,,,Lower Cutoff %2
9830,,,Upper $2 $3
9831,SQ,,Transducer Technology Sequence
9832,,,Sound Speed Correction Mechanism Code $3
9833,FD,,Object $1 $2
9834,,,Acoustic Coupling Medium $2 $3
9835,SQ,,Photoacoustic Image Frame Type Sequence
9836,,,$2 Data $4 Code $5
9900,LO,,Reference Location Label
9901,UT,,$1 $2 Description
9902,SQ,,$1 Basis Code Sequence
9903,,,$1 Geometry $3 $4
9904,DS,,Offset Distance
9905,CS,,$1 Direction
9906,SQ,,Potential Scheduled Protocol Code Sequence
9907,,,$1 Requested Procedure $4 $5
9908,UC,1-n,$1 Reasons for $3
9909,SQ,,$1 $2 $3 $4 %4 %5
990A,UC,1-n,$1 Diagnostic Tasks
990B,SQ,,Contraindications %5 %6
990C,,,Referenced Defined Protocol $3
990D,,,$1 Performed $3 $4
990E,,,Predecessor $3 $4
990F,UT,,$2 Planning Information
9910,,,$1 Design Rationale
9911,SQ,,Patient Specification Sequence
9912,,,Model $2 $3
9913,,,Parameters $2 $3
9914,,,Instruction $3
9915,US,,$1 Index
9916,LO,,$1 Text
9917,UT,,$1 Description
9918,CS,,$1 Performed Flag
9919,DT,,$1 $2 DateTime
991A,UT,,$1 Performance Comment
991B,SQ,,Patient Positioning $1 Sequence
991C,,,$2 Method Code $4
991D,,,$1 Landmark $4
991E,UI,,Target Frame of Reference UID
991F,SQ,,Acquisition Protocol Element Specification %3
9920,,,$1 $2 $3 $5
9921,US,,$2 $3 Number
9922,LO,,$1 $2 Name
9923,UT,,$1 $2 Characteristics Summary
9924,,,$1 $2 Purpose
9930,CS,,Acquisition Motion
9931,SQ,,$1 Start Location Sequence
9932,,,$1 End $3 $4
9933,,,Reconstruction Protocol Element Specification $4
9934,,,$1 $2 $3 $5
9935,,,Storage $2 $3 %4 $4
9936,,,$1 $2 $3 $5
9937,LO,,Requested Series Description
9938,US,1-n,Source Acquisition %2 %3 Number
9939,,1-n,$1 $2 Beam $5
993A,,1-n,$1 Reconstruction %3 %4 $4
993B,SQ,,$2 Start Location Sequence
993C,,,$1 End $3 $4
993D,,,$1 Algorithm $4
993E,,,$1 Target Center %3 $3
9941,UT,,Image Filter Description
9942,FD,,CTDIvol Notification Trigger
9943,,,DLP $2 $3
9944,CS,,Auto KVP Selection Type
9945,FD,,$1 $2 Upper Bound
9946,,,$1 $2 Lower $4
9947,CS,,Protocol Defined Patient Position
A001,SQ,,Contributing Equipment Sequence
A002,DT,,Contribution DateTime
A003,ST,,$1 Description
0020000D,UI,,Study Instance UID
E,,,Series $2 $3
10,SH,,%1 ID
11,IS,,%1 Number
12,,,Acquisition $2
13,,,Instance $2
14,,,Isotope $2
15,,,Phase $2
16,,,Interval $2
17,,,Time Slot $2
18,,,Angle $3
19,,,Item $2
20,CS,2,Patient Orientation
22,IS,,Overlay %2
24,,,Curve $2
26,,,LUT $2
27,LO,,Pyramid Label
30,DS,3,Image Position
32,,3,$1 $2 (Patient)
35,,6,$1 Orientation
37,,6,$1 $2 %3
50,,,Location
52,UI,,Frame of Reference UID
60,CS,,Laterality
62,,,Image $1
70,LO,,$1 Geometry Type
80,CS,1-n,Masking $1
AA,IS,,Report Number
100,,,Temporal Position Identifier
105,,,%2 of $1 Positions
110,DS,,$3 Resolution
200,UI,,Synchronization Frame %2 Reference UID
242,,,SOP Instance $5 $3 Concatenation Source
1000,IS,,Series in Study
1001,,,Acquisitions $2 $1
1002,,,Images $2 Acquisition
1003,,,$1 $2 %3
1004,,,Acquisitions $2 Study
1005,,,%1 $2 $3
1020,LO,1-n,Reference
103F,,,Target Position $1 Indicator
1040,,,$2 $3 $4
1041,DS,,Slice Location
1070,IS,1-n,Other Study Numbers
1200,,,Number of Patient Related Studies
1202,,,$1 $2 $3 $4 Series
1204,,,$1 $2 $3 $4 Instances
1206,,,$1 $2 Study $4 %5
1208,,,$1 $2 $3 $4 %5
1209,,,$1 $2 %5 $4 $5
31xx,CS,1-n,Source Image IDs
3401,,,Modifying Device ID
3402,,,Modified %2 $3
3403,DA,,$1 $2 Date
3404,LO,,Modifying Device Manufacturer
3405,TM,,%1 %2 Time
3406,LO,,$1 $2 Description
4000,LT,,$2 Comments
5000,AT,1-n,Original $1 Identification
5002,LO,1-n,$1 $2 $3 Nomenclature
9056,SH,,Stack ID
9057,UL,,In-Stack Position Number
9071,SQ,,Frame Anatomy Sequence
9072,CS,,$1 Laterality
9111,SQ,,$1 Content %3
9113,,,Plane Position $3
9116,,,$1 Orientation $3
9128,UL,,Temporal %2 Index
9153,FD,,Nominal Cardiac Trigger Delay Time
9154,FL,,$1 $2 $3 $5 Prior To R-Peak
9155,,,Actual $2 $3 $4 $5 $6 $7
9156,US,,Frame Acquisition Number
9157,UL,1-n,Dimension Index Values
9158,LT,,%1 Comments
9161,UI,,Concatenation UID
9162,US,,In-concatenation Number
9163,,,$1 Total $2
9164,UI,,Dimension Organization UID
9165,AT,,$1 Index Pointer
9167,,,Functional Group $3
9170,SQ,,Unassigned Shared Converted Attributes Sequence
9171,,,$1 Per-Frame $3 $4 $5
9172,,,Conversion Source $4 $5
9213,LO,,Dimension Index Private Creator
9221,SQ,,$1 Organization %4
9222,,,$1 %2 $3
9228,UL,,Concatenation Frame Offset Number
9238,LO,,Functional Group Private Creator
9241,FL,,Nominal Percentage of Cardiac Phase
9245,,,$1 $2 $3 Respiratory $5
9246,,,Starting $4 Amplitude
9247,CS,,$1 $2 %5
9248,FL,,Ending $2 %3
9249,CS,,$1 $2 %3
9250,,,$2 Trigger Type
9251,FD,,R-R Interval Time Nominal
9252,,,Actual Cardiac %2 Delay $3
9253,SQ,,Respiratory Synchronization Sequence
9254,FD,,$1 Interval %5
9255,,,Nominal $1 Trigger Delay $3
9256,,,$2 $3 $4 Threshold
9257,,,Actual $1 $2 $3 %5
9301,,3,Image Position (Volume)
9302,,6,$1 Orientation $3
9307,CS,,Ultrasound Acquisition Geometry
9308,FD,3,Apex Position
9309,,16,Volume to Transducer Mapping Matrix
930A,,16,$1 $2 Table $4 $5
930B,CS,,$1 $2 %3 Relationship
930C,,,Patient Frame of Reference Source
930D,FD,,Temporal Position Time Offset
930E,SQ,,Plane $2 (Volume) Sequence
930F,,,$1 Orientation $3 $4
9310,,,Temporal %2 $4
9311,CS,,Dimension Organization Type
9312,UI,,Volume Frame of Reference UID
9313,,,Table $2 $3 $4 $5
9421,LO,,Dimension Description Label
9450,SQ,,Patient Orientation in %2 Sequence
9453,LO,,$4 %3
9518,US,1-n,Acquisition Index
9529,SQ,,Contributing SOP Instances Reference Sequence
9536,US,,Reconstruction %2
00280002,,,Samples per Pixel
3,,,$1 $2 $3 Used
4,CS,,Photometric Interpretation
5,US,,Image Dimensions
6,,,Planar Configuration
8,IS,,Number of Frames
9,AT,1-n,Frame Increment Pointer
A,,1-n,$1 Dimension $3
10,US,,Rows
11,,,Columns
12,,,Planes
14,,,Ultrasound Color Data Present
30,DS,2,Pixel Spacing
31,,2,Zoom Factor
32,,2,$1 Center
34,IS,2,Pixel Aspect Ratio
40,CS,,Image Format
50,LO,1-n,Manipulated $1
51,CS,1-n,Corrected $2
5F,LO,,Compression Recognition Code
60,CS,,$1 $3
61,SH,,$1 Originator
62,LO,,$1 Label
63,SH,,$1 Description
65,CS,1-n,$1 Sequence
66,AT,1-n,$1 Step Pointers
68,US,,Repeat Interval
69,,,Bits Grouped
70,,1-n,Perimeter Table
71,US/SS,,$1 Value
80,US,,Predictor Rows
81,,,$1 Columns
82,,1-n,$1 Constants
90,CS,,Blocked Pixels
91,US,,Block Rows
92,,,$1 Columns
93,,,Row Overlap
94,,,Column $2
100,,,Bits Allocated
101,,,$1 Stored
102,,,High Bit
103,,,Pixel Representation
104,US/SS,,Smallest Valid $1 Value
105,,,Largest $2 $3 $4
106,,,%1 Image $3 $4
107,,,%1 $2 $3 $4
108,,,%1 $3 $4 in Series
109,,,%1 $2 $3 $4 $5
110,,,%1 Image $2 $3 $4 Plane
111,,,%1 $2 $3 $4 $5 $6
120,,,$3 Padding $4
121,,,$1 $2 Range Limit
122,FL,,Float $1 $2 %3
123,FD,,Double $1 $2 $3 $4
124,FL,,$2 $3 $4 Range Limit
125,FD,,%1 $1 $2 $3 $4 $5
200,US,,Image Location
300,CS,,Quality Control $1
301,,,Burned In Annotation
302,,,Recognizable Visual Features
303,,,Longitudinal Temporal Information Modified
304,UI,,Referenced Color Palette Instance UID
400,LO,,Transform Label
401,,,$1 Version Number
402,US,,$3 of $1 Steps
403,LO,1-n,Sequence $2 Compressed Data
404,AT,1-n,Details $2 Coefficients
4x0,US,,Rows For Nth Order $3
4x1,,,Columns $2 $3 $4 $5
4x2,LO,1-n,Coefficient Coding
4x3,AT,1-n,$1 $2 Pointers
700,LO,,DCT Label
701,CS,1-n,Data Block Description
702,AT,1-n,$1 $2
710,US,,Normalization Factor Format
720,,,Zonal Map Number $3
721,AT,1-n,$1 $2 Location
722,US,,$1 $2 %4
730,,,Adaptive $2 $3
740,,,Code Number $3
8x0,CS,1-n,$1 Label
8x2,US,,%2 of Tables
8x3,AT,1-n,%1 Table Location
8x4,US,,Bits For $1 Word
8x8,AT,1-n,Image Data %3
A02,CS,,Pixel Spacing Calibration Type
A04,LO,,$1 $2 $3 Description
1040,CS,,$1 Intensity Relationship
1041,SS,,$1 $2 $3 Sign
1050,DS,1-n,Window Center
1051,,1-n,$1 Width
1052,,,Rescale Intercept
1053,,,$1 Slope
1054,LO,,$1 Type
1055,,1-n,Window Center &amp; Width Explanation
1056,CS,,VOI LUT Function
1080,,,Gray Scale
1090,,,Recommended Viewing Mode
1100,US/SS,3,%1 Lookup Table Descriptor
1101,,3,Red Palette Color $2 $3 $4
1102,,3,Green $2 $3 $4 $5 $6
1103,,3,Blue $2 $3 $4 $5 $6
1104,US,3,Alpha $2 $3 $4 $5 $6
1111,US/SS,4,Large Red $2 $3 $4 $5 $6
1112,,4,$1 Green $3 $4 $5 $6 $7
1113,,4,$1 Blue $3 $4 $5 $6 $7
1199,UI,,$3 $4 $5 $6 UID
1200,US/SS/OW,1-n/1,Gray $3 $4 Data
1201,OW,,Red %1 %2 $2 $3 $4
1202,,,Green $2 $3 $4 $5 $6
1203,,,Blue $2 $3 $4 $5 $6
1204,,,Alpha $2 $3 $4 $5 $6
1211,,,Large Red $2 $3 $4 $5 $6
1212,,,$1 Green $3 $4 $5 $6 $7
1213,,,$1 Blue $3 $4 $5 $6 $7
1214,UI,,$1 $3 $4 $5 $6 UID
1221,OW,,Segmented Red $2 $3 $4 $5 %7
1222,,,$1 Green $3 $4 $5 $6 $7
1223,,,$1 Blue $3 $4 $5 $6 $7
1224,,,$1 Alpha $3 $4 $5 $6 $7
1230,SQ,,Stored Value $4 Range Sequence
1231,FD,,Minimum $1 $2 Mapped
1232,,,Maximum $2 $3 $4
1300,CS,,Breast Implant Present
1350,,,Partial View
1351,ST,,$1 $2 Description
1352,SQ,,$1 $2 Code Sequence
135A,CS,,Spatial Locations Preserved
1401,SQ,,Data Frame Assignment %4
1402,CS,,$1 Path $3
1403,US,,Bits Mapped to Color Lookup Table
1404,SQ,,Blending LUT 1 Sequence
1405,CS,,$1 $2 $3 Transfer Function
1406,FD,,$1 Weight Constant
1407,US,3,$1 Lookup Table Descriptor
1408,OW,,$1 $2 $3 Data
140B,SQ,,Enhanced Palette Color $2 $3 Sequence
140C,,,%1 LUT 2 $6
140D,CS,,$1 $2 $3 Transfer Function
140E,,,Data Path ID
140F,,,RGB %2 %4 %5
1410,,,Alpha $2 $3 $4
2000,OB,,ICC Profile
2002,CS,,Color Space
2110,,,Lossy Image Compression
2112,DS,1-n,$1 $2 $3 Ratio
2114,CS,1-n,$1 $2 $3 Method
3000,SQ,,Modality LUT Sequence
3001,,,Variable $1 $2 $3
3002,US/SS,3,$3 Descriptor
3003,LO,,$1 Explanation
3004,,,Modality $1 Type
3006,US/OW,1-n/1,$2 Data
3010,SQ,,VOI $1 Sequence
3110,,,Softcopy $1 $2 $3
4000,LT,,Image Presentation Comments
5000,SQ,,Bi-Plane Acquisition %4
6010,US,,Representative Frame Number
6020,,1-n,$2 Numbers of Interest (FOI)
6022,LO,1-n,$1 $3 $4 Description
6023,CS,1-n,$1 $2 $3 Type
6030,US,1-n,Mask Pointer(s)
6040,,1-n,R Wave Pointer
6100,SQ,,%1 Subtraction Sequence
6101,CS,,$1 Operation
6102,US,2-2n,Applicable Frame Range
6110,,1-n,%1 $2 Numbers
6112,,,Contrast $2 Averaging
6114,FL,2,%1 Sub-pixel Shift
6120,SS,,TID Offset
6190,ST,,%1 Operation Explanation
7000,SQ,,Equipment Administrator Sequence
7001,US,,Number of Display Subsystems
7002,,,Current Configuration ID
7003,,,%3 Subsystem $3
7004,SH,,$1 $2 Name
7005,LO,,$1 $2 Description
7006,CS,,System Status
7007,LO,,$1 $2 Comment
7008,SQ,,Target Luminance Characteristics Sequence
7009,US,,$2 $3 ID
700A,SQ,,Display Subsystem Configuration %4
700B,US,,$3 %3
700C,SH,,$1 Name
700D,LO,,$1 Description
700E,US,,Referenced Target Luminance Characteristics ID
700F,SQ,,QA Results Sequence
7010,,,Display Subsystem $1 $2 $3
7011,,,Configuration $3 $4 $5
7012,,,Measurement Equipment $4
7013,CS,1-n,$1 Functions
7014,,,$1 %2 Type
7015,SQ,,Visual Evaluation Result Sequence
7016,,,Display Calibration $3 $4
7017,US,,DDL Value
7018,FL,2,CIExy White Point
7019,CS,,Display Function Type
701A,FL,,Gamma Value
701B,US,,Number of Luminance Points
701C,SQ,,$3 Response Sequence
701D,FL,,Target Minimum $1
701E,,,$1 Maximum $3
701F,,,$3 Value
7020,LO,,$1 Response Description
7021,CS,,White Point Flag
7022,SQ,,Display Device Type Code Sequence
7023,,,$1 Subsystem $5
7024,,,Luminance Result $3
7025,CS,,Ambient Light Value Source
7026,,1-n,Measured Characteristics
7027,SQ,,Luminance Uniformity Result Sequence
7028,,,Visual Evaluation Test $4
7029,CS,,$3 %3
702A,LO,,$1 $2 Comment
702B,CS,,$1 Image Validation
702C,SQ,,$1 Pattern Code Sequence
702D,,,Measurement $2 $3 $4
702E,,,Visual Evaluation Method $3 $4
7FE0,UR,,Pixel Data Provider URL
9001,UL,,$2 Point Rows
9002,,,$1 $2 Columns
9003,CS,,Signal Domain $3
9099,US,,Largest Monochrome Pixel Value
9108,CS,,Data Representation
9110,SQ,,%3 Measures Sequence
9132,,,Frame VOI LUT $3
9145,,,%1 Value Transformation $4
9235,CS,,Signal Domain Rows
9411,FL,,Display Filter Percentage
9415,SQ,,Frame Pixel Shift Sequence
9416,US,,Subtraction Item ID
9422,SQ,,%2 Intensity Relationship LUT %4
9443,,,Frame $1 Data Properties $5
9444,CS,,Geometrical $4
9445,FL,,Geometric Maximum Distortion
9446,CS,1-n,Image Processing Applied
9454,,,Mask Selection Mode
9474,,,LUT Function
9478,FL,,%1 Visibility Percentage
9501,SQ,,Pixel Shift Sequence
9502,,,Region $1 $2 $3
9503,SS,2-2n,Vertices of the $1
9505,SQ,,Multi-frame Presentation %4
9506,US,2-2n,Pixel Shift Frame Range
9507,,2-2n,LUT $3 $4
9520,DS,16,Image to Equipment Mapping Matrix
9537,CS,,$3 Coordinate System Identification
0032000A,,,Study Status ID
C,,,$1 Priority $3
12,LO,,$1 $3 Issuer
32,DA,,$1 Verified Date
33,TM,,$1 $2 Time
34,DA,,$1 Read %3
35,TM,,$1 $2 %3
1000,DA,,Scheduled $1 Start %3
1001,TM,,$1 $2 $3 %3
1010,DA,,$1 $2 Stop %4
1011,TM,,$1 $2 $3 %4
1020,LO,,$1 $2 Location
1021,AE,1-n,$1 $2 $3 AE Title
1030,LO,,Reason for $2
1031,SQ,,Requesting Physician Identification Sequence
1032,PN,,$1 $2
1033,LO,,$1 Service
1034,SQ,,$1 $2 Code Sequence
1040,DA,,Study Arrival Date
1041,TM,,$1 $2 Time
1050,DA,,$1 Completion %3
1051,TM,,$1 $2 %3
1055,CS,,$1 Component Status ID
1060,LO,,Requested Procedure Description
1064,SQ,,$1 $2 Code Sequence
1065,,,$1 Laterality $3 $4
1066,UT,,Reason for Visit
1067,SQ,,$1 $2 $3 %3 %4
1070,LO,,Requested Contrast Agent
4000,LT,,Study Comments
00380004,SQ,,Referenced Patient Alias Sequence
8,CS,,Visit Status ID
10,LO,,Admission $3
11,,,Issuer of $1 $2
14,SQ,,$1 $2 $3 $4 Sequence
16,LO,,Route $2 Admissions
1A,DA,,Scheduled %3 Date
1B,TM,,$1 $2 Time
1C,DA,,$1 Discharge %3
1D,TM,,$1 $2 %3
1E,LO,,$1 Patient Institution Residence
20,DA,,Admitting Date
21,TM,,$1 Time
30,DA,,Discharge %2
32,TM,,$1 %2
40,LO,,$1 Diagnosis Description
44,SQ,,$1 $2 Code Sequence
50,LO,,Special Needs
60,,,Service Episode ID
61,,,Issuer of $1 $2 $3
62,,,$3 $4 Description
64,SQ,,%1 %2 $1 $2 %5 Sequence
100,,,Pertinent Documents $6
101,,,$1 Resources $3
102,LO,,Resource Description
300,,,Current Patient Location
400,,,Patient's Institution Residence
500,,,%2 State
502,SQ,,$1 Clinical Trial Participation Sequence
4000,LT,,Visit Comments
00400001,AE,1-n,Scheduled Station AE Title
2,DA,,$1 Procedure Step Start Date
3,TM,,$1 $2 $3 $4 Time
4,DA,,$1 $2 $3 End %5
5,TM,,$1 $2 $3 $4 %5
6,PN,,$1 Performing Physician's Name
7,LO,,$1 %2 %3 Description
8,SQ,,$1 Protocol Code Sequence
9,SH,,$1 %2 %3 ID
A,SQ,,Stage %3 %4
B,,,%1 Performing Physician Identification $3
10,SH,1-n,$1 Station Name
11,,,$1 Procedure Step Location
12,LO,,Pre-Medication
20,CS,,%1 %2 %3 Status
26,SQ,,Order Placer Identifier Sequence
27,,,$1 Filler $3 $4
31,UT,,Local Namespace Entity ID
32,,,Universal $3 $4
33,CS,,$1 $2 $3 Type
35,,,Identifier $4 Code
36,SQ,,Assigning Facility Sequence
39,,,$1 Jurisdiction %3 $3
3A,,,$1 Agency or Department $3 $4
100,,,Scheduled Procedure Step $6
220,,,Referenced Non-Image Composite SOP Instance $4
241,AE,,Performed Station AE Title
242,SH,,$1 $2 Name
243,,,$1 Location
244,DA,,$1 Procedure Step Start Date
245,TM,,$1 $2 $3 $4 Time
250,DA,,$1 $2 $3 End %5
251,TM,,$1 $2 $3 $4 %5
252,CS,,$1 $2 $3 Status
253,SH,,$1 $2 $3 ID
254,LO,,$1 $2 $3 Description
255,,,$1 $2 Type $4
260,SQ,,$1 Protocol Code Sequence
261,CS,,$1 $2 %3
270,SQ,,Scheduled Step Attributes %4
275,,,Request $3 $4
280,ST,,Comments on the Performed Procedure %2
281,SQ,,$4 $5 $6 Discontinuation Reason Code %3
293,,,Quantity $7
294,DS,,$1
295,SQ,,Measuring Units %2
296,,,Billing Item $3
300,US,,Total Time of Fluoroscopy
301,,,$1 Number $3 Exposures
302,,,Entrance Dose
303,,1-2,Exposed Area
306,DS,,Distance Source to %1
307,,,$1 $2 $3 Support
30E,SQ,,Exposure Dose Sequence
310,ST,,Comments on Radiation $2
312,DS,,X-Ray Output
314,,,Half Value Layer
316,,,Organ Dose
318,CS,,$1 Exposed
320,SQ,,Billing Procedure Step Sequence
321,,,Film Consumption $4
324,,,%1 Supplies and Devices $3
330,,,Referenced Procedure Step $5
340,,,Performed Series $4
400,LT,,Comments on the Scheduled %2 %3
440,SQ,,Protocol Context %3
441,,,Content Item Modifier $3
500,,,Scheduled Specimen $4
50A,LO,,$2 Accession Number
512,,,Container Identifier
513,SQ,,Issuer of the $1 $2 Sequence
515,,,Alternate $4 $5 $6
518,,,$2 Type Code $4
51A,LO,,$1 Description
520,SQ,,$1 Component %4
550,,,Specimen $3
551,LO,,$1 Identifier
552,SQ,,$1 Description %2 (Trial)
553,ST,,$1 $2 $4
554,UI,,$1 UID
555,SQ,,Acquisition Context Sequence
556,ST,,$1 $2 Description
59A,SQ,,Specimen Type Code %3
560,,,$1 %3 $4
562,,,Issuer of the $1 Identifier $3
600,LO,,$4 Short %2
602,UT,,$1 Detailed $3
610,SQ,,$1 Preparation Sequence
612,,,$1 $2 Step Content Item $3
620,,,$1 Localization $4 $5 $6
6FA,LO,,Slide Identifier
710,SQ,,Whole $1 Microscopy Image Frame Type %5
71A,,,$4 Center Point Coordinates $7
72A,DS,,X Offset in %2 Coordinate System
73A,,,Y $2 $3 $4 $5 $6
74A,,,Z $2 $3 $4 $5 $6
8D8,SQ,,Pixel Spacing Sequence
8DA,,,%5 %6 Axis Code $3
8EA,,,Measurement Units $4 $5
9F8,,,Vital Stain $3 $4 (Trial)
1001,SH,,Requested Procedure ID
1002,LO,,Reason for the $1 $2
1003,SH,,$4 $5 Priority
1004,LO,,Patient Transport Arrangements
1005,,,%1 %2 Location
1006,SH,,Placer Order Number / $2
1007,,,Filler $2 $3 $4 $5
1008,LO,,Confidentiality Code
1009,SH,,Reporting Priority
100A,SQ,,Reason for Requested Procedure %2 Sequence
1010,PN,1-n,Names of Intended Recipients of Results
1011,SQ,,$3 $4 $2 $6 Identification %6
1012,,,Reason For Performed Procedure Code $6
1060,LO,,Requested $4 Description (Trial)
1101,SQ,,Person Identification %5 %6
1102,ST,,Person's Address
1103,LO,1-n,$1 Telephone Numbers
1104,LT,,$1 Telecom Information
1400,,,Requested Procedure Comments
2001,LO,,Reason for the Imaging Service Request
2004,DA,,Issue Date of $4 $5 $6
2005,TM,,$1 Time $3 $4 $5 $6
2006,SH,,Placer Order Number / $4 $5 $6 (Retired)
2007,,,Filler $2 $3 $4 $5 $6 $7 $8
2008,PN,,$2 Entered By
2009,SH,,$1 Enterer's Location
2010,,,$1 Callback Phone Number
2011,LT,,$1 $2 Telecom Information
2016,LO,,Placer $1 %4 / Imaging Service Request
2017,,,Filler $2 $3 $4 $5 $6 $7
2400,LT,,$5 $6 $7 Comments
3001,LO,,Confidentiality Constraint on Patient Data Description
4001,CS,,General Purpose Scheduled Procedure Step Status
4002,,,$1 $2 Performed $4 $5 $6
4003,,,$1 $2 %3 $4 $5 Priority
4004,SQ,,$3 Processing Applications Code Sequence
4005,DT,,$1 %4 %5 Start DateTime
4006,CS,,Multiple Copies Flag
4007,SQ,,Performed Processing Applications Code Sequence
4008,DT,,Scheduled Procedure Step Expiration DateTime
4009,SQ,,Human Performer %4 %5
4010,DT,,%1 %2 %3 Modification %5
4011,,,Expected Completion $5
4015,SQ,,Resulting General Purpose Performed %2 Steps Sequence
4016,,,Referenced $2 $3 Scheduled $5 Step $7
4018,,,$4 Workitem Code $7
4019,,,Performed $2 $3 $4
4020,CS,,Input Availability Flag
4021,SQ,,$1 Information %4
4022,,,Relevant $2 $3
4023,UI,,Referenced General Purpose Scheduled Procedure Step Transaction UID
4025,SQ,,$4 Station Name Code %3
4026,,,$1 $2 Class $4 $5
4027,,,$1 $2 Geographic Location $4 $5
4028,,,Performed $2 Name $5 $6
4029,,,$1 $2 Class $4 $5
4030,,,$1 $2 Geographic Location $4 $5
4031,,,Requested Subsequent Workitem $5 $6
4032,,,Non-DICOM Output $4 $5
4033,,,$2 Information $4
4034,,,Scheduled Human Performers $3
4035,,,Actual $2 $3 $4
4036,LO,,$2 Performer's Organization
4037,PN,,$1 $2 Name
4040,CS,,Raw Data Handling
4041,,,Input Readiness State
4050,DT,,Performed Procedure Step Start DateTime
4051,,,$1 $2 $3 End $5
4052,,,$2 $3 Cancellation $5
4070,SQ,,Output Destination Sequence
4071,,,DICOM Storage $3
4072,,,STOW-RS $2 $3
4073,UR,,$2 URL
4074,SQ,,XDS $1 %3
8302,DS,,Entrance Dose in mGy
8303,CS,,$1 $2 Derivation
9092,SQ,,Parametric Map Frame Type Sequence
9094,,,Referenced Image Real World Value Mapping $5
9096,,,$3 $4 $5 $6 $7
9098,,,Pixel $3 $4 Code $5
9210,SH,,LUT Label
9211,US/SS,,Real World %2 Last %2 Mapped
9212,FD,1-n,$1 $2 $3 %1 Data
9213,,,Double Float $1 $2 $3 %4 $3 %6
9214,,,$1 $2 $3 $4 $5 First $5 $8
9216,US/SS,,$3 $4 $5 $6 $5 $8
9220,SQ,,Quantity Definition Sequence
9224,FD,,%1 %2 %3 Intercept
9225,,,$1 $2 $3 Slope
A007,CS,,Findings Flag (Trial)
A010,,,Relationship Type
A020,SQ,,%1 Sequence %3
A021,UI,,$1 Group UID $3
A022,,,Referenced $1 $2 $3 $4
A023,DA,,$2 $3 Recording Date $5
A024,TM,,$1 $2 $3 Time $5
A026,SQ,,$1 Source Category Code Sequence $5
A027,LO,,Verifying Organization
A028,SQ,,Documenting $2 Identifier %4 %5 %6
A030,DT,,Verification DateTime
A032,,,Observation $2
A033,,,$1 Start $2
A034,,,Effective $2 $3
A035,,,$1 Stop $3
A040,CS,,Value Type
A043,SQ,,Concept Name Code Sequence
A047,LO,,Measurement Precision Description (Trial)
A050,CS,,Continuity Of Content
A057,,1-n,Urgency or Priority Alerts %4
A060,LO,,Sequencing Indicator $5
A066,SQ,,Document Identifier Code Sequence $3
A067,PN,,$1 Author $5
A068,SQ,,$1 $2 %2 %3 %4 $3
A070,,,$3 $4 $5 $6
A073,,,Verifying Observer $3
A074,OB,,Object Binary %1 %4
A075,PN,,%1 %2 Name
A076,SQ,,Documenting $2 %3 Code Sequence %4
A078,,,Author $2 $5
A07A,,,Participant $3
A07C,,,Custodial Organization $2
A080,CS,,Participation Type
A082,DT,,$1 DateTime
A084,CS,,Observer %2
A085,SQ,,Procedure Identifier Code Sequence (Trial)
A088,,,Verifying %1 Identification $3 $4
A089,OB,,Object Directory Binary %2 %5
A090,SQ,,Equivalent CDA Document %5
A0B0,US,2-2n,Referenced Waveform Channels
A110,DA,,Date of %3 or Verbal Transaction (Trial)
A112,TM,,Time $2 $3 Creation $4 $5 $6 $7
A120,DT,,DateTime
A121,DA,,Date
A122,TM,,Time
A123,PN,,Person Name
A124,UI,,UID
A125,CS,2,Report Status ID (Trial)
A130,,,Temporal Range Type
A132,UL,1-n,Referenced Sample Positions
A136,US,1-n,$1 Frame Numbers
A138,DS,1-n,$1 Time Offsets
A13A,DT,1-n,$1 DateTime
A160,UT,,Text Value
A161,FD,1-n,Floating Point $2
A162,SL,1-n,Rational Numerator $3
A163,UL,1-n,$1 Denominator $3
A167,SQ,,Observation Category Code Sequence (Trial)
A168,,,Concept $3 $4
A16A,ST,,Bibliographic Citation %5
A170,SQ,,Purpose of Reference %2 %3
A171,UI,,Observation UID
A172,,,Referenced $1 $2 (Trial)
A173,CS,,$1 $2 Class $4
A174,,,$1 Object $2 $3 $4
A180,US,,Annotation Group Number
A192,DA,,%3 Date %5
A193,TM,,$1 Time $3
A194,CS,,Measurement Automation $3
A195,SQ,,Modifier Code Sequence
A224,ST,,Identification Description %3
A290,CS,,Coordinates Set Geometric Type $3
A296,SQ,,Algorithm Code Sequence $5
A297,ST,,$1 Description $4
A29A,SL,2-2n,Pixel Coordinates Set $3
A300,SQ,,Measured Value Sequence
A301,,,Numeric $2 Qualifier Code $3
A307,PN,,Current Observer (Trial)
A30A,DS,1-n,%1 %2
A313,SQ,,Referenced Accession Sequence %3
A33A,ST,,Report Status Comment $4
A340,SQ,,Procedure Context %3 $4
A352,PN,,Verbal Source $4
A353,ST,,Address $3
A354,LO,,Telephone Number $2
A358,SQ,,Verbal Source Identifier Code Sequence $3
A360,,,Predecessor Documents $5
A370,,,Referenced Request $3
A372,,,Performed Procedure Code $3
A375,,,Current Requested $2 Evidence $4
A380,,,Report Detail $5 (Trial)
A385,,,Pertinent Other %4 $3
A390,,,HL7 Structured Document Reference $4
A402,UI,,Observation Subject UID (Trial)
A403,CS,,$1 $2 Class $4
A404,SQ,,$1 $2 Type Code Sequence $4
A491,CS,,Completion Flag
A492,LO,,$1 $2 Description
A493,CS,,Verification $2
A494,,,Archive Requested
A496,,,Preliminary %2
A504,SQ,,Content Template Sequence
A525,,,Identical Documents $3
A600,CS,,Observation Subject Context Flag (Trial)
A601,,,Observer $3 $4 $5
A603,,,Procedure $2 $3 $4
A730,SQ,,Content Sequence
A731,,,Relationship $2 %4
A732,,,$1 Type Code $2 $3
A744,,,Language $3 $4 $5
A801,,,Tabulated Values $3
A802,UL,,Number of Table Rows
A803,,,$1 $2 $3 Columns
A804,,,$3 Row $1
A805,,,$1 Column $3
A806,SQ,,$1 %2 Definition Sequence
A807,,,$1 %2 $3 $4
A808,,,Cell Values $4
A992,ST,,Uniform Resource Locator (Trial)
B020,SQ,,Waveform Annotation %3
B030,,,Structured $1 $2 $3
B031,,,$2 $3 Display Selection $4
B032,US,,Referenced Montage Index
B033,SQ,,%1 Textual %2 %5
B034,DT,,$3 DateTime
B035,SQ,,Displayed %1 Segment %4
B036,DT,,$3 Definition %2
B037,SQ,,Montage Activation %4
B038,DS,,$1 $2 Time Offset
B039,SQ,,Waveform $1 %3
B03A,IS,,Referenced $2 Channel Number
B03B,LT,,$2 Name
B03C,SQ,,$1 %3 Sequence
B03D,US,,$1 Index
B03E,IS,,$1 %2 Number
B03F,LO,,$1 $2 Label
B040,SQ,,$1 $2 Source Code Sequence
B041,,,Contributing $2 Sources $5
B042,FL,,$2 Weight
DB00,CS,,Template Identifier
DB06,DT,,$1 Version
DB07,,,$1 Local $2
DB0B,CS,,$1 Extension Flag
DB0C,UI,,$1 $2 Organization UID
DB0D,,,$1 $2 Creator $4
DB73,UL,1-n,Referenced Content Item Identifier
E001,ST,,HL7 Instance $4
E004,DT,,$1 Document Effective Time
E006,SQ,,$1 $2 Type Code Sequence
E008,,,$2 Class $4 $5
E010,UR,,Retrieve URI
E011,UI,,$1 Location UID
E020,CS,,Type of Instances
E021,SQ,,DICOM Retrieval Sequence
E022,,,$1 Media $2 $3
E023,,,WADO $3 $4
E024,,,XDS $2 $3
E025,,,WADO-RS $2 $3
E030,UI,,Repository Unique ID
E031,,,Home Community $3
52009229,SQ,,Shared Functional Groups Sequence
9230,,,Per-Frame $2 $3 $4
7FE00001,OV,,Extended Offset Table
2,,,$1 $2 $3 Lengths
3,UV,,Encapsulated Pixel Data Value Total Length
8,OF,,Float $2 $3
9,OD,,Double $1 $2 $3
10,OB/OW,,$3 $4
20,OW,,Coefficients SDVN
30,,,$1 SDHN
40,,,$1 SDDN`;
}
