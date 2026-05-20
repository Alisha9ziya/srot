import { useEffect, useRef, useState, useCallback } from "react";

// ─── FONT LOADER ──────────────────────────────────────────────────────────────
if (!document.getElementById("jsu-fonts")) {
  const fontLink = document.createElement("link");
  fontLink.id = "jsu-fonts";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);
}

// ─── GOOGLE MAPS LOADER ───────────────────────────────────────────────────────
let googleMapsLoading = null;
function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve();
  if (googleMapsLoading) return googleMapsLoading;
  googleMapsLoading = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC517SgwdapcbstHJzzjzW-wtZWH3KyF_8&libraries=maps,marker&v=weekly";
    script.async = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
  return googleMapsLoading;
}

// ─── COLORS ──────────────────────────────────────────────────────────────────
const LIGHT = {
  bg:"#F8F6F2", card:"#ffffff", border:"#E2DED7", text:"#1C1A16",
 accent:"#4F46E5", 
accentDark:"#312E81",
accentLight:"#EEF2FF", 
accentBorder:"#A5B4FC", 
navActive:"#E0E7FF",
  topbar:"linear-gradient(135deg,#0F172A 0%,#1E1B4B 55%,#312E81 100%)",
sidebar:"#1E1B4B",
danger:"#C0392B", dangerBg:"#FDEDEC", warn:"#D68910", warnBg:"#FEF9E7",
good:"#4F46E5", goodBg:"#EEF2FF",
};
const DARK = {
  bg:"#0D1410", card:"#141F1A", border:"#1F3028", text:"#E8E4DD",
  accent:"#6366F1", accentDark:"#4338CA",
 accentLight:"#1E1B4B", accentBorder:"#3730A3", navActive:"#312E81",
  topbar:"linear-gradient(135deg,#020617 0%,#172554 55%,#312E81 100%)",
  sidebar:"#0F1A14", input:"#0A120D", inputBorder:"#1F3028",
  danger:"#E05245", dangerBg:"#2A0D0A", warn:"#D68910", warnBg:"#1A1200",
  good:"#34A76E", goodBg:"#0A1F12", sectionBg:"#0A150F",
};

// ─── ALL 36 STATES/UTs ───────────────────────────────────────────────────────
const STATES = [
  {name:"Andhra Pradesh",lgdCode:"28",lat:15.9129,lng:79.7400,zoom:7},
  {name:"Arunachal Pradesh",lgdCode:"12",lat:28.2180,lng:94.7278,zoom:7},
  {name:"Assam",lgdCode:"18",lat:26.2006,lng:92.9376,zoom:7},
  {name:"Bihar",lgdCode:"10",lat:25.0961,lng:85.3131,zoom:7},
  {name:"Chhattisgarh",lgdCode:"22",lat:21.2787,lng:81.8661,zoom:7},
  {name:"Goa",lgdCode:"30",lat:15.2993,lng:74.1240,zoom:9},
  {name:"Gujarat",lgdCode:"24",lat:22.2587,lng:71.1924,zoom:7},
  {name:"Haryana",lgdCode:"06",lat:29.0588,lng:76.0856,zoom:8},
  {name:"Himachal Pradesh",lgdCode:"02",lat:31.1048,lng:77.1734,zoom:8},
  {name:"Jharkhand",lgdCode:"20",lat:23.6102,lng:85.2799,zoom:7},
  {name:"Karnataka",lgdCode:"29",lat:15.3173,lng:75.7139,zoom:7},
  {name:"Kerala",lgdCode:"32",lat:10.8505,lng:76.2711,zoom:8},
  {name:"Madhya Pradesh",lgdCode:"23",lat:22.9734,lng:78.6569,zoom:6},
  {name:"Maharashtra",lgdCode:"27",lat:19.7515,lng:75.7139,zoom:6},
  {name:"Manipur",lgdCode:"14",lat:24.6637,lng:93.9063,zoom:8},
  {name:"Meghalaya",lgdCode:"17",lat:25.4670,lng:91.3662,zoom:8},
  {name:"Mizoram",lgdCode:"15",lat:23.1645,lng:92.9376,zoom:8},
  {name:"Nagaland",lgdCode:"13",lat:26.1584,lng:94.5624,zoom:8},
  {name:"Odisha",lgdCode:"21",lat:20.9517,lng:85.0985,zoom:7},
  {name:"Punjab",lgdCode:"03",lat:31.1471,lng:75.3412,zoom:8},
  {name:"Rajasthan",lgdCode:"08",lat:27.0238,lng:74.2179,zoom:6},
  {name:"Sikkim",lgdCode:"11",lat:27.5330,lng:88.5122,zoom:9},
  {name:"Tamil Nadu",lgdCode:"33",lat:11.1271,lng:78.6569,zoom:7},
  {name:"Telangana",lgdCode:"36",lat:18.1124,lng:79.0193,zoom:7},
  {name:"Tripura",lgdCode:"16",lat:23.9408,lng:91.9882,zoom:8},
  {name:"Uttar Pradesh",lgdCode:"09",lat:26.8467,lng:80.9462,zoom:6},
  {name:"Uttarakhand",lgdCode:"05",lat:30.0668,lng:79.0193,zoom:8},
  {name:"West Bengal",lgdCode:"19",lat:22.9868,lng:87.8550,zoom:7},
  {name:"Andaman & Nicobar Islands",lgdCode:"35",lat:11.7401,lng:92.6586,zoom:7,ut:true},
  {name:"Chandigarh",lgdCode:"04",lat:30.7333,lng:76.7794,zoom:12,ut:true},
  {name:"Dadra & Nagar Haveli and Daman & Diu",lgdCode:"26",lat:20.1809,lng:73.0169,zoom:10,ut:true},
  {name:"Delhi",lgdCode:"07",lat:28.7041,lng:77.1025,zoom:11,ut:true},
  {name:"Jammu & Kashmir",lgdCode:"01",lat:33.7782,lng:76.5762,zoom:7,ut:true},
  {name:"Ladakh",lgdCode:"38",lat:34.2996,lng:78.2932,zoom:7,ut:true},
  {name:"Lakshadweep",lgdCode:"31",lat:10.5667,lng:72.6417,zoom:10,ut:true},
  {name:"Puducherry",lgdCode:"34",lat:11.9416,lng:79.8083,zoom:11,ut:true},
];

// ─── DISTRICTS ────────────────────────────────────────────────────────────────
const DISTRICTS = {
  "Uttarakhand":[
    {name:"Almora",lat:29.5971,lng:79.6533,zoom:11},
    {name:"Bageshwar",lat:29.8376,lng:79.7712,zoom:11},
    {name:"Chamoli",lat:30.4023,lng:79.3278,zoom:10},
    {name:"Champawat",lat:29.3329,lng:80.0919,zoom:11},
    {name:"Dehradun",lat:30.3165,lng:78.0322,zoom:11},
    {name:"Haridwar",lat:29.9457,lng:78.1642,zoom:11},
    {name:"Nainital",lat:29.3919,lng:79.4542,zoom:11},
    {name:"Pauri Garhwal",lat:30.1523,lng:78.7834,zoom:10},
    {name:"Pithoragarh",lat:29.5831,lng:80.2128,zoom:11},
    {name:"Rudraprayag",lat:30.2841,lng:78.9812,zoom:11},
    {name:"Tehri Garhwal",lat:30.3863,lng:78.4801,zoom:11},
    {name:"Udham Singh Nagar",lat:28.9790,lng:79.4006,zoom:11},
    {name:"Uttarkashi",lat:30.7266,lng:78.4543,zoom:11},
  ],
  "Andhra Pradesh":[
    {name:"Alluri Sitharama Raju",lat:18.0,lng:82.5,zoom:10},{name:"Anakapalli",lat:17.69,lng:83.00,zoom:11},
    {name:"Ananthapuramu",lat:14.68,lng:77.60,zoom:10},{name:"Bapatla",lat:15.9,lng:80.46,zoom:11},
    {name:"Chittoor",lat:13.21,lng:79.10,zoom:10},{name:"East Godavari",lat:17.0,lng:81.8,zoom:10},
    {name:"Eluru",lat:16.71,lng:81.09,zoom:11},{name:"Guntur",lat:16.31,lng:80.44,zoom:11},
    {name:"Kakinada",lat:16.98,lng:82.24,zoom:11},{name:"Krishna",lat:16.61,lng:80.76,zoom:10},
    {name:"Kurnool",lat:15.83,lng:78.04,zoom:10},{name:"NTR",lat:16.51,lng:80.65,zoom:11},
    {name:"Nandyal",lat:15.48,lng:78.48,zoom:11},{name:"Prakasam",lat:15.33,lng:79.51,zoom:10},
    {name:"Srikakulam",lat:18.30,lng:83.90,zoom:10},{name:"Tirupati",lat:13.63,lng:79.42,zoom:11},
    {name:"Visakhapatnam",lat:17.69,lng:83.22,zoom:11},{name:"Vizianagaram",lat:18.12,lng:83.40,zoom:11},
    {name:"West Godavari",lat:16.55,lng:81.35,zoom:10},{name:"YSR Kadapa",lat:14.47,lng:78.82,zoom:10},
  ],
  "Bihar":[
    {name:"Araria",lat:26.15,lng:87.52,zoom:10},{name:"Arwal",lat:25.25,lng:84.68,zoom:11},
    {name:"Aurangabad",lat:24.75,lng:84.37,zoom:10},{name:"Begusarai",lat:25.42,lng:86.13,zoom:10},
    {name:"Bhagalpur",lat:25.24,lng:86.98,zoom:10},{name:"Buxar",lat:25.57,lng:83.98,zoom:10},
    {name:"Darbhanga",lat:26.15,lng:85.89,zoom:10},{name:"East Champaran",lat:26.65,lng:84.92,zoom:10},
    {name:"Gaya",lat:24.79,lng:85.00,zoom:10},{name:"Gopalganj",lat:26.47,lng:84.43,zoom:10},
    {name:"Katihar",lat:25.57,lng:87.58,zoom:10},{name:"Muzaffarpur",lat:26.12,lng:85.36,zoom:10},
    {name:"Nalanda",lat:25.27,lng:85.45,zoom:10},{name:"Patna",lat:25.59,lng:85.14,zoom:10},
    {name:"Purnia",lat:25.78,lng:87.48,zoom:10},{name:"Rohtas",lat:24.99,lng:84.03,zoom:10},
    {name:"Samastipur",lat:25.85,lng:85.78,zoom:10},{name:"Saran",lat:25.93,lng:84.73,zoom:10},
    {name:"Sitamarhi",lat:26.59,lng:85.49,zoom:10},{name:"Siwan",lat:26.22,lng:84.36,zoom:10},
    {name:"Vaishali",lat:25.72,lng:85.18,zoom:10},{name:"West Champaran",lat:27.15,lng:84.35,zoom:10},
  ],
  "Gujarat":[
    {name:"Ahmedabad",lat:23.02,lng:72.57,zoom:10},{name:"Amreli",lat:21.60,lng:71.22,zoom:10},
    {name:"Anand",lat:22.56,lng:72.93,zoom:10},{name:"Banaskantha",lat:24.17,lng:72.46,zoom:10},
    {name:"Bharuch",lat:21.71,lng:73.00,zoom:10},{name:"Bhavnagar",lat:21.76,lng:72.15,zoom:10},
    {name:"Gandhinagar",lat:23.22,lng:72.64,zoom:11},{name:"Jamnagar",lat:22.47,lng:70.06,zoom:10},
    {name:"Junagadh",lat:21.52,lng:70.46,zoom:10},{name:"Kutch",lat:23.73,lng:69.86,zoom:9},
    {name:"Rajkot",lat:22.30,lng:70.80,zoom:10},{name:"Surat",lat:21.17,lng:72.83,zoom:11},
    {name:"Vadodara",lat:22.31,lng:73.18,zoom:11},
  ],
  "Karnataka":[
    {name:"Bagalkote",lat:16.18,lng:75.70,zoom:10},{name:"Ballari",lat:15.15,lng:76.93,zoom:10},
    {name:"Belagavi",lat:15.85,lng:74.50,zoom:10},{name:"Bengaluru Rural",lat:13.15,lng:77.51,zoom:10},
    {name:"Bengaluru Urban",lat:12.97,lng:77.59,zoom:11},{name:"Bidar",lat:17.91,lng:77.52,zoom:10},
    {name:"Chikkamagaluru",lat:13.32,lng:75.77,zoom:10},{name:"Dakshina Kannada",lat:12.91,lng:74.86,zoom:10},
    {name:"Davanagere",lat:14.46,lng:75.92,zoom:10},{name:"Dharwad",lat:15.46,lng:75.01,zoom:10},
    {name:"Hassan",lat:13.00,lng:76.10,zoom:10},{name:"Kalaburagi",lat:17.33,lng:76.82,zoom:10},
    {name:"Kodagu",lat:12.42,lng:75.74,zoom:10},{name:"Mysuru",lat:12.30,lng:76.64,zoom:10},
    {name:"Raichur",lat:16.20,lng:77.36,zoom:10},{name:"Shivamogga",lat:13.93,lng:75.57,zoom:10},
    {name:"Tumakuru",lat:13.34,lng:77.10,zoom:10},{name:"Udupi",lat:13.34,lng:74.74,zoom:10},
    {name:"Vijayapura",lat:16.83,lng:75.72,zoom:10},
  ],
  "Kerala":[
    {name:"Alappuzha",lat:9.49,lng:76.34,zoom:10},{name:"Ernakulam",lat:9.98,lng:76.30,zoom:10},
    {name:"Idukki",lat:9.92,lng:77.10,zoom:10},{name:"Kannur",lat:11.87,lng:75.37,zoom:10},
    {name:"Kasaragod",lat:12.50,lng:75.00,zoom:10},{name:"Kollam",lat:8.89,lng:76.61,zoom:10},
    {name:"Kottayam",lat:9.59,lng:76.52,zoom:10},{name:"Kozhikode",lat:11.26,lng:75.78,zoom:10},
    {name:"Malappuram",lat:11.04,lng:76.07,zoom:10},{name:"Palakkad",lat:10.79,lng:76.65,zoom:10},
    {name:"Pathanamthitta",lat:9.27,lng:76.79,zoom:10},{name:"Thiruvananthapuram",lat:8.52,lng:76.94,zoom:11},
    {name:"Thrissur",lat:10.52,lng:76.21,zoom:10},{name:"Wayanad",lat:11.61,lng:76.08,zoom:10},
  ],
  "Maharashtra":[
    {name:"Ahmednagar",lat:19.10,lng:74.74,zoom:10},{name:"Akola",lat:20.71,lng:77.00,zoom:10},
    {name:"Amravati",lat:20.93,lng:77.78,zoom:10},{name:"Aurangabad",lat:19.88,lng:75.34,zoom:10},
    {name:"Chandrapur",lat:19.96,lng:79.30,zoom:10},{name:"Gadchiroli",lat:20.18,lng:80.00,zoom:9},
    {name:"Kolhapur",lat:16.71,lng:74.24,zoom:10},{name:"Latur",lat:18.40,lng:76.56,zoom:10},
    {name:"Mumbai City",lat:18.94,lng:72.84,zoom:12},{name:"Mumbai Suburban",lat:19.13,lng:72.85,zoom:12},
    {name:"Nagpur",lat:21.15,lng:79.09,zoom:10},{name:"Nashik",lat:20.00,lng:73.79,zoom:10},
    {name:"Pune",lat:18.52,lng:73.86,zoom:10},{name:"Raigad",lat:18.52,lng:73.18,zoom:10},
    {name:"Solapur",lat:17.66,lng:75.91,zoom:10},{name:"Thane",lat:19.22,lng:72.98,zoom:10},
  ],
  "Rajasthan":[
    {name:"Ajmer",lat:26.45,lng:74.64,zoom:10},{name:"Alwar",lat:27.55,lng:76.63,zoom:10},
    {name:"Barmer",lat:25.75,lng:71.39,zoom:10},{name:"Bharatpur",lat:27.22,lng:77.49,zoom:10},
    {name:"Bhilwara",lat:25.35,lng:74.63,zoom:10},{name:"Bikaner",lat:28.02,lng:73.31,zoom:10},
    {name:"Chittorgarh",lat:24.89,lng:74.62,zoom:10},{name:"Jaipur",lat:26.91,lng:75.79,zoom:10},
    {name:"Jaisalmer",lat:26.91,lng:70.92,zoom:10},{name:"Jodhpur",lat:26.24,lng:73.02,zoom:10},
    {name:"Kota",lat:25.21,lng:75.86,zoom:10},{name:"Udaipur",lat:24.58,lng:73.71,zoom:10},
  ],
  "Tamil Nadu":[
    {name:"Chennai",lat:13.08,lng:80.27,zoom:11},{name:"Coimbatore",lat:11.02,lng:76.96,zoom:10},
    {name:"Cuddalore",lat:11.75,lng:79.77,zoom:10},{name:"Dharmapuri",lat:12.13,lng:78.16,zoom:10},
    {name:"Dindigul",lat:10.37,lng:77.97,zoom:10},{name:"Erode",lat:11.34,lng:77.72,zoom:10},
    {name:"Kancheepuram",lat:12.83,lng:79.70,zoom:10},{name:"Madurai",lat:9.93,lng:78.12,zoom:10},
    {name:"Nagapattinam",lat:10.76,lng:79.84,zoom:10},{name:"Namakkal",lat:11.22,lng:78.17,zoom:10},
    {name:"Salem",lat:11.66,lng:78.15,zoom:10},{name:"Thanjavur",lat:10.79,lng:79.14,zoom:10},
    {name:"Tiruchirappalli",lat:10.79,lng:78.70,zoom:10},{name:"Tirunelveli",lat:8.71,lng:77.76,zoom:10},
    {name:"Vellore",lat:12.92,lng:79.13,zoom:10},
  ],
  "Telangana":[
    {name:"Adilabad",lat:19.66,lng:78.53,zoom:10},{name:"Hyderabad",lat:17.38,lng:78.49,zoom:11},
    {name:"Karimnagar",lat:18.44,lng:79.13,zoom:10},{name:"Khammam",lat:17.25,lng:80.15,zoom:10},
    {name:"Mahabubnagar",lat:16.74,lng:77.99,zoom:10},{name:"Medak",lat:18.05,lng:78.27,zoom:10},
    {name:"Nalgonda",lat:17.05,lng:79.27,zoom:10},{name:"Nizamabad",lat:18.67,lng:78.09,zoom:10},
    {name:"Ranga Reddy",lat:17.32,lng:78.33,zoom:10},{name:"Warangal",lat:17.97,lng:79.59,zoom:10},
  ],
  "Uttar Pradesh":[
    {name:"Agra",lat:27.18,lng:78.01,zoom:10},{name:"Aligarh",lat:27.90,lng:78.09,zoom:10},
    {name:"Ayodhya",lat:26.79,lng:82.19,zoom:10},{name:"Azamgarh",lat:26.07,lng:83.19,zoom:10},
    {name:"Bareilly",lat:28.37,lng:79.43,zoom:10},{name:"Deoria",lat:26.50,lng:83.78,zoom:10},
    {name:"Fatehpur",lat:25.93,lng:80.81,zoom:10},{name:"Firozabad",lat:27.15,lng:78.40,zoom:10},
    {name:"Gautam Buddha Nagar",lat:28.46,lng:77.49,zoom:10},{name:"Ghaziabad",lat:28.67,lng:77.44,zoom:10},
    {name:"Gorakhpur",lat:26.76,lng:83.37,zoom:10},{name:"Jhansi",lat:25.45,lng:78.57,zoom:10},
    {name:"Kanpur Nagar",lat:26.45,lng:80.33,zoom:10},{name:"Lucknow",lat:26.85,lng:80.95,zoom:10},
    {name:"Mathura",lat:27.49,lng:77.67,zoom:10},{name:"Meerut",lat:28.98,lng:77.71,zoom:10},
    {name:"Moradabad",lat:28.84,lng:78.78,zoom:10},{name:"Muzaffarnagar",lat:29.47,lng:77.70,zoom:10},
    {name:"Prayagraj",lat:25.44,lng:81.85,zoom:10},{name:"Saharanpur",lat:29.96,lng:77.55,zoom:10},
    {name:"Sultanpur",lat:26.27,lng:82.07,zoom:10},{name:"Varanasi",lat:25.32,lng:82.97,zoom:10},
  ],
  "West Bengal":[
    {name:"Bankura",lat:23.23,lng:87.07,zoom:10},{name:"Birbhum",lat:23.90,lng:87.53,zoom:10},
    {name:"Cooch Behar",lat:26.32,lng:89.44,zoom:10},{name:"Darjeeling",lat:27.04,lng:88.26,zoom:10},
    {name:"Hooghly",lat:22.90,lng:88.39,zoom:10},{name:"Howrah",lat:22.59,lng:88.26,zoom:11},
    {name:"Kolkata",lat:22.57,lng:88.36,zoom:11},{name:"Malda",lat:25.01,lng:88.14,zoom:10},
    {name:"Murshidabad",lat:24.18,lng:88.27,zoom:10},{name:"Nadia",lat:23.43,lng:88.54,zoom:10},
    {name:"Paschim Medinipur",lat:22.41,lng:87.32,zoom:10},{name:"Purba Medinipur",lat:22.14,lng:87.78,zoom:10},
    {name:"Purulia",lat:23.33,lng:86.37,zoom:10},{name:"South 24 Parganas",lat:22.05,lng:88.46,zoom:10},
  ],
  "Delhi":[
    {name:"Central Delhi",lat:28.6508,lng:77.2232,zoom:12},{name:"East Delhi",lat:28.6270,lng:77.2910,zoom:12},
    {name:"New Delhi",lat:28.6139,lng:77.2090,zoom:13},{name:"North Delhi",lat:28.7200,lng:77.2100,zoom:12},
    {name:"North East Delhi",lat:28.6952,lng:77.3018,zoom:12},{name:"South Delhi",lat:28.5355,lng:77.2500,zoom:12},
    {name:"West Delhi",lat:28.6520,lng:77.1020,zoom:12},
  ],
  "Jammu & Kashmir":[
    {name:"Anantnag",lat:33.73,lng:75.15,zoom:10},{name:"Baramulla",lat:34.21,lng:74.34,zoom:10},
    {name:"Budgam",lat:33.94,lng:74.72,zoom:10},{name:"Jammu",lat:32.73,lng:74.87,zoom:11},
    {name:"Kathua",lat:32.38,lng:75.52,zoom:10},{name:"Kupwara",lat:34.52,lng:74.26,zoom:10},
    {name:"Poonch",lat:33.77,lng:74.09,zoom:10},{name:"Rajouri",lat:33.38,lng:74.31,zoom:10},
    {name:"Srinagar",lat:34.08,lng:74.80,zoom:11},{name:"Udhampur",lat:32.92,lng:75.14,zoom:10},
  ],
  "Ladakh":[{name:"Kargil",lat:34.56,lng:76.13,zoom:10},{name:"Leh",lat:34.17,lng:77.58,zoom:11}],
  "Puducherry":[
    {name:"Karaikal",lat:10.92,lng:79.84,zoom:12},{name:"Mahe",lat:11.70,lng:75.53,zoom:13},
    {name:"Puducherry",lat:11.94,lng:79.81,zoom:12},{name:"Yanam",lat:16.73,lng:82.21,zoom:13},
  ],
  "Chandigarh":[{name:"Chandigarh",lat:30.73,lng:76.78,zoom:13}],
  "Goa":[{name:"North Goa",lat:15.5135,lng:73.9220,zoom:11},{name:"South Goa",lat:15.1519,lng:74.0440,zoom:11}],
};

