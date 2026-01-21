export const globalAlerts = [
  {
    id: "EQ-01",
    type: "EARTHQUAKE",
    location: "Himachal Pradesh",
    magnitude: "6.2",
    details: "RED ALERT",
    impact: "15,000 people affected",
    time: "20 mins ago",
    color: "red"
  },
  {
    id: "FL-02",
    type: "FLOOD",
    location: "Assam Region B",
    magnitude: "Severe",
    details: "ORANGE ALERT",
    impact: "Critical infrastructure at risk",
    time: "4 hours ago",
    color: "orange"
  }
];

export const camps = [
  { 
    id: 1, 
    name: "Kerala Relief Hub A", 
    status: "CRITICAL", 
    urgencyScore: 92, 
    population: 1240,
    stock: { food: "2 days", water: "4 hrs", medicine: "Low" },
    image: "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=800&q=80" // Placeholder image
  },
  { 
    id: 2, 
    name: "Gujarat Coastal Shelter", 
    status: "STABLE", 
    urgencyScore: 45, 
    population: 850,
    stock: { food: "10 days", water: "12 days", medicine: "Full" },
    incomingAid: "Seva Foundation > Food Kits (ETA: 2h)",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"
  }
];

export const coordinationChat = [
  { user: "Gov Command", msg: "NDRF team deployed to Himachal.", time: "10:00 AM" },
  { user: "NGO HelpIndia", msg: "We are sending 500 blankets to Kerala Hub A.", time: "10:05 AM" },
  { user: "System", msg: "Alert: Duplicate relief detected at Gujarat Shelter.", type: "warning", time: "10:12 AM" }
];