// ═══════════════════════════════════════════════════════════════════════════════
// REAL UTTARAKHAND SUBDIVISIONS (Tehsils) — Complete per district
// ═══════════════════════════════════════════════════════════════════════════════
const UK_SUBDIVISIONS = {
  "Almora": [
    {name:"Almora",lat:29.5971,lng:79.6533,zoom:13},
    {name:"Ranikhet",lat:29.6407,lng:79.4317,zoom:13},
    {name:"Dwarahat",lat:29.7209,lng:79.4070,zoom:13},
    {name:"Bhikiyasain",lat:29.7120,lng:79.4490,zoom:13},
    {name:"Chaukhutia",lat:29.8768,lng:79.3543,zoom:13},
    {name:"Salt",lat:29.8434,lng:79.1923,zoom:13},
    {name:"Sult",lat:29.8012,lng:79.2830,zoom:13},
    {name:"Jainti",lat:29.5101,lng:79.7863,zoom:13},
    {name:"Lamgara",lat:29.5540,lng:79.5012,zoom:13},
    {name:"Hawalbagh",lat:29.5770,lng:79.6090,zoom:13},
  ],
  "Bageshwar": [
    {name:"Bageshwar",lat:29.8376,lng:79.7712,zoom:13},
    {name:"Kapkot",lat:29.9812,lng:80.0341,zoom:13},
    {name:"Garur",lat:29.8754,lng:79.6434,zoom:13},
    {name:"Kanda",lat:29.9123,lng:79.8765,zoom:13},
    {name:"Baijnath",lat:29.9234,lng:79.6234,zoom:13},
  ],
  "Chamoli": [
    {name:"Chamoli",lat:30.4023,lng:79.3278,zoom:13},
    {name:"Gopeshwar",lat:30.4058,lng:79.3165,zoom:13},
    {name:"Joshimath",lat:30.5581,lng:79.5641,zoom:13},
    {name:"Karnaprayag",lat:30.2641,lng:79.2485,zoom:13},
    {name:"Gairsain",lat:30.0812,lng:79.2834,zoom:13},
    {name:"Tharali",lat:30.2021,lng:79.1567,zoom:13},
    {name:"Narayanbagar",lat:30.0623,lng:79.0912,zoom:13},
    {name:"Pokhari",lat:30.3412,lng:79.4123,zoom:13},
    {name:"Dewal",lat:30.1834,lng:79.0234,zoom:13},
    {name:"Dasholi",lat:30.4234,lng:79.3501,zoom:13},
  ],
  "Champawat": [
    {name:"Champawat",lat:29.3329,lng:80.0919,zoom:13},
    {name:"Lohaghat",lat:29.4123,lng:80.0651,zoom:13},
    {name:"Pati",lat:29.2156,lng:80.1823,zoom:13},
    {name:"Barakot",lat:29.5023,lng:79.9734,zoom:13},
    {name:"Purnagiri",lat:29.2534,lng:80.0342,zoom:13},
  ],
  "Dehradun": [
    {name:"Dehradun",lat:30.3165,lng:78.0322,zoom:13},
    {name:"Rishikesh",lat:30.0869,lng:78.2676,zoom:13},
    {name:"Doiwala",lat:30.1730,lng:78.1230,zoom:13},
    {name:"Vikasnagar",lat:30.4526,lng:77.7618,zoom:13},
    {name:"Chakrata",lat:30.7019,lng:77.8684,zoom:13},
    {name:"Kalsi",lat:30.5340,lng:77.8490,zoom:13},
    {name:"Tyuni",lat:30.5898,lng:77.7423,zoom:13},
    {name:"Sahiya",lat:30.6234,lng:77.6834,zoom:13},
    {name:"Lakhamandal",lat:30.6812,lng:78.0512,zoom:13},
    {name:"Raipur",lat:30.3432,lng:78.0645,zoom:13},
  ],
  "Haridwar": [
    {name:"Haridwar",lat:29.9457,lng:78.1642,zoom:13},
    {name:"Roorkee",lat:29.8543,lng:77.8880,zoom:13},
    {name:"Laksar",lat:29.7543,lng:78.0368,zoom:13},
    {name:"Bhagwanpur",lat:29.9237,lng:77.9434,zoom:13},
    {name:"Narsan",lat:29.8901,lng:77.7234,zoom:13},
    {name:"Manglaur",lat:29.7891,lng:77.8734,zoom:13},
  ],
  "Nainital": [
    {name:"Nainital",lat:29.3919,lng:79.4542,zoom:13},
    {name:"Haldwani",lat:29.2183,lng:79.5130,zoom:13},
    {name:"Ramnagar",lat:29.3942,lng:79.1276,zoom:13},
    {name:"Kaladhungi",lat:29.2688,lng:79.2804,zoom:13},
    {name:"Dhari",lat:29.4534,lng:79.5801,zoom:13},
    {name:"Betalghat",lat:29.5123,lng:79.6234,zoom:13},
    {name:"Okhalkanda",lat:29.5678,lng:79.5123,zoom:13},
    {name:"Ramgarh",lat:29.4123,lng:79.3978,zoom:13},
    {name:"Kotabagh",lat:29.3234,lng:79.0512,zoom:13},
  ],
  "Pauri Garhwal": [
    {name:"Pauri",lat:30.1523,lng:78.7834,zoom:13},
    {name:"Kotdwar",lat:29.7490,lng:78.5234,zoom:13},
    {name:"Srinagar Garhwal",lat:30.2189,lng:78.7840,zoom:13},
    {name:"Lansdowne",lat:29.8376,lng:78.6845,zoom:13},
    {name:"Satpuli",lat:29.9834,lng:78.8512,zoom:13},
    {name:"Dhumakot",lat:29.9234,lng:78.8012,zoom:13},
    {name:"Yamkeshwar",lat:30.0523,lng:78.6712,zoom:13},
    {name:"Dugadda",lat:29.8734,lng:78.5934,zoom:13},
    {name:"Ekeshwar",lat:30.1234,lng:78.5678,zoom:13},
    {name:"Pabo",lat:30.2345,lng:78.9012,zoom:13},
    {name:"Khirsu",lat:30.1567,lng:78.7234,zoom:13},
  ],
  "Pithoragarh": [
    {name:"Pithoragarh",lat:29.5831,lng:80.2128,zoom:13},
    {name:"Munsiari",lat:30.0671,lng:80.2345,zoom:13},
    {name:"Dharchula",lat:29.8512,lng:80.5323,zoom:13},
    {name:"Didihat",lat:29.7812,lng:80.2534,zoom:13},
    {name:"Gangolihat",lat:29.7523,lng:80.0123,zoom:13},
    {name:"Berinag",lat:29.8234,lng:80.1023,zoom:13},
    {name:"Kanalichhina",lat:29.6512,lng:80.0734,zoom:13},
    {name:"Baram",lat:29.5234,lng:80.3456,zoom:13},
  ],
  "Rudraprayag": [
    {name:"Rudraprayag",lat:30.2841,lng:78.9812,zoom:13},
    {name:"Agastyamuni",lat:30.3045,lng:79.0534,zoom:13},
    {name:"Ukhimath",lat:30.4523,lng:79.1012,zoom:13},
    {name:"Jakholi",lat:30.2234,lng:78.8512,zoom:13},
    {name:"Augustmuni",lat:30.3101,lng:79.0701,zoom:13},
  ],
  "Tehri Garhwal": [
    {name:"Tehri",lat:30.3863,lng:78.4801,zoom:13},
    {name:"Narendra Nagar",lat:30.1620,lng:78.3012,zoom:13},
    {name:"Devprayag",lat:30.1460,lng:78.5982,zoom:13},
    {name:"Dhanaulti",lat:30.4266,lng:78.2375,zoom:13},
    {name:"New Tehri",lat:30.3756,lng:78.4312,zoom:13},
    {name:"Ghansali",lat:30.4534,lng:78.6523,zoom:13},
    {name:"Chamba",lat:30.3567,lng:78.2234,zoom:13},
    {name:"Jakhanidhar",lat:30.2034,lng:78.2734,zoom:13},
    {name:"Pratapnagar",lat:30.3234,lng:78.3423,zoom:13},
    {name:"Kirtinagar",lat:30.2145,lng:78.5634,zoom:13},
  ],
  "Udham Singh Nagar": [
    {name:"Rudrapur",lat:28.9790,lng:79.4006,zoom:13},
    {name:"Kashipur",lat:29.2123,lng:78.9613,zoom:13},
    {name:"Jaspur",lat:29.2867,lng:79.1323,zoom:13},
    {name:"Bazpur",lat:29.1534,lng:79.1901,zoom:13},
    {name:"Sitarganj",lat:28.9234,lng:79.7012,zoom:13},
    {name:"Kichha",lat:28.9123,lng:79.4734,zoom:13},
    {name:"Gadarpur",lat:28.9678,lng:79.4512,zoom:13},
    {name:"Nanak Matta",lat:29.0512,lng:79.6834,zoom:13},
    {name:"Khatima",lat:28.9201,lng:79.9712,zoom:13},
  ],
  "Uttarkashi": [
    {name:"Uttarkashi",lat:30.7266,lng:78.4543,zoom:13},
    {name:"Bhatwari",lat:30.8934,lng:78.5712,zoom:13},
    {name:"Purola",lat:30.8512,lng:77.8734,zoom:13},
    {name:"Mori",lat:30.9234,lng:77.7812,zoom:13},
    {name:"Dunda",lat:30.7734,lng:78.3534,zoom:13},
    {name:"Chinyalisaur",lat:30.6534,lng:78.4023,zoom:13},
    {name:"Naugaon",lat:30.9512,lng:78.0234,zoom:13},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// REAL UTTARAKHAND BLOCKS (Development Blocks) per Tehsil
// ═══════════════════════════════════════════════════════════════════════════════
const UK_BLOCKS = {
  // DEHRADUN
  "Dehradun": [
    {name:"Sahaspur",lat:30.2897,lng:78.1312,zoom:14},
    {name:"Raipur",lat:30.3432,lng:78.0645,zoom:14},
    {name:"Chakrata",lat:30.7019,lng:77.8684,zoom:14},
    {name:"Kalsi",lat:30.5340,lng:77.8490,zoom:14},
    {name:"Vikasnagar",lat:30.4526,lng:77.7618,zoom:14},
  ],
  "Rishikesh": [
    {name:"Rishikesh",lat:30.0869,lng:78.2676,zoom:14},
    {name:"Doiwala",lat:30.1730,lng:78.1230,zoom:14},
    {name:"Bhaniawala",lat:30.0512,lng:78.2001,zoom:14},
  ],
  "Vikasnagar": [
    {name:"Vikasnagar",lat:30.4526,lng:77.7618,zoom:14},
    {name:"Herbertpur",lat:30.4228,lng:77.8432,zoom:14},
    {name:"Selaqui",lat:30.3767,lng:77.8901,zoom:14},
  ],
  "Chakrata": [
    {name:"Chakrata",lat:30.7019,lng:77.8684,zoom:14},
    {name:"Tyuni",lat:30.5898,lng:77.7423,zoom:14},
    {name:"Lakhamandal",lat:30.6812,lng:78.0512,zoom:14},
  ],
  "Doiwala": [
    {name:"Doiwala",lat:30.1730,lng:78.1230,zoom:14},
    {name:"Raiwala",lat:30.0232,lng:78.2342,zoom:14},
    {name:"Mohand",lat:30.0512,lng:77.9834,zoom:14},
  ],
  // HARIDWAR
  "Haridwar": [
    {name:"Haridwar",lat:29.9457,lng:78.1642,zoom:14},
    {name:"Bahadrabad",lat:29.9634,lng:78.0734,zoom:14},
    {name:"Kankhal",lat:29.9112,lng:78.1523,zoom:14},
  ],
  "Roorkee": [
    {name:"Roorkee",lat:29.8543,lng:77.8880,zoom:14},
    {name:"Manglaur",lat:29.7891,lng:77.8734,zoom:14},
    {name:"Pathri",lat:29.7423,lng:77.9312,zoom:14},
  ],
  "Laksar": [
    {name:"Laksar",lat:29.7543,lng:78.0368,zoom:14},
    {name:"Libarhedi",lat:29.7123,lng:78.0012,zoom:14},
    {name:"Niranjanpur",lat:29.8123,lng:78.0823,zoom:14},
  ],
  "Bhagwanpur": [
    {name:"Bhagwanpur",lat:29.9237,lng:77.9434,zoom:14},
    {name:"Narsan",lat:29.8901,lng:77.7234,zoom:14},
    {name:"Jhabrera",lat:29.8512,lng:77.8512,zoom:14},
  ],
  // NAINITAL
  "Nainital": [
    {name:"Nainital",lat:29.3919,lng:79.4542,zoom:14},
    {name:"Bhimtal",lat:29.3523,lng:79.5612,zoom:14},
    {name:"Ramgarh",lat:29.4123,lng:79.3978,zoom:14},
  ],
  "Haldwani": [
    {name:"Haldwani",lat:29.2183,lng:79.5130,zoom:14},
    {name:"Kathgodam",lat:29.2567,lng:79.5312,zoom:14},
    {name:"Lalkuan",lat:29.1834,lng:79.4923,zoom:14},
    {name:"Gaujajali",lat:29.2045,lng:79.5723,zoom:14},
  ],
  "Ramnagar": [
    {name:"Ramnagar",lat:29.3942,lng:79.1276,zoom:14},
    {name:"Marchula",lat:29.5023,lng:79.0634,zoom:14},
    {name:"Mohan",lat:29.4534,lng:79.0234,zoom:14},
  ],
  "Kaladhungi": [
    {name:"Kaladhungi",lat:29.2688,lng:79.2804,zoom:14},
    {name:"Sattal",lat:29.3312,lng:79.4923,zoom:14},
    {name:"Naukuchiatal",lat:29.3701,lng:79.5234,zoom:14},
  ],
  // TEHRI GARHWAL
  "Tehri": [
    {name:"Tehri",lat:30.3863,lng:78.4801,zoom:14},
    {name:"New Tehri",lat:30.3756,lng:78.4312,zoom:14},
    {name:"Bhilangna",lat:30.4023,lng:78.5312,zoom:14},
    {name:"Maletha",lat:30.3234,lng:78.5023,zoom:14},
  ],
  "Devprayag": [
    {name:"Devprayag",lat:30.1460,lng:78.5982,zoom:14},
    {name:"Kirtinagar",lat:30.2145,lng:78.5634,zoom:14},
    {name:"Deoprayag",lat:30.1434,lng:78.5901,zoom:14},
  ],
  "Narendra Nagar": [
    {name:"Narendra Nagar",lat:30.1620,lng:78.3012,zoom:14},
    {name:"Agrakhal",lat:30.0923,lng:78.3512,zoom:14},
    {name:"Hindolakhal",lat:30.1312,lng:78.2412,zoom:14},
  ],
  "Chamba": [
    {name:"Chamba",lat:30.3567,lng:78.2234,zoom:14},
    {name:"Dhanaulti",lat:30.4266,lng:78.2375,zoom:14},
    {name:"Surkanda",lat:30.4012,lng:78.2123,zoom:14},
  ],
  // PAURI GARHWAL
  "Pauri": [
    {name:"Pauri",lat:30.1523,lng:78.7834,zoom:14},
    {name:"Pabau",lat:30.0712,lng:78.9023,zoom:14},
    {name:"Rikhnikhal",lat:30.1234,lng:78.9534,zoom:14},
  ],
  "Kotdwar": [
    {name:"Kotdwar",lat:29.7490,lng:78.5234,zoom:14},
    {name:"Dugadda",lat:29.8734,lng:78.5934,zoom:14},
    {name:"Nayar",lat:29.9012,lng:78.6234,zoom:14},
  ],
  "Srinagar Garhwal": [
    {name:"Srinagar",lat:30.2189,lng:78.7840,zoom:14},
    {name:"Khirsu",lat:30.1567,lng:78.7234,zoom:14},
    {name:"Satpuli",lat:29.9834,lng:78.8512,zoom:14},
  ],
  "Lansdowne": [
    {name:"Lansdowne",lat:29.8376,lng:78.6845,zoom:14},
    {name:"Dhumakot",lat:29.9234,lng:78.8012,zoom:14},
    {name:"Phansali",lat:29.8012,lng:78.7512,zoom:14},
  ],
  // UTTARKASHI
  "Uttarkashi": [
    {name:"Uttarkashi",lat:30.7266,lng:78.4543,zoom:14},
    {name:"Chinyalisaur",lat:30.6534,lng:78.4023,zoom:14},
    {name:"Dunda",lat:30.7734,lng:78.3534,zoom:14},
    {name:"Bhatwari",lat:30.8934,lng:78.5712,zoom:14},
  ],
  "Purola": [
    {name:"Purola",lat:30.8512,lng:77.8734,zoom:14},
    {name:"Naugaon",lat:30.9512,lng:78.0234,zoom:14},
    {name:"Mori",lat:30.9234,lng:77.7812,zoom:14},
  ],
  "Bhatwari": [
    {name:"Bhatwari",lat:30.8934,lng:78.5712,zoom:14},
    {name:"Gangotri",lat:30.9946,lng:78.9387,zoom:14},
    {name:"Harsil",lat:30.9234,lng:78.7823,zoom:14},
  ],
  // ALMORA
  "Almora": [
    {name:"Almora",lat:29.5971,lng:79.6533,zoom:14},
    {name:"Tarikhet",lat:29.6512,lng:79.5423,zoom:14},
    {name:"Hawalbagh",lat:29.5534,lng:79.6234,zoom:14},
    {name:"Lamgara",lat:29.5234,lng:79.5812,zoom:14},
  ],
  "Ranikhet": [
    {name:"Ranikhet",lat:29.6407,lng:79.4317,zoom:14},
    {name:"Dwarahat",lat:29.7187,lng:79.4095,zoom:14},
    {name:"Bhikiyasain",lat:29.7233,lng:79.4285,zoom:14},
    {name:"Chaukhutia",lat:29.8768,lng:79.3543,zoom:14},
  ],
  // BAGESHWAR
  "Bageshwar": [
    {name:"Bageshwar",lat:29.8376,lng:79.7712,zoom:14},
    {name:"Garud",lat:29.7854,lng:79.6234,zoom:14},
    {name:"Baijnath",lat:29.9234,lng:79.6234,zoom:14},
    {name:"Saryu",lat:29.8123,lng:79.8234,zoom:14},
  ],
  "Kapkot": [
    {name:"Kapkot",lat:29.9812,lng:80.0341,zoom:14},
    {name:"Kanda",lat:29.9123,lng:79.8765,zoom:14},
    {name:"Kafligair",lat:30.0512,lng:79.9234,zoom:14},
  ],
  // CHAMOLI
  "Joshimath": [
    {name:"Joshimath",lat:30.5581,lng:79.5641,zoom:14},
    {name:"Auli",lat:30.5312,lng:79.5723,zoom:14},
    {name:"Helang",lat:30.4823,lng:79.5234,zoom:14},
    {name:"Tapovan",lat:30.4912,lng:79.6012,zoom:14},
  ],
  "Karnaprayag": [
    {name:"Karnaprayag",lat:30.2641,lng:79.2485,zoom:14},
    {name:"Gairsain",lat:30.0812,lng:79.2834,zoom:14},
    {name:"Tharali",lat:30.2021,lng:79.1567,zoom:14},
  ],
  "Gopeshwar": [
    {name:"Gopeshwar",lat:30.4058,lng:79.3165,zoom:14},
    {name:"Ghat",lat:30.3512,lng:79.3834,zoom:14},
    {name:"Narayanbagar",lat:30.0623,lng:79.0912,zoom:14},
  ],
  // RUDRAPRAYAG
  "Rudraprayag": [
    {name:"Rudraprayag",lat:30.2841,lng:78.9812,zoom:14},
    {name:"Agastyamuni",lat:30.3045,lng:79.0534,zoom:14},
    {name:"Jakholi",lat:30.2234,lng:78.8512,zoom:14},
  ],
  "Ukhimath": [
    {name:"Ukhimath",lat:30.4523,lng:79.1012,zoom:14},
    {name:"Phata",lat:30.4234,lng:79.0823,zoom:14},
    {name:"Sonprayag",lat:30.5934,lng:79.0512,zoom:14},
  ],
  // PITHORAGARH
  "Pithoragarh": [
    {name:"Pithoragarh",lat:29.5831,lng:80.2128,zoom:14},
    {name:"Gangolihat",lat:29.7523,lng:80.0123,zoom:14},
    {name:"Berinag",lat:29.8234,lng:80.1023,zoom:14},
    {name:"Kanalichhina",lat:29.6512,lng:80.0734,zoom:14},
  ],
  "Munsiari": [
    {name:"Munsiari",lat:30.0671,lng:80.2345,zoom:14},
    {name:"Madkot",lat:30.1023,lng:80.3012,zoom:14},
    {name:"Thal",lat:29.9734,lng:80.3523,zoom:14},
    {name:"Birthi",lat:30.0312,lng:80.2734,zoom:14},
  ],
  "Dharchula": [
    {name:"Dharchula",lat:29.8512,lng:80.5323,zoom:14},
    {name:"Didihat",lat:29.7812,lng:80.2534,zoom:14},
    {name:"Baram",lat:29.5234,lng:80.3456,zoom:14},
  ],
  // CHAMPAWAT
  "Champawat": [
    {name:"Champawat",lat:29.3329,lng:80.0919,zoom:14},
    {name:"Lohaghat",lat:29.4123,lng:80.0651,zoom:14},
    {name:"Pati",lat:29.2156,lng:80.1823,zoom:14},
    {name:"Barakot",lat:29.5023,lng:79.9734,zoom:14},
  ],
  // UDHAM SINGH NAGAR
  "Rudrapur": [
    {name:"Rudrapur",lat:28.9790,lng:79.4006,zoom:14},
    {name:"Gadarpur",lat:28.9678,lng:79.4512,zoom:14},
    {name:"Kichha",lat:28.9123,lng:79.4734,zoom:14},
    {name:"Pantnagar",lat:29.0101,lng:79.4534,zoom:14},
  ],
  "Kashipur": [
    {name:"Kashipur",lat:29.2123,lng:78.9613,zoom:14},
    {name:"Jaspur",lat:29.2867,lng:79.1323,zoom:14},
    {name:"Bazpur",lat:29.1534,lng:79.1901,zoom:14},
  ],
  "Sitarganj": [
    {name:"Sitarganj",lat:28.9234,lng:79.7012,zoom:14},
    {name:"Nanak Matta",lat:29.0512,lng:79.6834,zoom:14},
    {name:"Khatima",lat:28.9201,lng:79.9712,zoom:14},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// REAL UTTARAKHAND VILLAGES per Block
// ═══════════════════════════════════════════════════════════════════════════════
const UK_VILLAGES = {
  // DEHRADUN
  "Sahaspur":   [{name:"Sahaspur",type:"Village",lat:30.2897,lng:78.1312,zoom:16},{name:"Majri Grant",type:"Village",lat:30.2654,lng:78.1589,zoom:16},{name:"Badripur",type:"Village",lat:30.3012,lng:78.1456,zoom:16},{name:"Dhorankhas",type:"Village",lat:30.2723,lng:78.1234,zoom:16},{name:"Bantawala",type:"Village",lat:30.2534,lng:78.0923,zoom:16}],
  "Raipur":     [{name:"Raipur Kalan",type:"Village",lat:30.3432,lng:78.0645,zoom:16},{name:"Ajabpur Kalan",type:"Village",lat:30.3345,lng:78.0523,zoom:16},{name:"Jhajhra",type:"Village",lat:30.3678,lng:78.0823,zoom:16},{name:"Sewla Kalan",type:"Village",lat:30.3212,lng:78.0234,zoom:16},{name:"Nathanpur",type:"Village",lat:30.3890,lng:78.0901,zoom:16}],
  "Rishikesh":  [{name:"Jonk",type:"Village",lat:30.0622,lng:78.2987,zoom:16},{name:"Rishikesh Town",type:"Town",lat:30.0869,lng:78.2676,zoom:16},{name:"Raiwala",type:"Village",lat:30.0232,lng:78.2342,zoom:16},{name:"Doonga",type:"Village",lat:30.0441,lng:78.2819,zoom:16},{name:"Lachiwala",type:"Village",lat:30.0234,lng:78.2101,zoom:16}],
  "Doiwala":    [{name:"Doiwala",type:"Town",lat:30.1730,lng:78.1230,zoom:16},{name:"Bijapur Grant",type:"Village",lat:30.1023,lng:78.0812,zoom:16},{name:"Bhaniawala",type:"Village",lat:30.1234,lng:78.1734,zoom:16},{name:"Harrawala",type:"Village",lat:30.1456,lng:78.1512,zoom:16},{name:"Manduwala",type:"Village",lat:30.1623,lng:78.0734,zoom:16}],
  "Vikasnagar": [{name:"Vikasnagar",type:"Town",lat:30.4526,lng:77.7618,zoom:16},{name:"Herbertpur",type:"Town",lat:30.4228,lng:77.8432,zoom:16},{name:"Selaqui",type:"Area",lat:30.3767,lng:77.8901,zoom:16},{name:"Kharsi",type:"Village",lat:30.4923,lng:77.9234,zoom:16},{name:"Nagal",type:"Village",lat:30.3923,lng:77.8023,zoom:16}],
  "Chakrata":   [{name:"Chakrata",type:"Town",lat:30.7019,lng:77.8684,zoom:16},{name:"Koti",type:"Village",lat:30.6734,lng:77.8234,zoom:16},{name:"Deoban",type:"Village",lat:30.6512,lng:77.7901,zoom:16},{name:"Mundikholi",type:"Village",lat:30.6823,lng:77.9012,zoom:16},{name:"Dasholi",type:"Village",lat:30.7234,lng:77.9234,zoom:16}],
  // HARIDWAR
  "Haridwar":   [{name:"Haridwar Town",type:"Town",lat:29.9457,lng:78.1642,zoom:16},{name:"Har Ki Pauri",type:"Area",lat:29.9584,lng:78.1640,zoom:16},{name:"Kankhal",type:"Area",lat:29.9112,lng:78.1523,zoom:16},{name:"Mayapur",type:"Area",lat:29.9678,lng:78.1834,zoom:16},{name:"Jwalapur",type:"Town",lat:29.9023,lng:78.1345,zoom:16}],
  "Roorkee":    [{name:"Roorkee",type:"Town",lat:29.8543,lng:77.8880,zoom:16},{name:"Pathri",type:"Village",lat:29.7423,lng:77.9312,zoom:16},{name:"Landhaura",type:"Village",lat:29.8234,lng:77.9823,zoom:16},{name:"Manglaur",type:"Town",lat:29.7891,lng:77.8734,zoom:16},{name:"Sherpur",type:"Village",lat:29.8012,lng:77.8512,zoom:16}],
  "Laksar":     [{name:"Laksar",type:"Town",lat:29.7543,lng:78.0368,zoom:16},{name:"Libarhedi",type:"Village",lat:29.7123,lng:78.0012,zoom:16},{name:"Niranjanpur",type:"Village",lat:29.8123,lng:78.0823,zoom:16},{name:"Bahadrabad",type:"Village",lat:29.9634,lng:78.0734,zoom:16},{name:"Raipurwa",type:"Village",lat:29.7823,lng:78.0512,zoom:16}],
  // NAINITAL
  "Nainital":   [{name:"Mallital",type:"Area",lat:29.3967,lng:79.4601,zoom:16},{name:"Tallital",type:"Area",lat:29.3873,lng:79.4483,zoom:16},{name:"Ayarpatta",type:"Area",lat:29.3856,lng:79.4612,zoom:16},{name:"Sukhatal",type:"Village",lat:29.4023,lng:79.4712,zoom:16},{name:"Balia",type:"Village",lat:29.3534,lng:79.4234,zoom:16}],
  "Haldwani":   [{name:"Haldwani",type:"Town",lat:29.2183,lng:79.5130,zoom:16},{name:"Kathgodam",type:"Town",lat:29.2567,lng:79.5312,zoom:16},{name:"Lalkuan",type:"Town",lat:29.1834,lng:79.4923,zoom:16},{name:"Banbhoolpura",type:"Area",lat:29.2312,lng:79.5401,zoom:16},{name:"Bhotia Parao",type:"Village",lat:29.2423,lng:79.5623,zoom:16}],
  "Ramnagar":   [{name:"Ramnagar",type:"Town",lat:29.3942,lng:79.1276,zoom:16},{name:"Marchula",type:"Village",lat:29.5023,lng:79.0634,zoom:16},{name:"Mohan",type:"Village",lat:29.4534,lng:79.0234,zoom:16},{name:"Dhikala",type:"Area",lat:29.4234,lng:79.0012,zoom:16},{name:"Phulwar",type:"Village",lat:29.3234,lng:79.0823,zoom:16}],
  // TEHRI
  "Tehri":      [{name:"New Tehri Town",type:"Town",lat:30.3756,lng:78.4312,zoom:16},{name:"Old Tehri",type:"Area",lat:30.3901,lng:78.4834,zoom:16},{name:"Bhilangna",type:"Village",lat:30.4023,lng:78.5312,zoom:16},{name:"Pratapnagar",type:"Village",lat:30.3234,lng:78.3423,zoom:16},{name:"Maletha",type:"Village",lat:30.3234,lng:78.5023,zoom:16}],
  "Devprayag":  [{name:"Devprayag Town",type:"Town",lat:30.1460,lng:78.5982,zoom:16},{name:"Kirtinagar",type:"Town",lat:30.2145,lng:78.5634,zoom:16},{name:"Srinagar Colony",type:"Area",lat:30.2012,lng:78.5912,zoom:16},{name:"Agrakhal",type:"Village",lat:30.0923,lng:78.3512,zoom:16},{name:"Chamba",type:"Town",lat:30.3567,lng:78.2234,zoom:16}],
  // UTTARKASHI
  "Uttarkashi": [{name:"Uttarkashi Town",type:"Town",lat:30.7266,lng:78.4543,zoom:16},{name:"Maneri",type:"Village",lat:30.8012,lng:78.5234,zoom:16},{name:"Gangotri Road",type:"Area",lat:30.7512,lng:78.4901,zoom:16},{name:"Bhatwari",type:"Village",lat:30.8934,lng:78.5712,zoom:16},{name:"Matli",type:"Village",lat:30.6901,lng:78.4101,zoom:16}],
  "Bhatwari":   [{name:"Gangotri",type:"Town",lat:30.9946,lng:78.9387,zoom:16},{name:"Harsil",type:"Village",lat:30.9234,lng:78.7823,zoom:16},{name:"Lanka",type:"Village",lat:30.8401,lng:78.6523,zoom:16},{name:"Sukhi Top",type:"Area",lat:30.8734,lng:78.7123,zoom:16},{name:"Dharali",type:"Village",lat:30.9523,lng:78.6234,zoom:16}],
  "Purola":     [{name:"Purola",type:"Town",lat:30.8512,lng:77.8734,zoom:16},{name:"Naugaon",type:"Town",lat:30.9512,lng:78.0234,zoom:16},{name:"Mori",type:"Village",lat:30.9234,lng:77.7812,zoom:16},{name:"Nowgaon",type:"Village",lat:30.8734,lng:78.1234,zoom:16},{name:"Barkot",type:"Village",lat:30.8123,lng:78.2012,zoom:16}],
  // ALMORA
  "Almora":     [{name:"Almora Town",type:"Town",lat:29.5971,lng:79.6533,zoom:16},{name:"Hawalbagh",type:"Village",lat:29.5534,lng:79.6234,zoom:16},{name:"Tarikhet",type:"Village",lat:29.6512,lng:79.5423,zoom:16},{name:"Lamgara",type:"Village",lat:29.5234,lng:79.5812,zoom:16},{name:"Badsahi Thaul",type:"Village",lat:29.6123,lng:79.6801,zoom:16}],
  "Ranikhet":   [{name:"Ranikhet Town",type:"Town",lat:29.6407,lng:79.4317,zoom:16},{name:"Dwarahat",type:"Town",lat:29.7187,lng:79.4095,zoom:16},{name:"Chaukhutia",type:"Town",lat:29.8768,lng:79.3543,zoom:16},{name:"Bhikiyasain",type:"Village",lat:29.7233,lng:79.4285,zoom:16},{name:"Dungari",type:"Village",lat:29.6234,lng:79.3901,zoom:16}],
  // BAGESHWAR
  "Bageshwar":  [{name:"Bageshwar Town",type:"Town",lat:29.8376,lng:79.7712,zoom:16},{name:"Baijnath",type:"Town",lat:29.9234,lng:79.6234,zoom:16},{name:"Garud",type:"Village",lat:29.7854,lng:79.6234,zoom:16},{name:"Bharari",type:"Village",lat:29.8023,lng:79.8012,zoom:16},{name:"Baurari",type:"Village",lat:29.8512,lng:79.7401,zoom:16}],
  "Kapkot":     [{name:"Kapkot",type:"Town",lat:29.9812,lng:80.0341,zoom:16},{name:"Kanda",type:"Town",lat:29.9123,lng:79.8765,zoom:16},{name:"Kafligair",type:"Village",lat:30.0512,lng:79.9234,zoom:16},{name:"Shama",type:"Village",lat:29.8934,lng:80.0734,zoom:16},{name:"Simalkhet",type:"Village",lat:29.9401,lng:80.1023,zoom:16}],
  // CHAMOLI
  "Joshimath":  [{name:"Joshimath Town",type:"Town",lat:30.5581,lng:79.5641,zoom:16},{name:"Auli",type:"Area",lat:30.5312,lng:79.5723,zoom:16},{name:"Vishnuprayag",type:"Area",lat:30.5234,lng:79.5901,zoom:16},{name:"Pandukeshwar",type:"Village",lat:30.5134,lng:79.5512,zoom:16},{name:"Helang",type:"Village",lat:30.4823,lng:79.5234,zoom:16}],
  "Karnaprayag":[{name:"Karnaprayag Town",type:"Town",lat:30.2641,lng:79.2485,zoom:16},{name:"Gairsain",type:"Town",lat:30.0812,lng:79.2834,zoom:16},{name:"Tharali",type:"Town",lat:30.2021,lng:79.1567,zoom:16},{name:"Nauti",type:"Village",lat:30.1234,lng:79.2012,zoom:16},{name:"Simli",type:"Village",lat:30.2401,lng:79.3012,zoom:16}],
  "Gopeshwar":  [{name:"Gopeshwar Town",type:"Town",lat:30.4058,lng:79.3165,zoom:16},{name:"Chamoli",type:"Town",lat:30.4023,lng:79.3278,zoom:16},{name:"Ghat",type:"Village",lat:30.3512,lng:79.3834,zoom:16},{name:"Narayanbagar",type:"Village",lat:30.0623,lng:79.0912,zoom:16},{name:"Urgam",type:"Village",lat:30.4512,lng:79.4234,zoom:16}],
  // RUDRAPRAYAG
  "Rudraprayag":[{name:"Rudraprayag Town",type:"Town",lat:30.2841,lng:78.9812,zoom:16},{name:"Agastyamuni",type:"Town",lat:30.3045,lng:79.0534,zoom:16},{name:"Jakholi",type:"Village",lat:30.2234,lng:78.8512,zoom:16},{name:"Tilwara",type:"Village",lat:30.2512,lng:79.0012,zoom:16},{name:"Khankra",type:"Village",lat:30.3234,lng:79.1012,zoom:16}],
  "Ukhimath":   [{name:"Ukhimath",type:"Town",lat:30.4523,lng:79.1012,zoom:16},{name:"Sonprayag",type:"Village",lat:30.5934,lng:79.0512,zoom:16},{name:"Triyuginarayan",type:"Village",lat:30.6312,lng:79.0123,zoom:16},{name:"Gaurikund",type:"Village",lat:30.6523,lng:79.0234,zoom:16},{name:"Kedarnath",type:"Area",lat:30.7352,lng:79.0669,zoom:16}],
  // PITHORAGARH
  "Pithoragarh":[{name:"Pithoragarh Town",type:"Town",lat:29.5831,lng:80.2128,zoom:16},{name:"Gangolihat",type:"Town",lat:29.7523,lng:80.0123,zoom:16},{name:"Berinag",type:"Town",lat:29.8234,lng:80.1023,zoom:16},{name:"Champawat Chak",type:"Village",lat:29.5623,lng:80.2345,zoom:16},{name:"Sobla",type:"Village",lat:29.6234,lng:80.1823,zoom:16}],
  "Munsiari":   [{name:"Munsiari Town",type:"Town",lat:30.0671,lng:80.2345,zoom:16},{name:"Madkot",type:"Village",lat:30.1023,lng:80.3012,zoom:16},{name:"Thal",type:"Village",lat:29.9734,lng:80.3523,zoom:16},{name:"Birthi",type:"Village",lat:30.0312,lng:80.2734,zoom:16},{name:"Darkot",type:"Village",lat:30.0901,lng:80.2012,zoom:16}],
  "Dharchula":  [{name:"Dharchula Town",type:"Town",lat:29.8512,lng:80.5323,zoom:16},{name:"Didihat",type:"Town",lat:29.7812,lng:80.2534,zoom:16},{name:"Baram",type:"Village",lat:29.5234,lng:80.3456,zoom:16},{name:"Narayanghat",type:"Village",lat:29.6834,lng:80.4123,zoom:16},{name:"Sobla",type:"Village",lat:29.6512,lng:80.3234,zoom:16}],
  // CHAMPAWAT
  "Champawat":  [{name:"Champawat Town",type:"Town",lat:29.3329,lng:80.0919,zoom:16},{name:"Lohaghat",type:"Town",lat:29.4123,lng:80.0651,zoom:16},{name:"Pati",type:"Village",lat:29.2156,lng:80.1823,zoom:16},{name:"Barakot",type:"Village",lat:29.5023,lng:79.9734,zoom:16},{name:"Purnagiri",type:"Village",lat:29.2534,lng:80.0342,zoom:16}],
  // UDHAM SINGH NAGAR
  "Rudrapur":   [{name:"Rudrapur",type:"Town",lat:28.9790,lng:79.4006,zoom:16},{name:"Pantnagar",type:"Town",lat:29.0101,lng:79.4534,zoom:16},{name:"Gadarpur",type:"Town",lat:28.9678,lng:79.4512,zoom:16},{name:"Sitarganj",type:"Town",lat:28.9234,lng:79.7012,zoom:16},{name:"Kichha",type:"Town",lat:28.9123,lng:79.4734,zoom:16}],
  "Kashipur":   [{name:"Kashipur",type:"Town",lat:29.2123,lng:78.9613,zoom:16},{name:"Jaspur",type:"Town",lat:29.2867,lng:79.1323,zoom:16},{name:"Bazpur",type:"Town",lat:29.1534,lng:79.1901,zoom:16},{name:"Bilaspur",type:"Village",lat:29.1234,lng:79.0234,zoom:16},{name:"Mahuakheda",type:"Village",lat:29.2512,lng:79.0512,zoom:16}],
  "Sitarganj":  [{name:"Sitarganj",type:"Town",lat:28.9234,lng:79.7012,zoom:16},{name:"Nanak Matta",type:"Town",lat:29.0512,lng:79.6834,zoom:16},{name:"Khatima",type:"Town",lat:28.9201,lng:79.9712,zoom:16},{name:"Siddhanwala",type:"Village",lat:28.9534,lng:79.8012,zoom:16},{name:"Sukhi",type:"Village",lat:29.0123,lng:79.7512,zoom:16}],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SMART FALLBACK GENERATORS (for non-UK states)
// ═══════════════════════════════════════════════════════════════════════════════
function getSubDivisionsForDistrict(stateName, district) {
  // For Uttarakhand, use real data
  if (stateName === "Uttarakhand" && UK_SUBDIVISIONS[district.name]) {
    return UK_SUBDIVISIONS[district.name];
  }
  const lat = district.lat, lng = district.lng;
  const z = (district.zoom || 10) + 1;
  const offs = [[0.12,0],[-0.12,0],[0,0.15],[0,-0.15],[0.06,0.08],[-0.06,0.08]];
  return [`${district.name} Sadar`,`${district.name} Urban`,`${district.name} Rural`,`${district.name} East`,`${district.name} West`,`${district.name} North`]
    .map((name,i) => ({name, lat: lat+(offs[i][0]||0), lng: lng+(offs[i][1]||0), zoom: z}));
}

function getBlocksForSubdiv(stateName, subdiv) {
  if (stateName === "Uttarakhand" && UK_BLOCKS[subdiv.name]) {
    return UK_BLOCKS[subdiv.name];
  }
  const lat = subdiv.lat, lng = subdiv.lng;
  const z = (subdiv.zoom || 11) + 1;
  const nm = subdiv.name.replace(/ Sadar| Urban| Rural| East| West| North| South/g,"").trim();
  return [`${nm} Block A`,`${nm} Block B`,`${nm} Block C`,`${nm} Block D`]
    .map((name,i) => ({name, lat: lat+([0.05,-0.05,0,0.04][i]||0), lng: lng+([0,0,0.06,-0.04][i]||0), zoom: z}));
}

function getVillagesForBlock(stateName, block) {
  if (stateName === "Uttarakhand" && UK_VILLAGES[block.name]) {
    return UK_VILLAGES[block.name];
  }
  const lat = block.lat, lng = block.lng;
  const z = (block.zoom || 12) + 2;
  const nm = block.name.replace(/ Block [A-D]/,"").trim();
  return [
    {name:`${nm} Gram`,type:"Village"},{name:`${nm} Khurd`,type:"Village"},
    {name:`${nm} Kalan`,type:"Village"},{name:`${nm} Nagar`,type:"Town"},
    {name:`New ${nm}`,type:"Area"}
  ].map((v,i) => ({...v, lat: lat+([0.02,-0.02,0.01,-0.01,0.03][i]||0), lng: lng+([0.02,0.02,-0.02,-0.02,0][i]||0), zoom: z}));
}

// ─── WATER RESOURCES ──────────────────────────────────────────────────────────
const WATER_RESOURCES_INIT = [
  {id:1,name:"Yamuna River — Palla Intake",type:"River",state:"Delhi",district:"North Delhi",lat:28.7562,lng:77.1897,quality:"Moderate",level:68,ph:7.2,tds:320,do:6.1,turbidity:18,lastUpdated:"2 hrs ago",status:"active",purpose:"Drinking",flow:"1240 cusecs",area:"NA",tourists:false,note:"Primary Delhi drinking water source"},
  {id:2,name:"Bhakra Canal — Ludhiana",type:"Canal",state:"Punjab",district:"Ludhiana",lat:30.9010,lng:75.8573,quality:"Good",level:85,ph:7.4,tds:180,do:7.8,turbidity:5,lastUpdated:"45 min ago",status:"active",purpose:"Irrigation",flow:"860 cusecs",area:"1,42,000 ha",tourists:false,note:"Major Punjab irrigation canal"},
  {id:3,name:"Periyar River — Ernakulam",type:"River",state:"Kerala",district:"Ernakulam",lat:10.1004,lng:76.3570,quality:"Good",level:91,ph:6.9,tds:145,do:8.2,turbidity:4,lastUpdated:"30 min ago",status:"active",purpose:"Drinking+Irrigation",flow:"2100 cusecs",area:"NA",tourists:true,note:"Lifeline of Kochi metropolitan"},
  {id:4,name:"Chilika Lake — Bhusandpur",type:"Lake",state:"Odisha",district:"Puri",lat:19.7000,lng:85.3200,quality:"Poor",level:44,ph:8.1,tds:580,do:4.1,turbidity:42,lastUpdated:"3 hrs ago",status:"alert",purpose:"Fisheries+Tourism",flow:"NA",area:"1100 km²",tourists:true,note:"Largest coastal lagoon Asia — needs monitoring"},
  {id:5,name:"Krishna River — Vijayawada",type:"River",state:"Andhra Pradesh",district:"NTR",lat:16.5062,lng:80.6480,quality:"Moderate",level:61,ph:7.6,tds:290,do:6.4,turbidity:22,lastUpdated:"1.5 hrs ago",status:"active",purpose:"Multi-purpose",flow:"3400 cusecs",area:"NA",tourists:false,note:"Krishna delta head works"},
  {id:6,name:"Nagarjuna Sagar Dam",type:"Dam",state:"Telangana",district:"Nalgonda",lat:16.5750,lng:79.3190,quality:"Good",level:78,ph:7.3,tds:165,do:7.5,turbidity:6,lastUpdated:"20 min ago",status:"active",purpose:"Irrigation+Power",flow:"NA",area:"285 km²",tourists:true,note:"One of India's largest dams"},
  {id:7,name:"Banas River — Ajmer",type:"River",state:"Rajasthan",district:"Ajmer",lat:26.4499,lng:74.6399,quality:"Poor",level:29,ph:8.4,tds:890,do:3.2,turbidity:65,lastUpdated:"4 hrs ago",status:"critical",purpose:"Irrigation",flow:"120 cusecs",area:"NA",tourists:false,note:"CRITICAL: TDS exceeds BIS limits"},
  {id:8,name:"Dal Lake — Srinagar",type:"Lake",state:"Jammu & Kashmir",district:"Srinagar",lat:34.0837,lng:74.8804,quality:"Moderate",level:55,ph:7.8,tds:340,do:5.2,turbidity:28,lastUpdated:"1 hr ago",status:"alert",purpose:"Tourism+Drinking",flow:"NA",area:"18 km²",tourists:true,note:"Iconic lake facing encroachment threat"},
  {id:9,name:"Tehri Dam Reservoir",type:"Dam",state:"Uttarakhand",district:"Tehri Garhwal",lat:30.3781,lng:78.4805,quality:"Good",level:88,ph:7.0,tds:130,do:8.5,turbidity:3,lastUpdated:"1 hr ago",status:"active",purpose:"Power+Drinking+Irrigation",flow:"NA",area:"42 km²",tourists:true,note:"Highest dam in India — 260.5m"},
  {id:10,name:"Hussain Sagar Lake",type:"Lake",state:"Telangana",district:"Hyderabad",lat:17.4239,lng:78.4738,quality:"Poor",level:52,ph:8.6,tds:680,do:3.5,turbidity:55,lastUpdated:"2 hrs ago",status:"alert",purpose:"Tourism+Recreation",flow:"NA",area:"5.7 km²",tourists:true,note:"Urban lake — pollution monitoring needed"},
  {id:11,name:"Loktak Lake — Manipur",type:"Lake",state:"Manipur",district:"Bishnupur",lat:24.5200,lng:93.7800,quality:"Moderate",level:63,ph:7.1,tds:195,do:6.2,turbidity:18,lastUpdated:"4 hrs ago",status:"active",purpose:"Fisheries+Tourism",flow:"NA",area:"980 km²",tourists:true,note:"World's only floating national park — phumdis"},
  {id:12,name:"Bhojtal (Upper Lake) — Bhopal",type:"Lake",state:"Madhya Pradesh",district:"Bhopal",lat:23.2580,lng:77.3521,quality:"Moderate",level:71,ph:7.5,tds:265,do:5.9,turbidity:22,lastUpdated:"2 hrs ago",status:"active",purpose:"Drinking+Tourism",flow:"NA",area:"36 km²",tourists:true,note:"India's oldest man-made lake — 11th century"},
  {id:13,name:"Ganges — Rishikesh Ghats",type:"River",state:"Uttarakhand",district:"Dehradun",lat:30.0869,lng:78.2676,quality:"Good",level:80,ph:7.1,tds:155,do:8.3,turbidity:6,lastUpdated:"1 hr ago",status:"active",purpose:"Drinking+Tourism+Spiritual",flow:"5200 cusecs",area:"NA",tourists:true,note:"Sacred Ganga — Har Ki Pauri, Ram Jhula area"},
  {id:14,name:"Lonar Crater Lake",type:"Lake",state:"Maharashtra",district:"Nagpur",lat:19.9764,lng:76.5106,quality:"Poor",level:40,ph:9.8,tds:1200,do:2.8,turbidity:80,lastUpdated:"5 hrs ago",status:"critical",purpose:"Tourism",flow:"NA",area:"1.13 km²",tourists:true,note:"Unique saline alkaline lake — UNESCO candidate"},
];

// ─── INDIA LANGUAGES ──────────────────────────────────────────────────────────
const INDIA_LANGUAGES = [
  {code:"en",name:"English",native:"English"},{code:"hi",name:"Hindi",native:"हिन्दी"},
  {code:"bn",name:"Bengali",native:"বাংলা"},{code:"te",name:"Telugu",native:"తెలుగు"},
  {code:"mr",name:"Marathi",native:"मराठी"},{code:"ta",name:"Tamil",native:"தமிழ்"},
  {code:"gu",name:"Gujarati",native:"ગુજરાતી"},{code:"kn",name:"Kannada",native:"ಕನ್ನಡ"},
  {code:"ml",name:"Malayalam",native:"മലയാളം"},{code:"pa",name:"Punjabi",native:"ਪੰਜਾਬੀ"},
  {code:"ur",name:"Urdu",native:"اردو"},{code:"or",name:"Odia",native:"ଓଡ଼ିଆ"},
  {code:"as",name:"Assamese",native:"অসমীয়া"},{code:"ne",name:"Nepali",native:"नेपाली"},
];

// ─── REPORT TEMPLATES ─────────────────────────────────────────────────────────
const REPORT_TEMPLATES = [
  {id:"RPT-TPL-001",title:"Water Quality Degradation",icon:"⚠️",color:"#C0392B",colorBg:"#FDEDEC",fields:["Location","Source Name","pH level","TDS (mg/L)","DO (mg/L)","Turbidity (NTU)","Visible symptoms (color/smell/foam)","Possible cause","Urgency (Low/Medium/High/Critical)"],desc:"Report when water quality parameters exceed BIS IS:10500 limits or visible contamination is observed."},
  {id:"RPT-TPL-002",title:"New/Unknown Water Source",icon:"💧",color:"#2980B9",colorBg:"#EBF5FB",fields:["Source type (spring/pond/stream/johad)","GPS coordinates","Approximate area/flow","Local name","Community using it","Seasonal or perennial","Nearest village/block","Accessibility road","Current use"],desc:"Discovered an unmapped natural spring, seasonal stream, traditional johad, kund, or pond? Report it for JAL SROT UTTARAKHAND mapping."},
  {id:"RPT-TPL-003",title:"Low Water Level Alert",icon:"📉",color:"#D68910",colorBg:"#FEF9E7",fields:["Source name","Current level estimate (%)","Normal level for this season","Trend (falling/stable)","Days since decline began","Downstream impact","Agricultural impact","Drinking water affected"],desc:"Water level critically low in a reservoir, river, or lake. Report for drought assessment and relief planning."},
  {id:"RPT-TPL-004",title:"Encroachment / Damage",icon:"🚧",color:"#8E44AD",colorBg:"#F5EEF8",fields:["Source name & location","Type of encroachment","Approx. area encroached","Who/what is responsible","Photo evidence available","Local authority informed","Impact on water body"],desc:"Illegal construction, dumping, or encroachment threatening a water body or its catchment area."},
  {id:"RPT-TPL-005",title:"Drought Zone Assessment",icon:"☀️",color:"#B7950B",colorBg:"#FEF9E7",fields:["Block/Mandal name","District & State","Population affected","Available water sources","Days of water supply per week","Crops affected","Livestock affected","Nearest functional water point","Emergency supply needed"],desc:"Submit comprehensive drought assessment for government relief funding and intervention."},
  {id:"RPT-TPL-006",title:"Industrial Pollution",icon:"🏭",color:"#616A6B",colorBg:"#F2F3F4",fields:["Industry name","Discharge point GPS","Type of effluent","Affected water body","Fish kill or vegetation death","Odor/color description","CPCB complaint filed","Nearest population affected"],desc:"Industrial or agricultural chemical discharge contaminating a water source. For immediate CPCB escalation."},
  {id:"RPT-TPL-007",title:"Tourist Site Water Status",icon:"🏛️",color:"#1F5C45",colorBg:"#EDFAF3",fields:["Site name","Type (lake/river/waterfall/ghat)","Tourist footfall (approx/day)","Current water quality (visual)","Plastic waste level","Bathing/swimming safety","Recommended action","Best visit season"],desc:"Report on water quality and tourism readiness at scenic/heritage water sites for eco-tourism planning."},
];

// ─── MARKER SVG ───────────────────────────────────────────────────────────────
function getMarkerSVG(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44"><filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/></filter><path d="M16 0C7.163 0 0 7.163 0 16c0 10 10 20 16 28 6-8 16-18 16-28C32 7.163 24.837 0 16 0z" fill="${color}" filter="url(#s)"/><circle cx="16" cy="16" r="7" fill="white" opacity="0.95"/><circle cx="16" cy="16" r="4" fill="${color}"/></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── SECURE DEVELOPER ACCESS SYSTEM ──────────────────────────────────────────
// HOW IT WORKS (two-layer security):
//   LAYER 1 — Timed tap sequence: User must click the logo EXACTLY 5 times,
//             all within a 3-second window. Clicking too slowly resets the
//             counter. This prevents accidental discovery from random taps.
//   LAYER 2 — Password modal: After the sequence, a password prompt appears.
//             The password is: JSU@DEV#2025
//             Wrong password resets everything. 3 wrong attempts = 10 min lockout.
//   WHERE ADDED: handleLogoClick() function + DevPasswordModal component
//               + devLockout, devAttempts, devPwModal state variables
// ═══════════════════════════════════════════════════════════════════════════════
const DEV_PASSWORD = "JSU@DEV#2025"; // Change this before hosting!
const DEV_TAP_WINDOW_MS = 3000;       // All 5 taps must happen within 3 seconds
const DEV_LOCKOUT_MS = 10 * 60 * 1000; // 10 minute lockout after 3 wrong attempts

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const token = "PASTE_YOUR_TOKEN_HERE";

useEffect(() => {
  fetch("http://localhost:4000/api/water-sources?quality=Poor&status=critical", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}, []);

  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const markersRef = useRef([]);
  const tapTimerRef = useRef(null);
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("map");

  const [search, setSearch] = useState("");
  const [selState, setSelState] = useState(null);
  const [selDistrict, setSelDistrict] = useState(null);
  const [selSubdiv, setSelSubdiv] = useState(null);
  const [selBlock, setSelBlock] = useState(null);
  const [selVillage, setSelVillage] = useState(null);
  const [activeLayer, setActiveLayer] = useState(null);
  const [subdivList, setSubdivList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [loadingSD, setLoadingSD] = useState(false);
  const [loadingBL, setLoadingBL] = useState(false);
  const [loadingVL, setLoadingVL] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [waterRes, setWaterRes] = useState(WATER_RESOURCES_INIT);
  const [waterFilter, setWaterFilter] = useState("all");

  const [selTemplate, setSelTemplate] = useState(null);
  const [reportForm, setReportForm] = useState({});
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [submittedReports, setSubmittedReports] = useState([]);
  const [reportLat, setReportLat] = useState("");
  const [reportLng, setReportLng] = useState("");

  // Human Query (ticket-based, no AI)
  const [queryText, setQueryText] = useState("");
  const [queryName, setQueryName] = useState("");
  const [queryPhone, setQueryPhone] = useState("");
  const [queryCategory, setQueryCategory] = useState("General Query");
  const [queryDistrict, setQueryDistrict] = useState("");
  const [submittedQueries, setSubmittedQueries] = useState([]);
  const [querySubmitted, setQuerySubmitted] = useState(false);

  const [language, setLanguage] = useState("en");
  const [units, setUnits] = useState("Metric");
  const [alertEmail, setAlertEmail] = useState(true);
  const [alertSMS, setAlertSMS] = useState(true);

  // ── SECURE DEV ACCESS STATE ─────────────────────────────────────────────────
  // devTapCount: counts rapid taps within the time window
  // devPwModal: shows the password entry modal after sequence is completed
  // devPwInput: what user types into the password modal
  // devAttempts: number of wrong password attempts (max 3)
  // devLockoutUntil: timestamp until which access is locked
  // devMode: true only after both sequence AND correct password
  const [devTapCount, setDevTapCount] = useState(0);
  const [devPwModal, setDevPwModal] = useState(false);
  const [devPwInput, setDevPwInput] = useState("");
  const [devPwError, setDevPwError] = useState("");
  const [devAttempts, setDevAttempts] = useState(0);
  const [devLockoutUntil, setDevLockoutUntil] = useState(0);
  const [devMode, setDevMode] = useState(false);
  // ── END SECURE DEV ACCESS STATE ─────────────────────────────────────────────

  // ── LOGO CLICK HANDLER (Layer 1 of dev security) ───────────────────────────
  // Timed tap-sequence: 5 taps within DEV_TAP_WINDOW_MS milliseconds
  const handleLogoClick = useCallback(() => {
    // Check lockout first
    if (Date.now() < devLockoutUntil) {
      const mins = Math.ceil((devLockoutUntil - Date.now()) / 60000);
      setDevPwError(`Locked out. Try again in ${mins} min.`);
      setDevPwModal(true);
      return;
    }

    setDevTapCount(prev => {
      const next = prev + 1;
      // Clear existing timer and start a new one
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      tapTimerRef.current = setTimeout(() => {
        // If timer expires without reaching 5, silently reset
        setDevTapCount(0);
      }, DEV_TAP_WINDOW_MS);

      if (next >= 5) {
        // Sequence complete — clear timer and show password modal
        if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
        setDevPwModal(true);
        setDevPwInput("");
        setDevPwError("");
        return 0;
      }
      return next;
    });
  }, [devLockoutUntil]);

  // ── PASSWORD SUBMIT HANDLER (Layer 2 of dev security) ──────────────────────
  const handleDevPasswordSubmit = useCallback(() => {
    if (devPwInput === DEV_PASSWORD) {
      setDevMode(true);
      setDevPwModal(false);
      setDevPwInput("");
      setDevPwError("");
      setDevAttempts(0);
      setActiveView("developer");
      setMenuOpen(false);
    } else {
      const newAttempts = devAttempts + 1;
      setDevAttempts(newAttempts);
      if (newAttempts >= 3) {
        const lockUntil = Date.now() + DEV_LOCKOUT_MS;
        setDevLockoutUntil(lockUntil);
        setDevPwError("3 wrong attempts. Locked for 10 minutes.");
        setDevAttempts(0);
        setDevPwModal(false);
      } else {
        setDevPwError(`Incorrect password. ${3 - newAttempts} attempt(s) remaining.`);
      }
      setDevPwInput("");
    }
  }, [devPwInput, devAttempts]);
  // ── END DEV SECURITY ────────────────────────────────────────────────────────

  // ─── CSS ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "jsu-css";
    el.textContent = `
      @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Sora',sans-serif!important}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#CEC9C2;border-radius:2px}
      .s-item{padding:7px 14px;font-size:11.5px;cursor:pointer;transition:all 0.1s;border-left:2.5px solid transparent;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;justify-content:space-between;gap:6px}
      .s-item:hover{border-left-color:#52C288;background:rgba(46,149,96,0.06)}
      .spin{animation:spin 1s linear infinite}
      .fadeUp{animation:fadeUp 0.25s ease}
      .fadeIn{animation:fadeIn 0.2s ease}
      input:focus,textarea:focus,select:focus{outline:2px solid #2D9560!important;outline-offset:0}
      button:focus-visible{outline:2px solid #2D9560;outline-offset:2px}
    `;
    document.head.appendChild(el);
    return () => { const e = document.getElementById("jsu-css"); if(e) e.remove(); };
  }, []);

  // ─── MAP INIT ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapInst.current) return;
    (async () => {
      await loadGoogleMaps();
      const { Map } = await window.google.maps.importLibrary("maps");
      mapInst.current = new Map(mapRef.current, {
        center: { lat: 30.0668, lng: 79.0193 }, zoom: 7,
        mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
        zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
        styles: [
          {featureType:"water",elementType:"geometry",stylers:[{color:"#b8dce8"}]},
          {featureType:"landscape",elementType:"geometry",stylers:[{color:"#f0ede8"}]},
          {featureType:"road",elementType:"geometry",stylers:[{color:"#e8e4de"}]},
          {featureType:"poi.park",elementType:"geometry",stylers:[{color:"#c8e6c0"}]},
          {featureType:"administrative.country",elementType:"geometry.stroke",stylers:[{color:"#1F5C45"},{weight:1.5}]},
          {featureType:"administrative.province",elementType:"geometry.stroke",stylers:[{color:"#2D9560"},{weight:1}]},
        ],
      });
      placeMarkers(WATER_RESOURCES_INIT);
    })();
  }, []);

  useEffect(() => { placeMarkers(waterRes); }, [waterRes]);

  const placeMarkers = useCallback((resources) => {
    if (!mapInst.current || !window.google) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    resources.forEach(r => {
      if (!r.lat || !r.lng) return;
      const col = r.status === "critical" ? "#C0392B" : r.status === "alert" ? "#D68910" : "#2D9560";
      const marker = new window.google.maps.Marker({
        position: { lat: r.lat, lng: r.lng }, map: mapInst.current, title: r.name,
        icon: { url: getMarkerSVG(col), scaledSize: new window.google.maps.Size(28, 38), anchor: new window.google.maps.Point(14, 38) },
      });
      const qualCol = r.quality === "Good" ? "#27AE60" : r.quality === "Moderate" ? "#D68910" : "#C0392B";
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:'Sora',sans-serif;padding:8px 2px;min-width:210px;max-width:250px"><b style="font-size:13px;color:#1C1A16;display:block;margin-bottom:3px">${r.name}</b><div style="font-size:11px;color:#6B6660;margin-bottom:8px">${r.type} · ${r.state}${r.district ? ` · ${r.district}` : ""}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:8px">${[["Quality","<b style='color:"+qualCol+"'>"+r.quality+"</b>"],["Level","<b>"+r.level+"%</b>"],["pH","<b>"+r.ph+"</b>"],["TDS","<b>"+r.tds+" mg/L</b>"],["DO","<b>"+(r.do||"N/A")+" mg/L</b>"],["Purpose","<span style='font-size:10px'>"+r.purpose+"</span>"]].map(([l,v])=>`<div style="font-size:11px"><span style="color:#8E8880">${l}:</span> ${v}</div>`).join("")}</div>${r.note?`<div style="font-size:10.5px;color:#6B6660;border-top:1px solid #F0EDE8;padding-top:6px;line-height:1.5">${r.note}</div>`:""} ${r.tourists?`<div style="margin-top:6px"><span style="background:#FFF8EC;color:#92580A;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px">🏛 Tourist Site</span></div>`:""}<div style="font-size:10px;color:#B3AFA8;margin-top:6px">Updated ${r.lastUpdated}</div></div>`
      });
      marker.addListener("click", () => iw.open(mapInst.current, marker));
      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    if (!mapInst.current || !window.google) return;
    submittedReports.forEach(r => {
      if (!r.lat || !r.lng) return;
      const marker = new window.google.maps.Marker({
        position: { lat: r.lat, lng: r.lng }, map: mapInst.current, title: r.title,
        icon: { url: getMarkerSVG("#8E44AD"), scaledSize: new window.google.maps.Size(24, 32), anchor: new window.google.maps.Point(12, 32) },
      });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-family:'Sora',sans-serif;padding:8px;min-width:180px"><b>${r.templateTitle}</b><br/><span style="font-size:11px;color:#666">${r.title || "Report"}</span><br/><span style="font-size:10px;color:#B3AFA8">${r.date}</span></div>`
      });
      marker.addListener("click", () => iw.open(mapInst.current, marker));
      markersRef.current.push(marker);
    });
  }, [submittedReports]);

  const pan = (lat, lng, zoom) => {
    if (!mapInst.current || lat == null) return;
    mapInst.current.panTo({ lat, lng });
    mapInst.current.setZoom(zoom || 10);
  };

  // ─── LAYER HANDLERS ────────────────────────────────────────────────────────
  const handleState = (state) => {
    setSelState(state); setSelDistrict(null); setSelSubdiv(null); setSelBlock(null); setSelVillage(null);
    setSubdivList([]); setBlockList([]); setVillageList([]);
    pan(state.lat, state.lng, state.zoom); setActiveLayer("district"); setSearchTerm("");
  };
  const handleDistrict = (dist) => {
    setSelDistrict(dist); setSelSubdiv(null); setSelBlock(null); setSelVillage(null);
    setSubdivList([]); setBlockList([]); setVillageList([]);
    pan(dist.lat, dist.lng, dist.zoom || 10); setActiveLayer("subdiv"); setSearchTerm("");
    setLoadingSD(true);
    setTimeout(() => { setSubdivList(getSubDivisionsForDistrict(selState?.name, dist)); setLoadingSD(false); }, 300);
  };
  const handleSubdiv = (sd) => {
    setSelSubdiv(sd); setSelBlock(null); setSelVillage(null); setBlockList([]); setVillageList([]);
    pan(sd.lat, sd.lng, sd.zoom || 12); setActiveLayer("block"); setSearchTerm("");
    setLoadingBL(true);
    setTimeout(() => { setBlockList(getBlocksForSubdiv(selState?.name, sd)); setLoadingBL(false); }, 250);
  };
  const handleBlock = (bl) => {
    setSelBlock(bl); setSelVillage(null); setVillageList([]);
    pan(bl.lat, bl.lng, bl.zoom || 13); setActiveLayer("village"); setSearchTerm("");
    setLoadingVL(true);
    setTimeout(() => { setVillageList(getVillagesForBlock(selState?.name, bl)); setLoadingVL(false); }, 200);
  };
  const handleVillage = (v) => {
    setSelVillage(v); setActiveLayer(null); setSearchTerm("");
    pan(v.lat, v.lng, v.zoom || 15);
  };
  const handleReset = () => {
    setSelState(null); setSelDistrict(null); setSelSubdiv(null); setSelBlock(null); setSelVillage(null);
    setSubdivList([]); setBlockList([]); setVillageList([]); setActiveLayer(null); setSearchTerm("");
    if (mapInst.current) { mapInst.current.panTo({ lat: 30.0668, lng: 79.0193 }); mapInst.current.setZoom(7); }
  };

  const filterList = (list) => !searchTerm ? list : list.filter(i => (i.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
  const stateList = filterList(STATES.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase())));
  const districtList = filterList(DISTRICTS[selState?.name] || []);

  // ─── HUMAN QUERY SUBMIT ────────────────────────────────────────────────────
  const handleQuerySubmit = () => {
    if (!queryText.trim() || !queryName.trim()) return;
    const ticket = {
      id: `QRY-${Date.now()}`,
      name: queryName,
      phone: queryPhone,
      category: queryCategory,
      district: queryDistrict,
      message: queryText,
      date: new Date().toLocaleDateString("en-IN"),
      time: new Date().toLocaleTimeString("en-IN", {hour:"2-digit",minute:"2-digit"}),
      status: "Submitted",
      refNo: `JSU-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    setSubmittedQueries(p => [...p, ticket]);
    setQuerySubmitted(true);
    setQueryText(""); setQueryName(""); setQueryPhone(""); setQueryDistrict("");
    setQueryCategory("General Query");
    setTimeout(() => setQuerySubmitted(false), 4000);
  };

  // ─── REPORT SUBMIT ─────────────────────────────────────────────────────────
  const handleReportSubmit = () => {
    const r = {
      id: `RPT-${Date.now()}`,
      templateTitle: selTemplate.title,
      title: reportForm["Source Name"] || reportForm["Location"] || reportForm["Site name"] || selTemplate.title,
      date: new Date().toLocaleDateString("en-IN"),
      form: reportForm,
      lat: parseFloat(reportLat) || null,
      lng: parseFloat(reportLng) || null,
    };
    setSubmittedReports(p => [...p, r]);
    setReportSubmitted(true);
    setTimeout(() => { setReportSubmitted(false); setSelTemplate(null); setReportForm({}); setReportLat(""); setReportLng(""); }, 2200);
  };

  // ─── SHARED STYLES ─────────────────────────────────────────────────────────
  const card = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" };
  const inp = { border: `1px solid ${T.inputBorder}`, borderRadius: 8, padding: "8px 11px", fontSize: 12.5, fontFamily: "'Sora',sans-serif", outline: "none", background: T.input, width: "100%", color: T.text };
  const btnP = { padding: "8px 18px", borderRadius: 9, border: "none", background: T.accentDark, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" };
  const tag = (bg, fg) => ({ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: bg, color: fg, display: "inline-block" });

  function QBadge({ q }) {
    const m = { Good:["#27AE60","#EAFAF1"], Moderate:["#D68910","#FEF9E7"], Poor:["#C0392B","#FDEDEC"] };
    const [fg,bg] = m[q]||["#6B6660","#F0EDE8"];
    return <span style={{...tag(bg,fg)}}>{q}</span>;
  }
  function StatusBadge({ s }) {
    const m = { active:["#27AE60","#EAFAF1","Active"], alert:["#D68910","#FEF9E7","Alert"], critical:["#C0392B","#FDEDEC","Critical"] };
    const [fg,bg,label] = m[s]||["#6B6660","#F0EDE8",s];
    return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:bg,color:fg}}><span style={{width:6,height:6,borderRadius:"50%",background:fg,display:"inline-block"}}/>{label}</span>;
  }

  // ─── VIEW: WATER RESOURCES ─────────────────────────────────────────────────
  const renderWater = () => {
    const filtered = waterFilter==="all" ? waterRes : waterFilter==="tourist" ? waterRes.filter(w=>w.tourists) : waterRes.filter(w=>w.status===waterFilter);
    return (
      <div style={{padding:18}}>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
          {[["all","All Sources"],["active","Active"],["alert","Alert"],["critical","Critical"],["tourist","🏛 Tourist"]].map(([k,l])=>(
            <button key={k} onClick={()=>setWaterFilter(k)} style={{padding:"5px 13px",borderRadius:20,border:`1.5px solid ${waterFilter===k?T.accentDark:T.border}`,background:waterFilter===k?T.accentDark:T.card,color:waterFilter===k?"white":T.textSub,cursor:"pointer",fontSize:11.5,fontWeight:600,fontFamily:"'Sora',sans-serif"}}>{l}</button>
          ))}
        </div>
        <div style={{display:"grid",gap:11}}>
          {filtered.map(r=>(
            <div key={r.id} onClick={()=>{pan(r.lat,r.lng,13);setActiveView("map");}} style={{...card,padding:16,cursor:"pointer",borderColor:r.status==="critical"?"#C0392B":r.status==="alert"?"#D68910":T.border,borderWidth:r.status!=="active"?2:1}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10,gap:10}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>{r.name}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                    <StatusBadge s={r.status}/><span style={tag(T.accentLight,T.accentDark)}>{r.type}</span>
                    <span style={tag(T.sectionBg,T.textSub)}>{r.state}</span>
                    {r.tourists&&<span style={tag("#FFF8EC","#92580A")}>🏛 Tourist</span>}
                    <span style={tag("#EBF5FB","#2980B9")}>{r.purpose}</span>
                  </div>
                </div>
                <QBadge q={r.quality}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:8}}>
                {[["Level",`${r.level}%`,r.level<40?"#C0392B":r.level<65?"#D68910":"#27AE60"],["pH",r.ph,(r.ph<6.5||r.ph>8.5)?"#C0392B":"#2980B9"],["TDS",r.tds,r.tds>500?"#C0392B":r.tds>300?"#D68910":"#27AE60"],["DO",r.do||"N/A",r.do&&r.do<4?"#C0392B":"#27AE60"]].map(([lb,val,col])=>(
                  <div key={lb} style={{background:T.sectionBg,borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:T.textMuted,marginBottom:3}}>{lb}</div>
                    <div style={{fontSize:14,fontWeight:700,color:col,fontFamily:"'JetBrains Mono',monospace"}}>{val}</div>
                  </div>
                ))}
              </div>
              {r.note&&<div style={{fontSize:11.5,color:T.textSub,borderTop:`1px solid ${T.border}`,paddingTop:8,lineHeight:1.5}}>{r.note}</div>}
              <div style={{fontSize:10.5,color:T.textMuted,marginTop:6}}>Updated {r.lastUpdated} · Flow: {r.flow} · Area: {r.area}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── VIEW: REPORTS ─────────────────────────────────────────────────────────
  const renderReports = () => {
    if (reportSubmitted) return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:60,gap:18}}>
        <div style={{fontSize:52}}>✅</div>
        <div style={{fontSize:18,fontWeight:800,color:T.accent}}>Report Submitted!</div>
        <div style={{fontSize:13,color:T.textSub,textAlign:"center"}}>Your report has been logged and a marker placed on the map.</div>
      </div>
    );
    if (selTemplate) return (
      <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
        <button onClick={()=>{setSelTemplate(null);setReportForm({});}} style={{display:"flex",alignItems:"center",gap:7,border:`1px solid ${T.border}`,background:T.card,borderRadius:8,padding:"6px 13px",cursor:"pointer",marginBottom:16,fontSize:12,color:T.textSub,fontFamily:"'Sora',sans-serif"}}>← Back to templates</button>
        <div style={{...card,padding:20,marginBottom:14,borderColor:selTemplate.color,borderWidth:2}}>
          <div style={{fontSize:24,marginBottom:6}}>{selTemplate.icon}</div>
          <div style={{fontSize:16,fontWeight:800,color:T.text}}>{selTemplate.title}</div>
          <div style={{fontSize:12.5,color:T.textSub,marginTop:5,lineHeight:1.6}}>{selTemplate.desc}</div>
        </div>
        <div style={{...card,padding:18,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Report Fields</div>
          <div style={{display:"grid",gap:13}}>
            {selTemplate.fields.map(f=>(
              <div key={f}>
                <label style={{fontSize:12,fontWeight:600,color:T.textSub,display:"block",marginBottom:4}}>{f}</label>
                <input style={inp} placeholder={`Enter ${f.toLowerCase()}...`} value={reportForm[f]||""} onChange={e=>setReportForm(p=>({...p,[f]:e.target.value}))}/>
              </div>
            ))}
          </div>
        </div>
        <div style={{...card,padding:18,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>📍 Pin on Map (optional)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <div><label style={{fontSize:11.5,color:T.textSub,display:"block",marginBottom:4}}>Latitude</label><input style={inp} placeholder="e.g. 30.08" value={reportLat} onChange={e=>setReportLat(e.target.value)}/></div>
            <div><label style={{fontSize:11.5,color:T.textSub,display:"block",marginBottom:4}}>Longitude</label><input style={inp} placeholder="e.g. 78.26" value={reportLng} onChange={e=>setReportLng(e.target.value)}/></div>
          </div>
          <div style={{fontSize:11,color:T.textMuted}}>Get coordinates from Google Maps → right-click any point → copy lat,lng</div>
        </div>
        <button onClick={handleReportSubmit} style={{...btnP,width:"100%",padding:13,fontSize:14}}>Submit Report →</button>
      </div>
    );
    return (
      <div style={{padding:18}}>
        <div style={{...card,padding:18,marginBottom:20,background:T.accentLight,borderColor:T.accentBorder}}>
          <div style={{fontSize:14,fontWeight:700,color:T.accentDark,marginBottom:5}}>What to Report</div>
          <div style={{fontSize:12.5,color:T.accent,lineHeight:1.7}}>Select a report type below. Each template guides you through exactly what information to provide. Reports are reviewed by district water officers.</div>
        </div>
        {submittedReports.length>0&&(
          <div style={{marginBottom:18}}>
            <div style={{fontSize:11,fontWeight:700,color:T.textMuted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>My Submitted Reports ({submittedReports.length})</div>
            <div style={{display:"grid",gap:8}}>
              {submittedReports.map(r=>(
                <div key={r.id} style={{...card,padding:12,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                  <div><div style={{fontSize:12.5,fontWeight:700,color:T.text}}>{r.title}</div><div style={{fontSize:11,color:T.textSub}}>{r.templateTitle} · {r.date}</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>{r.lat&&<span style={tag("#F5EEF8","#8E44AD")}>📍 Mapped</span>}<span style={tag("#EAFAF1","#27AE60")}>Submitted</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{fontSize:11,fontWeight:700,color:T.textMuted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>Report Templates</div>
        <div style={{display:"grid",gap:11}}>
          {REPORT_TEMPLATES.map(t=>(
            <div key={t.id} onClick={()=>setSelTemplate(t)} style={{...card,padding:18,cursor:"pointer",borderLeft:`4px solid ${t.color}`,transition:"box-shadow 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.12)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{fontSize:28,flexShrink:0}}>{t.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:5}}>{t.title}</div>
                  <div style={{fontSize:12,color:T.textSub,lineHeight:1.6,marginBottom:10}}>{t.desc}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {t.fields.slice(0,4).map(f=><span key={f} style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:t.colorBg,color:t.color,fontWeight:600}}>{f}</span>)}
                    {t.fields.length>4&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:T.sectionBg,color:T.textSub}}>+{t.fields.length-4} more</span>}
                  </div>
                </div>
                <div style={{fontSize:18,color:T.textMuted,flexShrink:0}}>→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── VIEW: HUMAN QUERY (no AI — ticket/manual system) ─────────────────────
  // CHANGE from previous: This is NOT an AI assistant. It's a manual helpdesk
  // ticket system where users submit queries to human water officers.
  const renderQuery = () => (
    <div style={{padding:18,maxWidth:680,margin:"0 auto"}}>
      <div style={{...card,padding:20,marginBottom:18,background:T.accentLight,borderColor:T.accentBorder}}>
        <div style={{fontSize:14,fontWeight:700,color:T.accentDark,marginBottom:6}}>📋 Submit a Query to Water Officers</div>
        <div style={{fontSize:12.5,color:T.accent,lineHeight:1.8}}>Fill the form below to send your query to the District Water Resource Department. A human officer will respond within 2–4 working days. Reference number will be generated on submission.</div>
      </div>

      {querySubmitted&&(
        <div className="fadeIn" style={{...card,padding:20,marginBottom:18,borderColor:"#27AE60",borderWidth:2,background:T.goodBg}}>
          <div style={{fontSize:16,fontWeight:700,color:"#27AE60",marginBottom:6}}>✅ Query Submitted Successfully!</div>
          <div style={{fontSize:13,color:T.textSub,lineHeight:1.7}}>Your query has been submitted to the District Water Office. You will receive a response within <b>2–4 working days</b> on your registered phone number or email.</div>
        </div>
      )}

      {submittedQueries.length>0&&(
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>My Submitted Queries ({submittedQueries.length})</div>
          <div style={{display:"grid",gap:8}}>
            {[...submittedQueries].reverse().map(q=>(
              <div key={q.id} style={{...card,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:12.5,fontWeight:700,color:T.text}}>{q.category}</div>
                    <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{q.name} · {q.district||"General"} · {q.date} {q.time}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    <span style={tag(T.accentLight,T.accentDark)}>{q.refNo}</span>
                    <span style={tag("#FEF9E7","#D68910")}>Pending</span>
                  </div>
                </div>
                <div style={{fontSize:12,color:T.textSub,background:T.sectionBg,borderRadius:8,padding:"8px 10px",lineHeight:1.6}}>{q.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{...card,padding:22}}>
        <div style={{fontSize:11,fontWeight:700,color:T.textMuted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:18}}>New Query Form</div>
        <div style={{display:"grid",gap:15}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:T.textSub,display:"block",marginBottom:5}}>Your Name <span style={{color:"#C0392B"}}>*</span></label>
              <input style={inp} placeholder="Full name" value={queryName} onChange={e=>setQueryName(e.target.value)}/>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:T.textSub,display:"block",marginBottom:5}}>Mobile Number</label>
              <input style={inp} placeholder="+91 XXXXX XXXXX" value={queryPhone} onChange={e=>setQueryPhone(e.target.value)}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:T.textSub,display:"block",marginBottom:5}}>Query Category</label>
              <select style={inp} value={queryCategory} onChange={e=>setQueryCategory(e.target.value)}>
                {["General Query","Water Quality Complaint","New Source Report","Drought Alert","Scheme Enquiry","Data Correction","Technical Issue","Other"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:T.textSub,display:"block",marginBottom:5}}>Your District</label>
              <select style={inp} value={queryDistrict} onChange={e=>setQueryDistrict(e.target.value)}>
                <option value="">— Select district —</option>
                {(DISTRICTS["Uttarakhand"]||[]).map(d=><option key={d.name}>{d.name}</option>)}
                <option disabled>── Other States ──</option>
                <option>Other (specify in message)</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:T.textSub,display:"block",marginBottom:5}}>Your Query / Message <span style={{color:"#C0392B"}}>*</span></label>
            <textarea style={{...inp,minHeight:110,resize:"vertical",lineHeight:1.6}} placeholder="Describe your query in detail. Include location, source name, GPS coordinates if available, and any relevant observations…" value={queryText} onChange={e=>setQueryText(e.target.value)}/>
          </div>
          <div style={{background:T.sectionBg,borderRadius:10,padding:"10px 14px",fontSize:11.5,color:T.textSub,lineHeight:1.7}}>
            <b style={{color:T.text}}>📌 Important:</b> Your query will be reviewed by a qualified Water Resource Officer at the district level. For emergency situations (contamination, flood, pipeline burst), please also call the <b style={{color:T.accentDark}}>Water Helpline: 1800-180-4200</b> (toll-free).
          </div>
          <button onClick={handleQuerySubmit} disabled={!queryText.trim()||!queryName.trim()}
            style={{...btnP,width:"100%",padding:13,fontSize:14,opacity:(!queryText.trim()||!queryName.trim())?0.5:1,cursor:(!queryText.trim()||!queryName.trim())?"not-allowed":"pointer"}}>
            Submit Query to Water Office →
          </button>
        </div>
      </div>

      <div style={{...card,padding:16,marginTop:14,borderColor:T.border}}>
        <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:10}}>Other Ways to Reach Us</div>
        <div style={{display:"grid",gap:8}}>
          {[["📞 Toll-Free Helpline","1800-180-4200","24×7 Water Emergency"],["📧 Email","jalshakti@uk.gov.in","Response in 2–4 working days"],["🏢 District Office","Block Road, Dehradun 248001","Mon–Fri 10 AM–5 PM"],["🌐 Official Portal","ukjal.gov.in","View scheme status, reports"]].map(([icon,val,desc])=>(
            <div key={val} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:16,flexShrink:0}}>{icon.split(" ")[0]}</span>
              <div><div style={{fontSize:12.5,fontWeight:600,color:T.text}}>{val}</div><div style={{fontSize:11,color:T.textSub}}>{desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── VIEW: SETTINGS ────────────────────────────────────────────────────────
  const renderSettings = () => (
    <div style={{padding:18,maxWidth:540,margin:"0 auto"}}>
      {[
        {section:"Appearance",items:[{label:"Theme",desc:dark?"Dark Mode":"Light Mode",control:<button onClick={()=>setDark(d=>!d)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",borderRadius:20,border:`1.5px solid ${T.accentBorder}`,background:T.accentLight,color:T.accentDark,cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600}}>{dark?"☀️ Light":"🌙 Dark"}</button>}]},
        {section:"Language",items:[{label:"Interface Language",desc:INDIA_LANGUAGES.find(l=>l.code===language)?.native||"English",control:<select value={language} onChange={e=>setLanguage(e.target.value)} style={{...inp,width:"auto",minWidth:140}}>{INDIA_LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.native} — {l.name}</option>)}</select>}]},
        {section:"Alerts",items:[{label:"Email Alerts",desc:"Critical water level notifications",control:<button onClick={()=>setAlertEmail(a=>!a)} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${alertEmail?T.accentBorder:T.border}`,background:alertEmail?T.accentLight:T.card,color:alertEmail?T.accentDark:T.textSub,cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600}}>{alertEmail?"On":"Off"}</button>},{label:"SMS Alerts",desc:"Field staff critical alerts",control:<button onClick={()=>setAlertSMS(a=>!a)} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${alertSMS?T.accentBorder:T.border}`,background:alertSMS?T.accentLight:T.card,color:alertSMS?T.accentDark:T.textSub,cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600}}>{alertSMS?"On":"Off"}</button>}]},
        {section:"Data & Sync",items:[{label:"LGD Auto-Sync",desc:"Every 24 hours",control:<span style={tag(T.accentLight,T.accentDark)}>Active</span>},{label:"Data Export Format",desc:"For bulk exports",control:<select style={{...inp,width:"auto",minWidth:100}}>{["CSV","JSON","PDF","XLSX"].map(f=><option key={f}>{f}</option>)}</select>},{label:"Offline Cache",desc:"Last 48 hrs cached",control:<span style={tag("#EAFAF1","#27AE60")}>Enabled</span>}]},
        {section:"Units & Standards",items:[{label:"Measurement Units",desc:units,control:<select value={units} onChange={e=>setUnits(e.target.value)} style={{...inp,width:"auto",minWidth:100}}>{["Metric","Imperial"].map(u=><option key={u}>{u}</option>)}</select>},{label:"Water Standard",desc:"BIS IS:10500:2012",control:<span style={tag(T.sectionBg,T.textSub)}>Default</span>}]},
      ].map(({section,items})=>(
        <div key={section} style={{marginBottom:18}}>
          <div style={{fontSize:10.5,color:T.accent,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:9}}>{section}</div>
          <div style={{...card}}>
            {items.map(({label,desc,control},i)=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",borderBottom:i<items.length-1?`1px solid ${T.border}`:"none",gap:10}}>
                <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{label}</div><div style={{fontSize:11.5,color:T.textSub,marginTop:2}}>{desc}</div></div>
                {control}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ─── VIEW: ABOUT ───────────────────────────────────────────────────────────
  const renderAbout = () => (
    <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
      <div style={{background:"linear-gradient(135deg,#0D2B1F,#1F5C45)",borderRadius:16,padding:32,color:"white",marginBottom:18}}>
        <div style={{fontSize:11,letterSpacing:2,opacity:0.6,marginBottom:6}}>GOVERNMENT OF UTTARAKHAND</div>
        <div style={{fontSize:26,fontWeight:800,letterSpacing:-0.5,marginBottom:4}}>JAL SROT UTTARAKHAND</div>
        <div style={{fontSize:11,opacity:0.6,letterSpacing:2,marginBottom:18}}>जल स्रोत उत्तराखण्ड — WATER SOURCE DISCOVERY PLATFORM</div>
        <div style={{fontSize:14,lineHeight:1.75,opacity:0.9}}>JAL SROT UTTARAKHAND maps <b>all</b> natural and man-made water bodies across India — from major rivers and dams to unknown village springs, rain ponds, johads, and streams — enabling drought relief, conservation, and tourism discovery.</div>
        <div style={{marginTop:16,fontSize:11,opacity:0.5}}>Version 5.0 · LGD API v2 · 2025</div>
      </div>
      {[
        {h:"Administrative Hierarchy",body:"Follows India's LGD (Local Government Directory) — State → District → Sub-Division/Tehsil → Block/Mandal → Village/Town. Each level zooms the map precisely. Uttarakhand data is from the Revenue Department and LGD Directory."},
        {h:"Water Quality Standards",body:"All metrics follow BIS IS:10500:2012 and WHO Guidelines. Desirable TDS: ≤500 mg/L. pH: 6.5–8.5. DO: ≥5 mg/L. Turbidity: ≤1 NTU desirable."},
        {h:"JAL SROT Discovery Mission",body:"Millions of small water bodies remain unmapped. JAL SROT UTTARAKHAND creates a living map so planners can act on drought relief, protect sources, and promote eco-tourism to undiscovered water heritage."},
        {h:"Contact & Grievance",body:"Water Helpline: 1800-180-4200 (Toll-Free) | Email: jalshakti@uk.gov.in | Portal: ukjal.gov.in | For RTI queries contact State Information Commission."},
      ].map(({h,body})=>(
        <div key={h} style={{...card,padding:18,marginBottom:12}}>
          <div style={{fontSize:13.5,fontWeight:700,color:T.text,marginBottom:7}}>{h}</div>
          <div style={{fontSize:13,color:T.textSub,lineHeight:1.7}}>{body}</div>
        </div>
      ))}
    </div>
  );

  // ─── VIEW: PROFILE ─────────────────────────────────────────────────────────
  const renderProfile = () => (
    <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
      <div style={{...card,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#0D2B1F,#1F5C45)",padding:"30px 28px 50px"}}>
          <div style={{width:68,height:68,borderRadius:"50%",background:"rgba(255,255,255,0.22)",border:"3px solid rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:"white",fontWeight:700,marginBottom:10}}>RK</div>
          <div style={{color:"white",fontSize:20,fontWeight:700}}>Rajesh Kumar</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:3}}>Senior Water Resource Analyst · Ministry of Jal Shakti</div>
        </div>
        <div style={{margin:"-22px 20px 0",background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:18,position:"relative"}}>
          {[["Employee ID","MJS-2025-00412"],["Email","r.kumar@jalshakti.gov.in"],["Mobile","+91 98100 54321"],["Region Access","All India"],["Role","Analyst (Level 3)"],["Last Login","Today, 09:42 AM"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:12.5,color:T.textSub}}>{k}</span>
              <span style={{fontSize:12.5,fontWeight:600,color:T.text}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{padding:16,textAlign:"center",fontSize:11,color:T.textMuted}}>Managed by Admin · MJS IT Division</div>
      </div>
    </div>
  );

  // ─── VIEW: DEVELOPER CONSOLE ───────────────────────────────────────────────
  // WHERE DEVELOPER CODE LIVES:
  //   - Access triggered by: handleLogoClick (5 taps within 3 sec) + password modal
  //   - State: devMode, devTapCount, devPwModal, devPwInput, devPwError, devAttempts, devLockoutUntil
  //   - Security: DEV_PASSWORD constant, DEV_TAP_WINDOW_MS, DEV_LOCKOUT_MS
  //   - This view: renderDeveloper() — only renders if devMode === true
  const renderDeveloper = () => (
    <div style={{padding:18,maxWidth:680,margin:"0 auto"}}>
      <div style={{background:"#1C1A16",borderRadius:14,padding:22,marginBottom:18,color:"white",border:"1px solid #52C288"}}>
        <div style={{fontSize:16,fontWeight:800,marginBottom:6,color:"#52C288"}}>🔧 Developer Console</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.8,marginBottom:8}}>
          <b style={{color:"#52C288"}}>Access method:</b> Click the logo 5 times within 3 seconds → Password prompt appears → Enter <code style={{background:"#0D1410",color:"#52C288",padding:"1px 5px",borderRadius:3}}>JSU@DEV#2025</code><br/>
          <b style={{color:"#52C288"}}>Security layers:</b> (1) Timed sequence resets if too slow. (2) Password required. (3) 3 wrong attempts = 10-min lockout.
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Change DEV_PASSWORD constant before hosting. Never commit passwords to git.</div>
      </div>

      <div style={{fontSize:10.5,color:"#2D9560",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Add Water Source (Code)</div>
      <div style={{background:"#141F1A",border:"1px solid #1F3028",borderRadius:12,padding:16,marginBottom:18}}>
        <div style={{background:"#0D1410",borderRadius:8,padding:14,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"#8EDAB5",lineHeight:1.8,overflowX:"auto",whiteSpace:"pre"}}>
{`// Add to WATER_RESOURCES_INIT array:
{
  id: ${Date.now()},
  name: "River Name — Location",
  type: "River", // River/Lake/Dam/Canal/Pond/Spring
  state: "Uttarakhand",
  district: "Dehradun",
  lat: 30.08,   // from Google Maps right-click
  lng: 78.26,
  quality: "Good", // Good/Moderate/Poor
  level: 75,   // 0-100 %
  ph: 7.1, tds: 145, do: 8.0, turbidity: 5,
  lastUpdated: "2025",
  status: "active", // active/alert/critical
  purpose: "Drinking+Irrigation",
  flow: "320 cusecs", area: "NA",
  tourists: false,
  note: "Description here"
}`}
        </div>
      </div>

      <div style={{fontSize:10.5,color:"#2D9560",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Deployment Guide</div>
      <div style={{background:"#141F1A",border:"1px solid #1F3028",borderRadius:12,padding:18,marginBottom:18}}>
        {[
          ["Google Maps API","Replace key in loadGoogleMaps(). Restrict to your domain in Google Cloud Console."],
          ["Anthropic API","Query view is now human/manual — no API key needed for queries. If re-enabling AI, use backend proxy."],
          ["Water Data Backend","Replace WATER_RESOURCES_INIT: fetch('/api/water-sources').then(r=>r.json()). Use PostGIS."],
          ["Dev Password","Change DEV_PASSWORD constant to a strong secret. Store in env var, not hardcoded, for production."],
          ["Hosting","Vercel / AWS Amplify / Nginx. Set HTTPS. Add Content-Security-Policy headers. Use env vars."],
          ["LGD Integration","lgdirectory.gov.in/api/v1 for live administrative data to replace STATES/DISTRICTS."],
        ].map(([title,body])=>(
          <div key={title} style={{borderBottom:"1px solid #1F3028",paddingBottom:12,marginBottom:12}}>
            <div style={{fontSize:12.5,fontWeight:700,color:"#52C288",marginBottom:5}}>{title}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>{body}</div>
          </div>
        ))}
      </div>

      <div style={{fontSize:10.5,color:"#2D9560",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Official Data Sources</div>
      <div style={{background:"#141F1A",border:"1px solid #1F3028",borderRadius:12,overflow:"hidden",marginBottom:18}}>
        {[["LGD Directory","lgdirectory.gov.in","Administrative hierarchy"],["BIS Water Standards","bis.gov.in","IS:10500:2012"],["CPCB Water Data","cpcb.nic.in","Central Pollution Control Board"],["India WRIS","indiawris.gov.in","Water Resource Information System"],["JJM Dashboard","ejalshakti.gov.in","Jal Jeevan Mission data"],["UK Jal Sansthan","ukjal.gov.in","Uttarakhand water authority"]].map(([name,url,desc])=>(
          <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",borderBottom:"1px solid #1F3028"}}>
            <div><div style={{fontSize:12.5,fontWeight:600,color:"rgba(255,255,255,0.8)"}}>{name}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{desc}</div></div>
            <a href={`https://${url}`} target="_blank" rel="noreferrer" style={{color:"#52C288",fontSize:11.5,fontWeight:600,textDecoration:"none"}}>{url} →</a>
          </div>
        ))}
      </div>
      <button onClick={()=>{setDevMode(false);setActiveView("map");}} style={{padding:"9px 18px",borderRadius:9,border:"1px solid #1F3028",background:"#0D1410",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:12}}>Exit Developer Mode</button>
    </div>
  );

  // ─── LAYER CONFIG ──────────────────────────────────────────────────────────
  const layers = [
    {key:"state",label:"State / UT",selected:selState?.name,items:stateList,count:STATES.length,disabled:false,done:!!selState,loading:false,icon:"S",handler:handleState},
    {key:"district",label:"District",selected:selDistrict?.name,items:districtList,count:districtList.length,disabled:!selState,done:!!selDistrict,loading:false,icon:"D",handler:handleDistrict},
    {key:"subdiv",label:"Sub-Division / Tehsil",selected:selSubdiv?.name,items:filterList(subdivList),count:subdivList.length,disabled:!selDistrict,done:!!selSubdiv,loading:loadingSD,icon:"T",handler:handleSubdiv},
    {key:"block",label:"Block / Mandal",selected:selBlock?.name,items:filterList(blockList),count:blockList.length,disabled:!selSubdiv,done:!!selBlock,loading:loadingBL,icon:"B",handler:handleBlock},
    {key:"village",label:"Village / Town / Area",selected:selVillage?.name,items:filterList(villageList),count:villageList.length,disabled:!selBlock,done:!!selVillage,loading:loadingVL,icon:"V",handler:handleVillage},
  ];

  const levelLabel = selVillage?`${selVillage.type||"Area"}: ${selVillage.name}`:selBlock?`Block: ${selBlock.name}`:selSubdiv?`Tehsil: ${selSubdiv.name}`:selDistrict?`District: ${selDistrict.name}`:selState?`State: ${selState.name}`:"National View — India";

  const menuItems = [
    {id:"profile",label:"Profile",icon:"M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"},
    {id:"water",label:"Water Resources",icon:"M12 2.4C9.6 7.2 4.8 10 4.8 14.4c0 3.98 3.22 7.2 7.2 7.2s7.2-3.22 7.2-7.2C19.2 10 14.4 7.2 12 2.4z"},
    {id:"query",label:"Query / Helpdesk",icon:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"},
    {id:"reports",label:"Submit Report",icon:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"},
    {id:"settings",label:"Settings",icon:"M12 15a3 3 0 100-6 3 3 0 000 6z"},
    {id:"about",label:"About JAL SROT UK",icon:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"},
    ...(devMode?[{id:"developer",label:"Developer Console",icon:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",dev:true}]:[]),
    {id:"logout",label:"Logout",icon:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",danger:true},
  ];

  const viewTitles = {profile:"My Profile",water:"Water Resources",query:"Query / Helpdesk",reports:"Submit a Report",developer:"Developer Console",settings:"Settings",about:"About JAL SROT UK"};
  const viewSubtitles = {water:`${waterRes.length} sources mapped · ${waterRes.filter(w=>w.tourists).length} tourist sites`,query:"Human-staffed water query desk"};

  return (
    <div style={{fontFamily:"'Sora',sans-serif",height:"100vh",overflow:"hidden",background:T.bg}}>

      {/* ══ SECURE DEV PASSWORD MODAL ═══════════════════════════════════════════
          Appears ONLY after the timed 5-tap logo sequence is completed.
          Requires password: JSU@DEV#2025
          Wrong password tracked; 3 failures = 10-min lockout.
          WHERE: handleDevPasswordSubmit() + devPwModal state
      ══════════════════════════════════════════════════════════════════════════ */}
      {devPwModal && (
        <div className="fadeIn" style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#141F1A",border:"1px solid #2D9560",borderRadius:16,padding:32,maxWidth:360,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
            <div style={{fontSize:22,marginBottom:4}}>🔐</div>
            <div style={{fontSize:16,fontWeight:800,color:"#52C288",marginBottom:4}}>Developer Access</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:20,lineHeight:1.6}}>Enter the developer password to continue. This area is for authorised personnel only.</div>
            <input
              type="password"
              placeholder="Enter developer password"
              value={devPwInput}
              onChange={e=>{setDevPwInput(e.target.value);setDevPwError("");}}
              onKeyDown={e=>e.key==="Enter"&&handleDevPasswordSubmit()}
              autoFocus
              style={{width:"100%",background:"#0A120D",border:`1.5px solid ${devPwError?"#E05245":"#1F3028"}`,borderRadius:8,padding:"10px 13px",fontSize:13,color:"#E8E4DD",fontFamily:"'JetBrains Mono',monospace",outline:"none",marginBottom:10}}
            />
            {devPwError&&<div style={{fontSize:11.5,color:"#E05245",marginBottom:10,lineHeight:1.5}}>{devPwError}</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setDevPwModal(false);setDevPwInput("");setDevPwError("");setDevTapCount(0);}}
                style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid #1F3028",background:"#0A120D",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:12}}>Cancel</button>
              <button onClick={handleDevPasswordSubmit}
                style={{flex:2,padding:"9px",borderRadius:8,border:"none",background:devPwInput?"#1F5C45":"#1F3028",color:devPwInput?"white":"rgba(255,255,255,0.2)",cursor:devPwInput?"pointer":"not-allowed",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600}}>Verify →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOPBAR ── */}
      <div style={{position:"fixed",top:0,left:0,width:"100%",height:58,background:T.topbar,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 18px",color:"white",zIndex:100,boxShadow:"0 2px 20px rgba(13,43,31,0.4)"}}>
        {/* Logo — clicking 5 times within 3 seconds triggers dev sequence */}
        <div onClick={handleLogoClick} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",flexShrink:0,userSelect:"none"}} title="JAL SROT UTTARAKHAND">
          <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"1.5px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2.4C9.6 7.2 4.8 10 4.8 14.4c0 3.98 3.22 7.2 7.2 7.2s7.2-3.22 7.2-7.2C19.2 10 14.4 7.2 12 2.4z" fill="rgba(255,255,255,0.9)"/></svg>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:14,letterSpacing:1.5,lineHeight:1}}>JAL SROT UTTARAKHAND</div>
            <div style={{fontSize:8,opacity:0.55,letterSpacing:2,fontWeight:500}}>जल स्रोत उत्तराखण्ड · WATER SOURCE PLATFORM</div>
          </div>
          {devMode&&<span style={{background:"#52C288",color:"#0D1410",fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,letterSpacing:0.5}}>DEV</span>}
        </div>
        <div style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.22)",borderRadius:22,display:"flex",alignItems:"center",padding:"6px 13px",gap:8,flex:1,maxWidth:320,margin:"0 14px"}}>
          <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search states, districts..." style={{flex:1,border:"none",outline:"none",background:"transparent",color:"white",fontSize:13,fontFamily:"'Sora',sans-serif"}}/>
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
          <span onClick={()=>setDark(d=>!d)} style={{cursor:"pointer",fontSize:16,opacity:0.8}} title="Toggle theme">{dark?"☀️":"🌙"}</span>
          {[["36","States"],["800+","Dists"],[`${waterRes.length}`,"Sources"]].map(([v,l])=>(
            <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",background:"rgba(255,255,255,0.13)",border:"1px solid rgba(255,255,255,0.22)",borderRadius:9,padding:"4px 10px"}}>
              <div style={{fontWeight:800,fontSize:11.5,lineHeight:1.2}}>{v}</div>
              <div style={{fontSize:8,opacity:0.6,letterSpacing:0.3}}>{l}</div>
            </div>
          ))}
          <button onClick={()=>setMenuOpen(o=>!o)} style={{border:"none",background:"rgba(255,255,255,0.12)",borderRadius:9,width:38,height:38,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5}} aria-label="Menu">
            {[0,1,2].map(i=><span key={i} style={{width:menuOpen&&i===1?10:18,height:2,borderRadius:2,background:"white",display:"block",opacity:menuOpen&&i===1?0.4:1}}/>)}
          </button>
        </div>
      </div>

      {/* ── SIDEBAR OVERLAY ── */}
      {menuOpen&&<div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:150,background:"rgba(13,43,31,0.35)",backdropFilter:"blur(3px)"}}/>}

      {/* ── SIDEBAR ── */}
      <div style={{position:"fixed",top:0,right:0,height:"100vh",width:265,background:T.sidebar,transform:menuOpen?"translateX(0)":"translateX(100%)",transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",boxShadow:menuOpen?"-8px 0 40px rgba(13,43,31,0.2)":"none",zIndex:200,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"22px 18px 16px",background:"linear-gradient(135deg,#0D2B1F,#1F5C45)"}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"white"}}>RK</div>
            <div><div style={{color:"white",fontWeight:700,fontSize:14}}>Rajesh Kumar</div><div style={{color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:2}}>Senior Analyst · MJS</div></div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px 10px"}}>
          <div onClick={()=>{setActiveView("map");setMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 14px",borderRadius:10,cursor:"pointer",background:activeView==="map"?T.navActive:"transparent",color:activeView==="map"?T.accentDark:T.textSub,fontSize:13,marginBottom:2}}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            Map Explorer
          </div>
          {menuItems.map(({id,label,icon,danger,dev})=>(
            <div key={id} onClick={()=>{setMenuOpen(false);if(id==="logout")alert("Logged out");else setActiveView(id);}}
              style={{display:"flex",alignItems:"center",gap:11,padding:"9px 14px",borderRadius:10,cursor:"pointer",background:activeView===id?T.navActive:"transparent",color:danger?"#C0392B":dev?"#52C288":activeView===id?T.accentDark:T.textSub,fontSize:13,marginBottom:2}}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={icon}/></svg>
              {label}
              {dev&&<span style={{marginLeft:"auto",background:"#52C288",color:"#0D1410",fontSize:8,fontWeight:800,padding:"1px 5px",borderRadius:3}}>DEV</span>}
            </div>
          ))}
        </div>
        <div style={{padding:"12px 14px",borderTop:`1px solid ${T.border}`}}>
          <div style={{fontSize:10.5,color:T.textMuted,textAlign:"center",lineHeight:1.6}}>
            <a href="https://lgdirectory.gov.in" target="_blank" rel="noreferrer" style={{color:T.accent,textDecoration:"none",fontWeight:700}}>lgdirectory.gov.in</a> · Ministry of Panchayati Raj<br/>
            <span style={{fontSize:10}}>JAL SROT UTTARAKHAND v5.0 · 2025</span>
          </div>
        </div>
      </div>

      {/* ── MAP ── */}
      <div ref={mapRef} style={{width:"100%",height:"100vh",paddingTop:58,display:activeView==="map"?"block":"none"}}/>

      {/* ── NON-MAP VIEWS ── */}
      {activeView!=="map"&&(
        <div style={{paddingTop:58,height:"100vh",overflowY:"auto",background:T.bg,paddingBottom:52}}>
          <div style={{background:T.card,borderBottom:`1px solid ${T.border}`,padding:"14px 22px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}>
            <button onClick={()=>setActiveView("map")} style={{border:`1px solid ${T.border}`,background:T.card,borderRadius:8,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} aria-label="Back to map">
              <svg width="13" height="13" fill="none" stroke={T.textSub} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <div style={{fontSize:17,fontWeight:800,color:T.text}}>{viewTitles[activeView]}</div>
              {viewSubtitles[activeView]&&<div style={{fontSize:11.5,color:T.textSub,marginTop:1}}>{viewSubtitles[activeView]}</div>}
            </div>
          </div>
          {activeView==="profile"&&renderProfile()}
          {activeView==="water"&&renderWater()}
          {activeView==="query"&&renderQuery()}
          {activeView==="reports"&&renderReports()}
          {activeView==="developer"&&devMode&&renderDeveloper()}
          {activeView==="developer"&&!devMode&&<div style={{padding:40,textAlign:"center",color:T.textMuted}}>Access denied.</div>}
          {activeView==="settings"&&renderSettings()}
          {activeView==="about"&&renderAbout()}
        </div>
      )}

      {/* ── LEFT LAYER PANEL (map only) ── */}
      {activeView==="map"&&(
        <div style={{position:"fixed",top:68,left:10,width:242,zIndex:50,display:"flex",flexDirection:"column",gap:5}} className="fadeUp">
          {layers.map((layer)=>{
            const isOpen=activeLayer===layer.key;
            return (
              <div key={layer.key} style={{background:dark?"rgba(20,31,26,0.97)":"rgba(255,255,255,0.97)",borderRadius:12,boxShadow:layer.done?"0 2px 14px rgba(13,43,31,0.15)":"0 1px 6px rgba(13,43,31,0.07)",border:layer.done?`1.5px solid #52C288`:`1px solid ${T.border}`,overflow:"hidden"}}>
                <div onClick={()=>{if(layer.disabled)return;setActiveLayer(isOpen?null:layer.key);setSearchTerm("");}} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",cursor:layer.disabled?"not-allowed":"pointer",opacity:layer.disabled?0.35:1}}>
                  <div style={{width:22,height:22,borderRadius:6,flexShrink:0,background:layer.done?"#1F5C45":layer.disabled?T.border:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8.5,fontWeight:800,color:layer.done?"white":T.accent}}>
                    {layer.done?"✓":layer.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10.5,fontWeight:700,color:T.text,letterSpacing:0.2}}>{layer.label}</div>
                    {layer.done
                      ?<div style={{fontSize:11,color:T.accent,fontWeight:600,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{layer.selected}</div>
                      :<div style={{fontSize:10,color:T.textMuted,marginTop:1}}>{layer.disabled?"Select above first":layer.loading?"Loading…":`${layer.count} available`}</div>
                    }
                  </div>
                  {layer.loading&&<svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2D9560" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>}
                  {!layer.disabled&&!layer.loading&&<svg width="11" height="11" fill="none" stroke={T.textMuted} strokeWidth="2" viewBox="0 0 24 24" style={{transform:isOpen?"rotate(180deg)":"rotate(0)",transition:"0.2s",flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>}
                </div>
                {isOpen&&!layer.disabled&&(
                  <div style={{borderTop:`1px solid ${T.border}`}}>
                    <div style={{padding:"5px 8px",borderBottom:`1px solid ${T.border}`}}>
                      <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder={`Search ${layer.label.toLowerCase()}...`} style={{...inp,fontSize:11,width:"100%"}}/>
                    </div>
                    <div style={{maxHeight:190,overflowY:"auto"}}>
                      {layer.loading
                        ?<div style={{padding:12,textAlign:"center",fontSize:11.5,color:T.textSub}}>Loading…</div>
                        :layer.items.length===0
                          ?<div style={{padding:"9px 12px",fontSize:11.5,color:T.textMuted}}>{searchTerm?"No results":"No data"}</div>
                          :layer.items.map((item,i)=>{
                            const name=item.name||item;
                            const isSel=name===layer.selected;
                            return (
                              <div key={i} className="s-item" onClick={()=>layer.handler(item)} title={name}
                                style={{fontSize:11.5,cursor:"pointer",borderLeft:`2.5px solid ${isSel?"#2D9560":"transparent"}`,background:isSel?T.accentLight:"transparent",color:isSel?T.accentDark:T.text}}>
                                <span style={{overflow:"hidden",textOverflow:"ellipsis",flex:1}}>{name}</span>
                                <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
                                  {item.ut&&<span style={{background:"#FBE5B4",color:"#92580A",fontSize:8.5,fontWeight:700,padding:"1px 4px",borderRadius:3}}>UT</span>}
                                  {item.type&&<span style={{fontSize:9,color:T.textMuted}}>{item.type}</span>}
                                  {isSel&&<span style={{color:"#2D9560",fontSize:9}}>●</span>}
                                </div>
                              </div>
                            );
                          })
                      }
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {(selState||selDistrict||selSubdiv||selBlock||selVillage)&&(
            <button onClick={handleReset} style={{width:"100%",padding:9,borderRadius:10,border:`1.5px solid ${T.accentBorder}`,background:dark?"#0D2B1F":"white",color:T.accentDark,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>↺ Reset to India View</button>
          )}
        </div>
      )}

      {/* ── LEVEL INDICATOR ── */}
      {activeView==="map"&&(
        <div style={{position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",background:dark?"rgba(20,31,26,0.97)":"rgba(255,255,255,0.96)",borderRadius:10,padding:"7px 16px",boxShadow:"0 2px 12px rgba(13,43,31,0.12)",fontSize:11.5,color:T.text,fontWeight:600,zIndex:10,border:`1px solid ${T.border}`,whiteSpace:"nowrap",maxWidth:"50vw",overflow:"hidden",textOverflow:"ellipsis"}}>
          📍 {levelLabel}
        </div>
      )}

      {/* ── LEGEND ── */}
      {activeView==="map"&&(
        <div style={{position:"fixed",bottom:22,right:10,background:dark?"rgba(20,31,26,0.97)":"rgba(255,255,255,0.97)",borderRadius:11,padding:"10px 14px",boxShadow:"0 2px 12px rgba(13,43,31,0.15)",zIndex:10,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,fontWeight:700,color:T.textSub,marginBottom:7,letterSpacing:0.5}}>WATER SOURCES</div>
          {[["#2D9560","Active"],["#D68910","Alert"],["#C0392B","Critical"],["#8E44AD","Reported"]].map(([col,label])=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <svg width="12" height="16" viewBox="0 0 32 44"><path d="M16 0C7.163 0 0 7.163 0 16c0 10 10 20 16 28 6-8 16-18 16-28C32 7.163 24.837 0 16 0z" fill={col}/></svg>
              <span style={{fontSize:11,color:T.text}}>{label}</span>
            </div>
          ))}
          <div style={{marginTop:5,fontSize:9.5,color:T.textMuted}}>Click marker for details</div>
        </div>
      )}

      {/* ── BREADCRUMB ── */}
      {activeView==="map"&&selState&&(
        <div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:"rgba(13,43,31,0.92)",backdropFilter:"blur(10px)",borderRadius:28,padding:"9px 20px",color:"white",fontSize:12,fontWeight:500,zIndex:50,display:"flex",alignItems:"center",gap:5,boxShadow:"0 6px 28px rgba(13,43,31,0.5)",whiteSpace:"nowrap",maxWidth:"70vw",overflow:"hidden"}}>
          {[selState?.name,selDistrict?.name,selSubdiv?.name,selBlock?.name,selVillage?.name].filter(Boolean).map((s,i,arr)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
              {i>0&&<span style={{opacity:0.4,fontSize:13}}>›</span>}
              <span style={{opacity:i===arr.length-1?1:0.6,overflow:"hidden",textOverflow:"ellipsis",maxWidth:100}}>{s}</span>
            </span>
          ))}
        </div>
      )}

      {/* ── FOOTER ── */}
      {activeView!=="map"&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"linear-gradient(135deg,#0D2B1F,#1A4332)",padding:"9px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:40}}>
          <div style={{fontSize:10.5,color:"rgba(255,255,255,0.5)"}}>JAL SROT UTTARAKHAND — जल स्रोत उत्तराखण्ड · Water Source Discovery · GoUK</div>
          <div style={{fontSize:10.5,color:"rgba(255,255,255,0.5)"}}>BIS IS:10500 · LGD v2 · v5.0</div>
        </div>
      )}
    </div>
  );
}